"use client";

import { FaTimes } from "react-icons/fa";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

const InventarioDetailsModal = ({ isOpen, onClose, data }) => {
    const parseDate = (dateVal) => {
        if (!dateVal) return null;
        // Check for Excel serial number (numeric string like "44715")
        if (!isNaN(dateVal) && !isNaN(parseFloat(dateVal))) {
            // Excel base date: Dec 30, 1899.
            // (dateVal - 25569) * 86400 * 1000 gives milliseconds since Unix epoch
            const serial = parseFloat(dateVal);
            const unixTimestamp = (serial - 25569) * 86400 * 1000;
            return dayjs(unixTimestamp).utc();
        }
        return dayjs.utc(dateVal);
    };

    if (!isOpen || !data) return null;

    const DetailItem = ({ label, value, isCode, isStatus }) => (
        <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-500 mb-1">{label}</h4>
            <p className={`text-gray-900 ${isCode ? 'font-mono bg-gray-50 p-1 rounded inline-block text-sm' : ''} ${isStatus}`}>
                {value || <span className="text-gray-400 italic">No registrado</span>}
            </p>
        </div>
    );

    const getStatusColorClass = (status) => {
        if (!status) return "";
        const lower = status.toLowerCase();
        if (lower.includes("licenciado")) return "text-green-600 font-semibold";
        if (lower.includes("baja")) return "text-red-600 font-semibold";
        if (lower.includes("bueno")) return "text-blue-600 font-semibold";
        return "";
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto pt-10 pb-10">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl m-4 animate-fadeIn flex flex-col max-h-full">
                <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800">{data.nombre_equipo || "Detalle del Equipo"}</h3>
                        <p className="text-sm text-gray-500 mt-1">ID: #{data.id_inventario}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-200 rounded-full">
                        <FaTimes size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                        {/* Section 1: General Info */}
                        <div className="col-span-1 md:col-span-2 lg:col-span-3 border-b pb-4 mb-2">
                            <h4 className="text-lg font-semibold text-blue-800 mb-4">Información General</h4>
                        </div>

                        <DetailItem label="Usuario" value={data.nombre_usuario} />
                        <DetailItem label="Responsable" value={data.nombre_responsable} />
                        <DetailItem label="Sede" value={data.sede} />
                        <DetailItem label="Unidad / Sección" value={data.unidad} />
                        <DetailItem
                            label="Estado Operativo"
                            value={data.operativo === "SI" ? "Activo" : "Inactivo"}
                            isStatus={data.operativo === "SI" ? "text-emerald-600 font-bold" : "text-rose-600 font-bold"}
                        />
                        <DetailItem
                            label="Estado"
                            value={data.estado}
                            isStatus={getStatusColorClass(data.estado)}
                        />


                        {/* Section 2: Technical Specs */}
                        <div className="col-span-1 md:col-span-2 lg:col-span-3 border-b pb-4 mb-2 mt-4">
                            <h4 className="text-lg font-semibold text-blue-800 mb-4">Especificaciones Técnicas</h4>
                        </div>

                        <DetailItem label="Tipo Equipo" value={data.tipo_equipo} />
                        <DetailItem label="Marca" value={data.marca} />
                        <DetailItem label="Modelo" value={data.modelo} />
                        <DetailItem label="Serie" value={data.serie} isCode />
                        <DetailItem label="Dirección IP" value={data.ip} isCode />
                        <DetailItem label="AnyDesk" value={data.anydesk} isCode />
                        <DetailItem label="Procesador" value={data.procesador} />
                        <DetailItem label="RAM" value={data.ram} />
                        <DetailItem label="Disco Duro" value={data.disco_duro} />
                        <DetailItem label="Sistema Operativo" value={data.sistema_operativo} />

                        {/* Section 3: Others */}
                        <div className="col-span-1 md:col-span-2 lg:col-span-3 border-b pb-4 mb-2 mt-4">
                            <h4 className="text-lg font-semibold text-blue-800 mb-4">Otros Datos</h4>
                        </div>
                        <DetailItem
                            label="Fecha Adquisición"
                            value={data.fecha_adquisicion ? parseDate(data.fecha_adquisicion).format("DD/MM/YYYY") : null}
                        />
                        <DetailItem
                            label="Fecha Recepción"
                            value={data.fecha_recepcion ? parseDate(data.fecha_recepcion).format("DD/MM/YYYY") : null}
                        />
                        <DetailItem label="N° Factura" value={data.n_factura} />
                        <DetailItem label="Proveedor" value={data.proveedor} />

                        {/* Observations */}
                        <div className="col-span-1 md:col-span-2 lg:col-span-3 mt-4">
                            <h4 className="text-sm font-medium text-gray-500 mb-2">Observaciones</h4>
                            <div className="bg-gray-50 p-4 rounded-lg text-gray-700 min-h-[80px] text-sm leading-relaxed border border-gray-100">
                                {data.observaciones || "Sin observaciones registradas."}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InventarioDetailsModal;
