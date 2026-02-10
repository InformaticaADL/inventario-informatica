"use client";

import { FaTimes, FaDesktop, FaCheckCircle } from "react-icons/fa";

const OfficeDetailsModal = ({ isOpen, onClose, data, filterVersion }) => {
    if (!isOpen || !data || !filterVersion) return null;

    // Filter items based on the selected office version
    const filteredItems = data.filter(item => {
        const itemOffice = item.office ? item.office.toLowerCase() : 'sin info';
        const targetVersion = filterVersion.toLowerCase();

        if (targetVersion === 'libreoffice') return itemOffice.includes('libre');
        if (targetVersion === 'office 365') return itemOffice.includes('365');
        if (targetVersion === 'office 2019') return itemOffice.includes('2019');
        if (targetVersion === 'office 2016') return itemOffice.includes('2016');
        if (targetVersion === 'office 2013') return itemOffice.includes('2013');
        if (targetVersion === 'sin office') {
            if (!itemOffice || itemOffice === 'sin info') return true;

            return !itemOffice.includes('libre') &&
                !itemOffice.includes('365') &&
                !itemOffice.includes('2019') &&
                !itemOffice.includes('2016') &&
                !itemOffice.includes('2013');
        }
        if (targetVersion === 'sin info') return !item.office;

        return itemOffice.includes(targetVersion);
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl flex flex-col max-h-[90vh] animate-fadeIn">

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white rounded-t-xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 rounded-lg text-blue-600 shadow-sm">
                            <FaDesktop size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 leading-tight">
                                Detalle Versión: {filterVersion}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                                {filteredItems.length} equipos encontrados
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-all"
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
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Sistema Operativo</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Versión Office</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Ubicación / Usuario</th>
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
                                            <div className="flex-shrink-0 h-8 w-8 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mr-3">
                                                <FaDesktop size={14} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{item.nombre_equipo}</div>
                                                <div className="text-xs text-gray-500">{item.marca} {item.modelo}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${(item.sistema_operativo || '').toLowerCase().includes("windows") ? "bg-blue-100 text-blue-800" :
                                            (item.sistema_operativo || '').toLowerCase().includes("linux") ? "bg-orange-100 text-orange-800" :
                                                "bg-gray-100 text-gray-800"
                                            }`}>
                                            {item.sistema_operativo || "Sin OS"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${(item.office || '').toLowerCase().includes("libre") ? "bg-green-100 text-green-800" :
                                            (item.office || '').toLowerCase().includes("365") ? "bg-purple-100 text-purple-800" :
                                                (item.office || '').toLowerCase().includes("office") ? "bg-blue-100 text-blue-800" :
                                                    "bg-gray-100 text-gray-800"
                                            }`}>
                                            {item.office || "Sin Office"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{item.nombre_usuario || "Sin usuario"}</div>
                                        <div className="text-xs text-gray-500">{item.ubicacion || "Sin ubicación"}</div>
                                    </td>
                                </tr>
                            ))}
                            {filteredItems.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                        No se encontraron equipos para esta versión.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-xl flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                        * Listado filtrado por versión de Office seleccionada.
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

export default OfficeDetailsModal;
