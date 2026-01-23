"use client";
import { useState, useEffect } from "react";
import { FaEdit, FaSearch, FaArrowUp, FaArrowDown, FaPlus } from "react-icons/fa";
import api from "@/api/apiConfig";

import InventarioModal from "./InventarioModal";
import InventarioDetailsModal from "./InventarioDetailsModal";

const InventarioTable = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [operativoFilter, setOperativoFilter] = useState("ALL"); // ALL, SI, NO
    const [sedeFilter, setSedeFilter] = useState("ALL");
    const [seccionFilter, setSeccionFilter] = useState("ALL");
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

    useEffect(() => {
        applyFilters();
    }, [searchTerm, operativoFilter, sedeFilter, seccionFilter, data]);

    const fetchData = async () => {
        try {
            const response = await api.get("/inventario");
            setData(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };

    // Derive unique sedes for the filter dropdown
    const uniqueSedes = [...new Set(data.map(item => item.sede).filter(Boolean))].sort();
    // Derive unique secciones for the filter dropdown
    const uniqueSecciones = [...new Set(data.map(item => item.unidad).filter(Boolean))].sort();

    const applyFilters = () => {
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
        if (operativoFilter !== "ALL") {
            filtered = filtered.filter((item) => {
                const op = item.operativo ? String(item.operativo).toUpperCase() : "NO";
                return op === operativoFilter;
            });
        }

        // Sede Filter
        if (sedeFilter !== "ALL") {
            filtered = filtered.filter((item) => item.sede === sedeFilter);
        }

        // Seccion Filter
        if (seccionFilter !== "ALL") {
            filtered = filtered.filter((item) => item.unidad === seccionFilter);
        }

        setFilteredData(filtered);
        setCurrentPage(1);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });

        const sorted = [...filteredData].sort((a, b) => {
            if (!a[key]) return 1;
            if (!b[key]) return -1;

            const valA = String(a[key]).toLowerCase();
            const valB = String(b[key]).toLowerCase();

            if (valA < valB) return direction === "asc" ? -1 : 1;
            if (valA > valB) return direction === "asc" ? 1 : -1;
            return 0;
        });
        setFilteredData(sorted);
    };

    const handleEdit = (item, e) => {
        e.stopPropagation(); // Avoid triggering row click
        setSelectedItem(item);
        setIsModalOpen(true);
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
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-800">Inventario</h2>

                <div className="flex flex-col md:flex-row gap-4 items-center">
                    {/* Status Filters */}
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        {['ALL', 'SI', 'NO'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setOperativoFilter(status)}
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
                        onChange={(e) => setSedeFilter(e.target.value)}
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
                        onChange={(e) => setSeccionFilter(e.target.value)}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
                    >
                        <option value="ALL">Todas las secciones</option>
                        {uniqueSecciones.map((seccion) => (
                            <option key={seccion} value={seccion}>{seccion}</option>
                        ))}
                    </select>

                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 transition-all"
                        />
                        <FaSearch className="absolute left-3 top-3 text-gray-400" />
                    </div>
                    <button
                        onClick={() => { setSelectedItem(null); setIsModalOpen(true); }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                        <FaPlus /> Nuevo
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {/* Define columns explicitly for better control or map keys for dynamic */}
                            {['Sede', 'Operativo', 'Estado', 'Equipo', 'Usuario', 'Ubicacion', 'Modelo', 'IP', 'Acciones'].map((header, idx) => {
                                const keyMap = { 'Sede': 'sede', 'Operativo': 'operativo', 'Estado': 'estado', 'Equipo': 'nombre_equipo', 'Usuario': 'nombre_usuario', 'Ubicacion': 'ubicacion', 'Modelo': 'modelo', 'IP': 'ip' };
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
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">{item.sede}</td>
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
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.nombre_equipo}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.nombre_usuario}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.ubicacion}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.modelo}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{item.ip}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                                    <button
                                        onClick={(e) => handleEdit(item, e)}
                                        className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 p-2 rounded-md transition-colors hover:bg-white z-10"
                                    >
                                        <FaEdit />
                                    </button>

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
                        // Logic to show generic page numbers window could be complex, keeping simple for now
                        let pageNum = currentPage;
                        if (totalPages > 5) {
                            // Simple shifting window
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
