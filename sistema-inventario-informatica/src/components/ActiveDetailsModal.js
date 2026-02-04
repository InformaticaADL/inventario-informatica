"use client";

import { FaTimes, FaDesktop, FaCheckCircle } from "react-icons/fa";
import { formatCLP } from "@/utils/formatters";
import { parseCLP } from "@/utils/numberParsers";

const ActiveDetailsModal = ({ isOpen, onClose, data }) => {
    if (!isOpen || !data) return null;

    // Filter for active items (operativo === 'SI')
    const activeItems = data.filter(item => item.operativo && item.operativo.trim().toUpperCase() === 'SI');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl flex flex-col max-h-[90vh] animate-fadeIn">

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-white rounded-t-xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-100 rounded-lg text-emerald-600 shadow-sm">
                            <FaCheckCircle size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 leading-tight">
                                Detalle Equipos Activos
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                                {activeItems.length} equipos activos contabilizados
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
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Ubicación / Usuario</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 text-right">Valor Neto</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {activeItems.map((item, index) => (
                                <tr key={item.id_inventario} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                                        {item.id_inventario}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-8 w-8 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mr-3">
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
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium text-right">
                                        {item.valor_neto ? formatCLP(parseCLP(item.valor_neto)) : '-'}
                                    </td>
                                </tr>
                            ))}
                            {activeItems.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                        No se encontraron equipos activos.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-xl flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                        * Listado de equipos actualmente operativos.
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onClose}
                            className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-all"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActiveDetailsModal;
