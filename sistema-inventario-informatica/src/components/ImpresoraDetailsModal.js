"use client";

import {
    FaTimes,
    FaPrint,
    FaUser,
    FaMapMarkerAlt,
    FaNetworkWired,
    FaInfoCircle,
    FaCommentAlt,
    FaBarcode
} from "react-icons/fa";

const ImpresoraDetailsModal = ({ isOpen, onClose, data }) => {
    if (!isOpen || !data) return null;

    const DetailItem = ({ label, value, isCode, isStatus, colSpan = 1 }) => (
        <div className={`flex flex-col ${colSpan > 1 ? `col-span-${colSpan}` : ''}`}>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{label}</span>
            <div className={`text-gray-800 text-sm ${isCode ? 'font-mono bg-gray-50 px-2 py-1 rounded border border-gray-200 inline-block w-fit' : 'font-medium'} ${isStatus}`}>
                {value || <span className="text-gray-400 italic font-normal">No registrado</span>}
            </div>
        </div>
    );

    const SectionHeader = ({ title, icon: Icon }) => (
        <div className="flex items-center gap-2 pb-2 mb-4 border-b border-gray-100 mt-6 first:mt-0">
            {Icon && <Icon className="text-purple-600" size={16} />}
            <h4 className="text-base font-bold text-gray-800">{title}</h4>
        </div>
    );

    const getStatusStyle = (status) => {
        if (!status) return "";
        const lower = status.toUpperCase();
        if (lower === "SI") return "bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs border border-emerald-200 uppercase font-bold";
        if (lower === "ROBADO") return "bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs border border-orange-200 uppercase font-bold";
        return "bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full text-xs border border-rose-200 uppercase font-bold";
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm overflow-y-auto p-4 md:p-8">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl m-auto animate-fadeIn flex flex-col max-h-[90vh] overflow-hidden border border-gray-100">
                {/* Header */}
                <div className="flex justify-between items-start p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-white">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-purple-100 rounded-lg text-purple-600 shadow-sm">
                            <FaPrint size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 leading-tight">
                                {data.nombre_impresora || "Detalles del Equipo"}
                            </h3>
                            <div className="flex items-center gap-3 mt-2">
                                <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded font-mono border border-gray-300">
                                    ID: {data.id_impresora}
                                </span>
                                {data.codigo_adl && (
                                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-mono border border-purple-200">
                                        ADL: {data.codigo_adl}
                                    </span>
                                )}
                                <span className={getStatusStyle(data.operativo)}>
                                    {data.operativo === "SI" ? "Activo" : data.operativo === "ROBADO" ? "Robado" : "Inactivo"}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-all"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-white scrollbar-thin scrollbar-thumb-gray-200">
                    <div className="space-y-8">
                        {/* Technical Info */}
                        <div>
                            <SectionHeader title="Especificaciones Técnicas" icon={FaInfoCircle} />
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-5 bg-purple-50/20 rounded-xl border border-purple-100">
                                <DetailItem label="Tipo de Equipo" value={data.tipo || "Impresora"} />
                                <DetailItem label="Marca" value={data.marca} />
                                <DetailItem label="Modelo" value={data.modelo} />
                                <DetailItem label="N° Serie" value={data.serie} isCode />
                                <DetailItem label="Dirección IP" value={data.ip} isCode />
                            </div>
                        </div>

                        {/* Location & User */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <SectionHeader title="Ubicación" icon={FaMapMarkerAlt} />
                                <div className="grid grid-cols-1 gap-4">
                                    <DetailItem label="Sede" value={data.sede} />
                                    <DetailItem label="Unidad / Sección" value={data.unidad} />
                                    <DetailItem label="Ubicación Física" value={data.ubicacion} />
                                </div>
                            </div>
                            <div className="space-y-6">
                                <SectionHeader title="Responsable" icon={FaUser} />
                                <div className="grid grid-cols-1 gap-4">
                                    <DetailItem label="Usuario / Responsable" value={data.nombre_usuario} />
                                </div>
                            </div>
                        </div>

                        {/* Observations */}
                        <div>
                            <SectionHeader title="Observaciones" icon={FaCommentAlt} />
                            <div className="bg-gray-50 p-4 rounded-xl text-gray-700 text-sm leading-relaxed border border-gray-100 min-h-[100px]">
                                {data.observaciones || <span className="text-gray-400 italic">Sin observaciones registradas.</span>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-medium shadow-sm"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImpresoraDetailsModal;
