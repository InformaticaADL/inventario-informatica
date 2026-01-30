"use client";
import { useState, useEffect } from "react";
import { FaEdit, FaSearch, FaArrowUp, FaArrowDown, FaPlus, FaCheckCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import api from "@/api/apiConfig";

import InventarioModal from "./InventarioModal";
import InventarioDetailsModal from "./InventarioDetailsModal";

const InventarioTable = () => {
    const { user } = useAuth();
    const router = useRouter();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [operativoFilter, setOperativoFilter] = useState("ALL"); // ALL, SI, NO
    const [sedeFilter, setSedeFilter] = useState("ALL");
    const [seccionFilter, setSeccionFilter] = useState("ALL");
    const [soFilter, setSoFilter] = useState("ALL");
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
    const [currentPage, setCurrentPage] = useState(1);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    // Details Modal State
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [viewItem, setViewItem] = useState(null);

    const itemsPerPage = 10;

    useEffect(() => {
        fetchData();
    }, []);



    const fetchData = async () => {
        try {
            const response = await api.get("/inventario");
            // Normalize 'Aysén' to 'Aysen'
            const normalizedData = response.data.map(item => ({
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

        // Sede Filter
        if (sedeFilter !== "ALL" && excludeKey !== "sede") {
            filtered = filtered.filter((item) => item.sede && item.sede.toUpperCase() === sedeFilter);
        }

        // Seccion Filter
        if (seccionFilter !== "ALL" && excludeKey !== "seccion") {
            filtered = filtered.filter((item) => item.unidad === seccionFilter);
        }

        // SO Filter
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
    const uniqueSecciones = [...new Set(availableSeccionesData.map(item => item.unidad).filter(Boolean))].sort();

    // 3. Available SOs: Filtered by Everything EXCEPT SO
    const availableSosData = applyFilters("so");
    const uniqueSos = [...new Set(availableSosData.map(item => item.sistema_operativo ? item.sistema_operativo.toUpperCase() : "").filter(Boolean))].sort();

    // 4. Available Statuses: Filtered by Everything EXCEPT Status
    const availableStatusData = applyFilters("operativo");
    const hasActivos = availableStatusData.some(i => i.operativo && String(i.operativo).toUpperCase().trim() === 'SI');
    const hasInactivos = availableStatusData.some(i => i.operativo && String(i.operativo).toUpperCase().trim() === 'NO');

    // Final filtered data for the table (Apply ALL filters & Sorting)
    const baseFilteredData = applyFilters();
    const filteredData = [...baseFilteredData].sort((a, b) => {
        if (!sortConfig.key) return 0;
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
            await api.put(`/inventario/${item.id_inventario}`, updatedItem);
            // Optimistic update or refresh
            setData(prev => prev.map(i => i.id_inventario === item.id_inventario ? updatedItem : i));
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Error al actualizar estado");
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
                await api.put(`/inventario/${selectedItem.id_inventario}`, formData);
            } else {
                // Create new (Not implemented trigger yet, but ready logic)
                await api.post("/inventario", formData);
            }
            setIsModalOpen(false);
            setSelectedItem(null);
            fetchData(); // Reload data
        } catch (error) {
            console.error("Error saving data:", error);
            alert("Error al guardar los cambios");
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

    if (loading) return <div className="text-center p-10">Cargando inventario...</div>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
            <div className="flex flex-col md:flex-row items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-800 mr-auto md:mr-4">Inventario</h2>

                <div className="flex flex-col md:flex-row gap-2 items-center flex-wrap">
                    {/* Status Filters */}
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        {['ALL', 'SI', 'NO'].filter(status => {
                            if (status === 'ALL') return true;
                            if (status === 'SI') return hasActivos;
                            if (status === 'NO') return hasInactivos;
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
                                {status === 'ALL' ? 'Todos' : status === 'SI' ? 'Activos' : 'Inactivos'}
                            </button>
                        ))}
                    </div>

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

                    {/* SO Filter */}
                    <select
                        value={soFilter}
                        onChange={(e) => { setSoFilter(e.target.value); setCurrentPage(1); }}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
                    >
                        <option value="ALL">Todo S.O.</option>
                        {uniqueSos.map((so) => (
                            <option key={so} value={so}>{so}</option>
                        ))}
                    </select>

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

                        {user?.seccion === 'INF' && (
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
                            {['Revisado', 'Sede', 'Operativo', 'Estado', 'Responsable', 'Usuario', 'Ubicacion', 'Modelo', 'IP', 'Acciones'].map((header, idx) => {
                                const keyMap = { 'Sede': 'sede', 'Operativo': 'operativo', 'Revisado': 'revisado', 'Estado': 'estado', 'Responsable': 'nombre_responsable', 'Usuario': 'nombre_usuario', 'Ubicacion': 'ubicacion', 'Modelo': 'modelo', 'IP': 'ip' };
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
                                key={item.id_inventario}
                                onClick={() => handleView(item)}
                                className="hover:bg-blue-50 transition-colors cursor-pointer"
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
                                        : 'bg-rose-100 text-rose-800'
                                        }`}>
                                        {String(item.operativo).toUpperCase() === 'SI' ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(item.estado)}`}>
                                        {item.estado || 'N/A'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.nombre_responsable}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.nombre_usuario}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.ubicacion}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.modelo}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{item.ip}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                                    {user?.seccion === 'INF' && (
                                        <button
                                            onClick={(e) => handleEdit(item, e)}
                                            className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 p-2 rounded-md transition-colors hover:bg-white z-10"
                                        >
                                            <FaEdit />
                                        </button>
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

            <InventarioModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSave}
                initialData={selectedItem}
            />

            <InventarioDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                data={viewItem}
            />
        </div>
    );
};

export default InventarioTable;
