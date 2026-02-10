"use client";

import {
    FaTimes,
    FaEnvelope,
    FaUser,
    FaBuilding,
    FaMapMarkerAlt,
    FaInfoCircle,
    FaCommentAlt,
    FaKey,
    FaCalendarAlt
} from "react-icons/fa";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

const CorreosADLDetailsModal = ({ isOpen, onClose, data }) => {
    if (!isOpen || !data) return null;

    const DetailItem = ({ label, value, isCode, isStatus, colSpan = 1 }) => (
        <div className={`flex flex-col ${colSpan > 1 ? `col-span-${colSpan}` : ''}`}>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{label}</span>
            <div className={`text-gray-800 text-sm ${isCode ? 'font-mono bg-gray-50 px-2 py-1 rounded border border-gray-200 inline-block w-fit' : 'font-medium'} ${isStatus}`}>
                {value || <span className="text-gray-400 italic font-normal">No registrado</span>}
            </div>
        </div>
    );

    const parseDate = (dateVal) => {
        if (!dateVal) return null;
        return dayjs(dateVal).format("DD/MM/YYYY HH:mm");
    };

    const SectionHeader = ({ title, icon: Icon }) => (
        <div className="flex items-center gap-2 pb-2 mb-4 border-b border-gray-100 mt-6 first:mt-0">
            {Icon && <Icon className="text-blue-600" size={16} />}
            <h4 className="text-base font-bold text-gray-800">{title}</h4>
        </div>
    );

    const getStatusStyle = (status) => {
        if (!status) return "bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs border border-gray-200";
        const val = String(status).toUpperCase();
        if (val === "S") return "bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs border border-emerald-200";
        if (val === "N") return "bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full text-xs border border-rose-200";
        return "bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs border border-gray-200";
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm overflow-y-auto p-4 md:p-8">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl m-auto animate-fadeIn flex flex-col max-h-[90vh] overflow-hidden border border-gray-100">
                {/* Header */}
                <div className="flex justify-between items-start p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-100 rounded-lg text-blue-600 shadow-sm">
                            <FaEnvelope size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 leading-tight">
                                {data.nombre || "Detalles del Correo"}
                            </h3>
                            <div className="flex items-center gap-3 mt-2">
                                <span className={getStatusStyle(data.habilitado)}>
                                    {String(data.habilitado).toUpperCase() === 'S' ? 'Activo' : 'Inactivo'}
                                </span>
                                <span className="text-xs text-gray-500 font-mono">
                                    {data.email}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-all"
                        aria-label="Cerrar modal"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-white scrollbar-thin scrollbar-thumb-gray-200">
                    <div className="space-y-8">

                        {/* Información General */}
                        <div>
                            <SectionHeader title="Información General" icon={FaUser} />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 p-5 rounded-xl border border-gray-100">
                                <DetailItem label="Nombre" value={data.nombre} />
                                <DetailItem label="Correo Electrónico" value={data.email} />
                                <DetailItem label="Correo Electrónico" value={data.email} />
                                <DetailItem label="Contraseña" value={data.password} isCode />
                                <DetailItem label="Fecha de Creación" value={parseDate(data.createdAt)} icon={FaCalendarAlt} />
                            </div>
                        </div>

                        {/* Organización */}
                        <div>
                            <SectionHeader title="Organización" icon={FaBuilding} />
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <DetailItem label="Empresa" value={data.empresa} />
                                <DetailItem label="Sede" value={data.sede} />
                                <DetailItem label="Área" value={data.area} />
                                <DetailItem label="Unidad" value={data.unidad} />
                            </div>
                        </div>

                        {/* Observaciones */}
                        <div>
                            <SectionHeader title="Observaciones" icon={FaCommentAlt} />
                            <div className="bg-yellow-50/50 p-4 rounded-xl text-gray-700 text-sm leading-relaxed border border-yellow-100 min-h-[80px] shadow-sm">
                                {data.observaciones || <span className="text-gray-400 italic">Sin observaciones registradas.</span>}
                            </div>
                        </div>

                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-all font-medium shadow-sm hover:shadow"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CorreosADLDetailsModal;
