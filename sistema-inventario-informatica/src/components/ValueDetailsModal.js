"use client";

import { FaTimes, FaDesktop, FaUser, FaDollarSign, FaPrint } from "react-icons/fa";
import { formatCLP, getLastResponsable } from "@/utils/formatters";
import { parseCLP } from "@/utils/numberParsers";
import { calculateDepreciatedValue } from "@/utils/depreciation";

const ValueDetailsModal = ({ isOpen, onClose, data, impresorasData }) => {
    if (!isOpen || (!data && !impresorasData)) return null;

    // Normalize Inventory and Printer data into a single array
    const inventarioItems = (data || []).map(item => ({
        id: item.id_inventario,
        isPrinter: false,
        name: item.nombre_equipo,
        desc: `${item.marca || ''} ${item.modelo || ''}`.trim(),
        user: item.nombre_usuario || "Sin Asignar",
        location: item.unidad || item.ubicacion || "Sin ubicación",
        responsable: getLastResponsable(item.nombre_responsable) || "Sin responsable",
        // Inventory uses depreciated value
        value: calculateDepreciatedValue(item.valor_neto, item.fecha_adquisicion) || 0
    }));

    const printerItems = (impresorasData || []).map(item => ({
        id: `IMP-${item.id_impresora}`,
        isPrinter: true,
        name: item.tipo || "Impresora",
        desc: `${item.marca || ''} ${item.modelo || ''}`.trim(),
        user: "Sin Asignar", // Printers don't have nombre_usuario usually
        location: item.unidad || item.sede || "Sin ubicación",
        responsable: "Sin responsable", // Might not be tracked in impresoras
        // Printers use raw net value
        value: item.valor_neto ? parseCLP(item.valor_neto) : 0
    }));

    const allItems = [...inventarioItems, ...printerItems];

    const totalValue = allItems.reduce((acc, item) => acc + item.value, 0);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-[90vw] flex flex-col max-h-[90vh] animate-fadeIn">

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-white rounded-t-xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-100 rounded-lg text-amber-600 shadow-sm">
                            <FaDollarSign size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 leading-tight">
                                Detalle Valor Estimado
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                                {allItems.length} equipos contabilizados
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
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Usuario / Ubicación</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Responsable</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 text-right">Valor Actual</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {allItems.map((item, index) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                                        {item.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-8 w-8 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mr-3">
                                                {item.isPrinter ? <FaPrint size={14} /> : <FaDesktop size={14} />}
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                                <div className="text-xs text-gray-500">{item.desc}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{item.user}</div>
                                        <div className="text-xs text-gray-500">{item.location}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {item.responsable}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium text-right">
                                        {formatCLP(item.value)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer / Total */}
                <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-xl flex justify-between items-center">
                    <div className="text-sm text-gray-500 font-medium">
                        * La suma incluye equipos activos e inactivos de inventario e impresoras.
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-600 uppercase text-xs font-bold tracking-wider">Total Estimado:</span>
                        <span className="text-2xl font-bold text-amber-600 bg-white px-4 py-1 rounded-lg border border-gray-200 shadow-sm">
                            {formatCLP(totalValue)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ValueDetailsModal;
