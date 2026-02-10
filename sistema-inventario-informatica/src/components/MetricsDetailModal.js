"use client";

import { FaTimes, FaList, FaCheckCircle, FaMapMarkerAlt, FaDesktop } from "react-icons/fa";

const MetricsDetailModal = ({ isOpen, onClose, title, data, filterType, filterValue }) => {
    if (!isOpen || !data) return null;

    // Filter Logic
    const filteredItems = data.filter(item => {
        if (!filterType || !filterValue) return false;

        if (filterType === 'STATUS') {
            const op = item.operativo ? item.operativo.trim().toUpperCase() : 'NO';
            if (filterValue === 'Activos') return op === 'SI';
            if (filterValue === 'Inactivos') return op === 'NO';
            // For 'Otros' or similar, we might need adjustments, but based on current dashboard logic:
            if (filterValue === 'Sin Info / Otros') return op !== 'SI' && op !== 'NO';
            return false;
        }

        if (filterType === 'LOCATION') {
            const loc = item.ubicacion ? item.ubicacion.toLowerCase() : '';
            if (filterValue === 'Oficina') return loc.includes('oficina');
            if (filterValue === 'Terreno') return loc.includes('terreno');
            if (filterValue === 'Otro/Sin Info') return !loc.includes('oficina') && !loc.includes('terreno');
            return false;
        }

        if (filterType === 'MODEL') {
            // Exact match for model name (or 'Sin Modelo')
            const model = item.modelo || 'Sin Modelo';
            return model === filterValue;
        }

        if (filterType === 'BRAND') {
            let brand = item.marca ? item.marca.trim() : 'Sin Marca';
            // Normalize for comparison
            if (brand.toUpperCase() === 'DELL') brand = 'Dell';
            if (brand.toUpperCase() === 'HP') brand = 'HP';
            if (brand.toUpperCase() === 'LENOVO') brand = 'Lenovo';

            return brand === filterValue;
        }

        return false;
    });

    // Helper to pick an icon based on filter type
    const renderIcon = () => {
        if (filterType === 'STATUS') return <FaCheckCircle size={24} />;
        if (filterType === 'LOCATION') return <FaMapMarkerAlt size={24} />;
        if (filterType === 'MODEL') return <FaDesktop size={24} />;
        if (filterType === 'BRAND') return <FaDesktop size={24} />; // Reuse desktop or find brand icon
        return <FaList size={24} />;
    };

    // Helper for chip color in modal header
    const getHeaderColor = () => {
        if (filterType === 'STATUS') return "bg-emerald-100 text-emerald-600 from-emerald-50";
        if (filterType === 'LOCATION') return "bg-teal-100 text-teal-600 from-teal-50";
        if (filterType === 'MODEL') return "bg-orange-100 text-orange-600 from-orange-50";
        if (filterType === 'BRAND') return "bg-indigo-100 text-indigo-600 from-indigo-50";
        return "bg-blue-100 text-blue-600 from-blue-50";
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl flex flex-col max-h-[90vh] animate-fadeIn">

                {/* Header */}
                <div className={`flex justify-between items-center p-6 border-b border-gray-100 bg-gradient-to-r rounded-t-xl ${getHeaderColor()}`}>
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg shadow-sm bg-white/50`}>
                            {renderIcon()}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 leading-tight">
                                {title}: {filterValue}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                                {filteredItems.length} equipos encontrados
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 hover:bg-black/5 p-2 rounded-lg transition-all"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Table Body */}
                <div className="flex-1 overflow-y-auto p-0">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">ID</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Equipo</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Ubicación / Usuario</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredItems.map((item) => (
                                <tr key={item.id_inventario} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                                        {item.id_inventario}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 mr-3">
                                                <FaDesktop size={14} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{item.nombre_equipo}</div>
                                                <div className="text-xs text-gray-500">{item.marca} {item.modelo}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{item.nombre_usuario || "Sin usuario"}</div>
                                        <div className="text-xs text-gray-500">{item.ubicacion || "Sin ubicación"}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${(item.operativo === 'SI') ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                                            }`}>
                                            {(item.operativo === 'SI') ? "Activo" : "Inactivo"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {filteredItems.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                        No se encontraron equipos para esta selección.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-xl flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                        * Listado filtrado por selección en gráfico.
                    </div>
                    <button
                        onClick={onClose}
                        className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-all"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MetricsDetailModal;
