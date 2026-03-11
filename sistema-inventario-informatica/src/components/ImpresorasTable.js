"use client";
import { useState, useEffect } from "react";
import { FaEdit, FaSearch, FaArrowUp, FaArrowDown, FaPlus, FaCheckCircle, FaTrash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import api from "@/api/apiConfig";
import { toast } from 'react-hot-toast';

import ImpresoraModal from "./ImpresoraModal";
import ImpresoraDetailsModal from "./ImpresoraDetailsModal";

const ImpresorasTable = () => {
    const { user } = useAuth();
    const router = useRouter();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [operativoFilter, setOperativoFilter] = useState("ALL"); // ALL, SI, NO, ROBADO
    const [tipoFilter, setTipoFilter] = useState("ALL"); // ALL, Impresora, Escáner
    const [sedeFilter, setSedeFilter] = useState("ALL");
    const [seccionFilter, setSeccionFilter] = useState("ALL");
    const [soFilter, setSoFilter] = useState("ALL");
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
    const [currentPage, setCurrentPage] = useState(1);
    const [isInitialized, setIsInitialized] = useState(false);

    // Persistence Logic: Restore page on mount
    useEffect(() => {
        const savedPage = sessionStorage.getItem("inventarioPage");
        if (savedPage) {
            setCurrentPage(parseInt(savedPage, 10));
        }
        setIsInitialized(true);
    }, []);

    // Persistence Logic: Save page on change
    useEffect(() => {
        if (isInitialized) {
            sessionStorage.setItem("inventarioPage", currentPage.toString());
        }
    }, [currentPage, isInitialized]);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    // Details Modal State
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [viewItem, setViewItem] = useState(null);

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const itemsPerPage = 10;

    useEffect(() => {
        fetchData();
    }, []);



    const fetchData = async () => {
        try {
            const response = await api.get("/impresoras");
            // Normalize 'Aysén' to 'Aysen'
            const normalizedData = response.data
                .map(item => ({
                    ...item,
                    sede: item.sede && item.sede.includes('Aysén') ? item.sede.replace('Aysén', 'Aysen') : item.sede
                }));
            setData(normalizedData);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };

    const applyFilters = (excludeKey = null) => {
        let filtered = data;

        // Text Search
        if (searchTerm) {
            filtered = filtered.filter((item) =>
                Object.values(item).some(
                    (val) => val && String(val).toLowerCase().includes(searchTerm)
                )
            );
        }

        // Operativo Filter
        if (operativoFilter !== "ALL" && excludeKey !== "operativo") {
            filtered = filtered.filter((item) => {
                const op = item.operativo ? String(item.operativo).toUpperCase() : "NO";
                return op === operativoFilter;
            });
        }

        // Tipo Filter
        if (tipoFilter !== "ALL" && excludeKey !== "tipo") {
            filtered = filtered.filter((item) => {
                const tipo = item.tipo || "Impresora";
                return tipo === tipoFilter;
            });
        }

        // Sede Filter
        if (sedeFilter !== "ALL" && excludeKey !== "sede") {
            filtered = filtered.filter((item) => item.sede && item.sede.toUpperCase() === sedeFilter);
        }

        // Seccion Filter
        if (seccionFilter !== "ALL" && excludeKey !== "seccion") {
            filtered = filtered.filter((item) => item.unidad && item.unidad.trim().toUpperCase() === seccionFilter);
        }

        // SO Filter not applicable for Printers usually, but leaving it disabled/hidden in UI later
        if (soFilter !== "ALL" && excludeKey !== "so") {
            filtered = filtered.filter((item) => item.sistema_operativo && item.sistema_operativo.toUpperCase() === soFilter);
        }

        return filtered;
    };

    // Calculate options based on *other* active filters (Cross-Filtering)
    // 1. Available Sedes: Filtered by Everything EXCEPT Sede
    const availableSedesData = applyFilters("sede");
    const uniqueSedes = [...new Set(availableSedesData.map(item => item.sede ? item.sede.toUpperCase() : "").filter(Boolean))].sort();

    // 2. Available Sections: Filtered by Everything EXCEPT Section
    const availableSeccionesData = applyFilters("seccion");
    const uniqueSecciones = [...new Set(availableSeccionesData.map(item => item.unidad ? item.unidad.trim().toUpperCase() : "").filter(Boolean))].sort();

    // 3. Available SOs: Filtered by Everything EXCEPT SO
    const availableSosData = applyFilters("so");
    const uniqueSos = [...new Set(availableSosData.map(item => item.sistema_operativo ? item.sistema_operativo.toUpperCase() : "").filter(Boolean))].sort();

    // 4. Available Statuses: Filtered by Everything EXCEPT Status
    const availableStatusData = applyFilters("operativo");
    const hasActivos = availableStatusData.some(i => i.operativo && String(i.operativo).toUpperCase().trim() === 'SI');
    const hasInactivos = availableStatusData.some(i => i.operativo && String(i.operativo).toUpperCase().trim() === 'NO');
    const hasRobados = availableStatusData.some(i => i.operativo && String(i.operativo).toUpperCase().trim() === 'ROBADO');

    // Final filtered data for the table (Apply ALL filters & Sorting)
    const baseFilteredData = applyFilters();
    const filteredData = [...baseFilteredData].sort((a, b) => {
        if (!sortConfig.key) {
            // Default sort: ID ascending to keep position stable
            return (a.id_impresora || 0) - (b.id_impresora || 0);
        }
        const key = sortConfig.key;
        if (!a[key]) return 1;
        if (!b[key]) return -1;

        const valA = String(a[key]).toLowerCase();
        const valB = String(b[key]).toLowerCase();

        if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
    });

    // Pagination reset effect extracted
    const handleSearch = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
        setCurrentPage(1);
    };

    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const handleEdit = (item, e) => {
        e.stopPropagation(); // Avoid triggering row click
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const handleToggleRevisado = async (item, e) => {
        e.stopPropagation();
        try {
            const updatedItem = { ...item, revisado: !item.revisado };
            await api.put(`/impresoras/${item.id_impresora}`, updatedItem);
            // Optimistic update or refresh
            setData(prev => prev.map(i => i.id_impresora === item.id_impresora ? updatedItem : i));
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Error al actualizar estado");
        }
    };

    const handleDelete = (item, e) => {
        e.stopPropagation();
        setItemToDelete(item);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;

        try {
            await api.delete(`/impresoras/${itemToDelete.id_impresora}`);
            setData(prev => prev.filter(i => i.id_impresora !== itemToDelete.id_impresora));
            toast.success("Impresora eliminada correctamente");
        } catch (error) {
            console.error("Error deleting item:", error);
            toast.error("Error al eliminar el equipo");
        } finally {
            setIsDeleteModalOpen(false);
            setItemToDelete(null);
        }
    };

    const handleView = (item) => {
        setViewItem(item);
        setIsDetailsModalOpen(true);
    };

    const handleSave = async (formData) => {
        try {
            if (selectedItem) {
                // Update existing
                await api.put(`/impresoras/${selectedItem.id_impresora}`, formData);
                toast.success("Impresora actualizada correctamente");
            } else {
                // Create new
                await api.post("/impresoras", formData);
                toast.success("Impresora creada correctamente");
            }
            setIsModalOpen(false);
            setSelectedItem(null);
            fetchData(); // Reload data
        } catch (error) {
            console.error("Error saving data:", error);
            toast.error("Error al guardar los cambios");
        }
    };

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const getStatusColor = (status) => {
        if (!status) return "bg-gray-100 text-gray-800";
        const lower = status.toLowerCase();
        if (lower.includes("licenciado")) return "bg-green-100 text-green-800";
        if (lower.includes("baja")) return "bg-red-100 text-red-800";
        return "bg-blue-100 text-blue-800";
    };

    const formatResponsible = (text) => {
        if (!text) return "-";
        const separators = [" -> ", " - ", " / ", ", "];
        for (const sep of separators) {
            if (text.includes(sep)) {
                const parts = text.split(sep);
                return "... " + parts[parts.length - 1];
            }
        }
        if (text.length > 25) {
            return "..." + text.slice(-20);
        }
        return text;
    };

    if (loading) return <div className="text-center p-10">Cargando impresoras y escáneres...</div>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
            <div className="flex flex-col md:flex-row items-center mb-6 gap-4">
                <div className="flex flex-col md:flex-row gap-2 items-center flex-wrap">
                    {/* Status Filters */}
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        {['ALL', 'SI', 'NO', 'ROBADO'].filter(status => {
                            if (status === 'ALL') return true;
                            if (status === 'SI') return hasActivos;
                            if (status === 'NO') return hasInactivos;
                            if (status === 'ROBADO') return hasRobados;
                            return true;
                        }).map((status) => (
                            <button
                                key={status}
                                onClick={() => { setOperativoFilter(status); setCurrentPage(1); }}
                                className={`px-4 py-1 rounded-md text-sm font-medium transition-all ${operativoFilter === status
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {status === 'ALL' ? 'Todos' : status === 'SI' ? 'Activos' : status === 'NO' ? 'Inactivos' : 'Robados'}
                            </button>
                        ))}
                    </div>

                    {/* Tipo Filter */}
                    <select
                        value={tipoFilter}
                        onChange={(e) => { setTipoFilter(e.target.value); setCurrentPage(1); }}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
                    >
                        <option value="ALL">Todos los Tipos</option>
                        <option value="Impresora">Impresoras</option>
                        <option value="Escáner">Escáneres</option>
                    </select>

                    {/* Sede Filter */}
                    <select
                        value={sedeFilter}
                        onChange={(e) => { setSedeFilter(e.target.value); setCurrentPage(1); }}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
                    >
                        <option value="ALL">Todas las sedes</option>
                        {uniqueSedes.map((sede) => (
                            <option key={sede} value={sede}>{sede}</option>
                        ))}
                    </select>

                    {/* Seccion Filter */}
                    <select
                        value={seccionFilter}
                        onChange={(e) => { setSeccionFilter(e.target.value); setCurrentPage(1); }}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
                    >
                        <option value="ALL">Todas las secciones</option>
                        {uniqueSecciones.map((seccion) => (
                            <option key={seccion} value={seccion}>{seccion}</option>
                        ))}
                    </select>

                    {/* SO Filter REMOVED for Printers */}

                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Buscar..."
                                value={searchTerm}
                                onChange={handleSearch}
                                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 transition-all"
                            />
                            <FaSearch className="absolute left-3 top-3 text-gray-400" />
                        </div>

                        {(user?.seccion === 'INF' || user?.seccion === 'GER') && (
                            <button
                                onClick={() => { setSelectedItem(null); setIsModalOpen(true); }}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap"
                            >
                                <FaPlus /> Nuevo
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {/* Define columns explicitly for better control or map keys for dynamic */}
                            {['Revisado', 'Sede', 'Operativo', 'Nombre', 'Marca', 'Ubicacion', 'Usuario', 'IP', 'Acciones'].map((header, idx) => {
                                const keyMap = { 'Sede': 'sede', 'Operativo': 'operativo', 'Revisado': 'revisado', 'Nombre': 'nombre_impresora', 'Marca': 'marca', 'Ubicacion': 'ubicacion', 'Usuario': 'nombre_usuario', 'IP': 'ip' };
                                const key = keyMap[header];
                                return (
                                    <th
                                        key={idx}
                                        onClick={() => key && handleSort(key)}
                                        className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors ${!key ? 'cursor-default' : ''}`}
                                    >
                                        <div className="flex items-center gap-2">
                                            {header}
                                            {sortConfig.key === key && (
                                                sortConfig.direction === "asc" ? <FaArrowUp /> : <FaArrowDown />
                                            )}
                                        </div>
                                    </th>
                                )
                            })}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentItems.map((item) => (
                            <tr
                                key={item.id_impresora}
                                onClick={() => handleView(item)}
                                className="hover:bg-purple-50 transition-colors cursor-pointer"
                            >
                                {/* ID Column removed */}
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <button
                                        onClick={(e) => handleToggleRevisado(item, e)}
                                        className={`p-1.5 rounded-full transition-all ${item.revisado
                                            ? 'bg-green-100 text-green-600 hover:bg-green-200'
                                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600'
                                            }`}
                                        title={item.revisado ? "Marcado como revisado" : "Pendiente de revisión"}
                                    >
                                        <FaCheckCircle size={18} />
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">{item.sede?.toUpperCase()}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${String(item.operativo).toUpperCase() === 'SI'
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : String(item.operativo).toUpperCase() === 'ROBADO' ? 'bg-orange-100 text-orange-800' : 'bg-rose-100 text-rose-800'
                                        }`}>
                                        {String(item.operativo).toUpperCase() === 'SI' ? 'Activo' : String(item.operativo).toUpperCase() === 'ROBADO' ? 'Robado' : 'Inactivo'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">{item.nombre_impresora}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">{item.marca}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.ubicacion}</td>
                                <td
                                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                    title={item.nombre_usuario}
                                >
                                    {formatResponsible(item.nombre_usuario)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{item.ip}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                                    {(user?.seccion === 'INF' || user?.seccion === 'GER') && (
                                        <>
                                            <button
                                                onClick={(e) => handleEdit(item, e)}
                                                className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 p-2 rounded-md transition-colors hover:bg-white z-10"
                                                title="Editar"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={(e) => handleDelete(item, e)}
                                                className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-md transition-colors hover:bg-white z-10"
                                                title="Eliminar"
                                            >
                                                <FaTrash />
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
                <div>
                    Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, filteredData.length)} de {filteredData.length} resultados
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
                    >
                        Anterior
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum = currentPage;
                        if (totalPages > 5) {
                            if (currentPage <= 3) pageNum = i + 1;
                            else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                            else pageNum = currentPage - 2 + i;
                        } else {
                            pageNum = i + 1;
                        }

                        return (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`px-3 py-1 border rounded ${currentPage === pageNum ? 'bg-blue-600 text-white' : 'hover:bg-gray-50'}`}
                            >
                                {pageNum}
                            </button>
                        )
                    })}
                    <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
                    >
                        Siguiente
                    </button>
                </div>
            </div>

            <ImpresoraModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSave}
                initialData={selectedItem}
            />

            <ImpresoraDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                data={viewItem}
            />

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md m-auto animate-fadeIn overflow-hidden border border-gray-100">
                        <div className="p-6">
                            <div className="flex justify-center mb-4">
                                <div className="bg-red-100 p-3 rounded-full text-red-600">
                                    <FaTrash size={24} />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                                Eliminar Impresora / Escáner
                            </h3>
                            <p className="text-gray-500 text-center text-sm md:text-base mb-6">
                                ¿Estás seguro que deseas eliminar el equipo <strong>{itemToDelete?.nombre_impresora}</strong>? Esta acción no se puede deshacer.
                            </p>
                            <div className="flex flex-col-reverse sm:flex-row gap-3 justify-center">
                                <button
                                    onClick={() => {
                                        setIsDeleteModalOpen(false);
                                        setItemToDelete(null);
                                    }}
                                    className="px-5 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm sm:w-auto w-full"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-5 py-2.5 text-white bg-red-600 rounded-lg hover:bg-red-700 hover:shadow-lg transition-all font-medium text-sm sm:w-auto w-full"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImpresorasTable;
