"use client";

import {
    FaTimes,
    FaDesktop,
    FaUser,
    FaMapMarkerAlt,
    FaNetworkWired,
    FaMicrochip,
    FaInfoCircle,
    FaCalendarAlt,
    FaFileInvoice,
    FaCommentAlt
} from "react-icons/fa";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

const InventarioDetailsModal = ({ isOpen, onClose, data }) => {
    const parseDate = (dateVal) => {
        if (!dateVal) return null;
        if (!isNaN(dateVal) && !isNaN(parseFloat(dateVal))) {
            const serial = parseFloat(dateVal);
            const unixTimestamp = (serial - 25569) * 86400 * 1000;
            return dayjs(unixTimestamp).utc();
        }
        return dayjs.utc(dateVal);
    };

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
            {Icon && <Icon className="text-blue-600" size={16} />}
            <h4 className="text-base font-bold text-gray-800">{title}</h4>
        </div>
    );

    const getStatusStyle = (status) => {
        if (!status) return "";
        const lower = status.toLowerCase();
        if (lower.includes("licenciado")) return "bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs border border-green-200";
        if (lower.includes("baja")) return "bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs border border-red-200";
        if (lower.includes("bueno")) return "bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs border border-blue-200";
        if (lower.includes("regular")) return "bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs border border-yellow-200";
        return "bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs border border-gray-200";
    };

    // Helper to format currency or simple numbers if needed, mostly for future proofing
    const formatValue = (val) => val;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm overflow-y-auto p-4 md:p-8">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl m-auto animate-fadeIn flex flex-col max-h-[90vh] overflow-hidden border border-gray-100">
                {/* Header */}
                <div className="flex justify-between items-start p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-100 rounded-lg text-blue-600 shadow-sm">
                            <FaDesktop size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 leading-tight">
                                {data.nombre_equipo || "Detalles del Equipo"}
                            </h3>
                            <div className="flex items-center gap-3 mt-2">
                                <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded font-mono border border-gray-300">
                                    ID: {data.id_inventario}
                                </span>
                                <span className={getStatusStyle(data.estado)}>
                                    {data.estado || "Estado desconocido"}
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
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                        {/* Left Column: Core Info */}
                        <div className="col-span-1 lg:col-span-8 space-y-2">

                            {/* General & Location */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
                                <div className="space-y-6">
                                    <SectionHeader title="Información de Usuario" icon={FaUser} />
                                    <div className="grid grid-cols-1 gap-4">
                                        <DetailItem label="Usuario Asignado" value={data.nombre_usuario} />
                                        <DetailItem label="Responsable" value={data.nombre_responsable} />
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <SectionHeader title="Ubicación" icon={FaMapMarkerAlt} />
                                    <div className="grid grid-cols-1 gap-4">
                                        <DetailItem label="Sede" value={data.sede} />
                                        <DetailItem label="Unidad / Sección" value={data.unidad} />
                                    </div>
                                </div>
                            </div>

                            {/* Technical Specs */}
                            <SectionHeader title="Hardware y Especificaciones" icon={FaMicrochip} />
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8 p-5 bg-gray-50 rounded-xl border border-gray-100">
                                <DetailItem label="Tipo de Equipo" value={data.tipo_equipo} />
                                <DetailItem label="Marca" value={data.marca} />
                                <DetailItem label="Modelo" value={data.modelo} />
                                <DetailItem label="Procesador" value={data.procesador} />
                                <DetailItem label="Memoria RAM" value={data.ram} />
                                <DetailItem label="Disco Duro" value={data.disco_duro} />
                                <DetailItem label="Sistema Operativo" value={data.sistema_operativo} colSpan={3} />
                            </div>

                            {/* Network Info */}
                            <SectionHeader title="Red y Conectividad" icon={FaNetworkWired} />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <DetailItem label="Dirección IP" value={data.ip} isCode />
                                <DetailItem label="AnyDesk ID" value={data.anydesk} isCode />
                                <DetailItem label="Número de Serie" value={data.serie} isCode />
                            </div>
                        </div>

                        {/* Right Column: Administrative & Notes */}
                        <div className="col-span-1 lg:col-span-4 space-y-8 pl-0 lg:pl-8 lg:border-l border-gray-100">

                            <div>
                                <SectionHeader title="Datos Administrativos" icon={FaFileInvoice} />
                                <div className="space-y-5">
                                    <DetailItem
                                        label="Fecha de Adquisición"
                                        value={data.fecha_adquisicion ? parseDate(data.fecha_adquisicion).format("DD/MM/YYYY") : null}
                                        icon={FaCalendarAlt}
                                    />
                                    <DetailItem
                                        label="Fecha de Recepción"
                                        value={data.fecha_recepcion ? parseDate(data.fecha_recepcion).format("DD/MM/YYYY") : null}
                                    />
                                    <DetailItem label="Número de Factura" value={data.n_factura} />
                                    <DetailItem label="Proveedor" value={data.proveedor} />
                                    <DetailItem
                                        label="Estado Operativo"
                                        value={data.operativo === "SI" ? "Operativo" : "Inoperativo"}
                                        isStatus={data.operativo === "SI" ? "text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 text-xs uppercase font-bold" : "text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-100 text-xs uppercase font-bold"}
                                    />
                                </div>
                            </div>

                            <div>
                                <SectionHeader title="Observaciones" icon={FaCommentAlt} />
                                <div className="bg-yellow-50/50 p-4 rounded-xl text-gray-700 text-sm leading-relaxed border border-yellow-100 min-h-[120px] shadow-sm">
                                    {data.observaciones || <span className="text-gray-400 italic">Sin observaciones registradas.</span>}
                                </div>
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

export default InventarioDetailsModal;
