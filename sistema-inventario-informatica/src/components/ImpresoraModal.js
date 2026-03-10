"use client";
import { useState, useEffect } from "react";
import {
    FaTimes,
    FaSave,
    FaPrint,
    FaPlus,
    FaUser,
    FaMapMarkerAlt,
    FaNetworkWired,
    FaFileInvoice,
    FaCommentAlt,
    FaBarcode
} from "react-icons/fa";
import api from "@/api/apiConfig";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { toast } from 'react-hot-toast';
dayjs.extend(utc);

const ImpresoraModal = ({ isOpen, onClose, onSubmit, initialData }) => {
    const parseDate = (dateVal) => {
        if (!dateVal) return "";
        if (!isNaN(dateVal) && !isNaN(parseFloat(dateVal))) {
            const serial = parseFloat(dateVal);
            const unixTimestamp = (serial - 25569) * 86400 * 1000;
            return dayjs(unixTimestamp).utc();
        }
        return dayjs.utc(dateVal);
    };

    // State for selects
    const [secciones, setSecciones] = useState([]);
    const [sedes, setSedes] = useState([]);
    const [tiposEquipo, setTiposEquipo] = useState([]);
    const [marcas, setMarcas] = useState([]);
    const [ubicaciones, setUbicaciones] = useState([]);
    const [rams, setRams] = useState([]);
    const [almacenamientos, setAlmacenamientos] = useState([]);
    const [sos, setSos] = useState([]);
    const [offices, setOffices] = useState([]);

    const [formData, setFormData] = useState({
        nombre_impresora: "",
        nombre_usuario: "",
        ubicacion: "",
        modelo: "",
        ip: "",
        operativo: "SI",
        sede: "",
        unidad: "",
        marca: "",
        serie: "",
        codigo_adl: "",
        observaciones: ""
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    seccionesRes, sedesRes, tiposRes, marcasRes,
                    ubiRes, ramsRes, almRes, sosRes, officesRes
                ] = await Promise.all([
                    api.get("/seccion"),
                    api.get("/sede"),
                    api.get("/tipo-equipo"),
                    api.get("/marca-impresora"),
                    api.get("/ubicacion"),
                    api.get("/ram"),
                    api.get("/almacenamiento"),
                    api.get("/so"),
                    api.get("/office")
                ]);

                setSecciones(seccionesRes.data);
                setSedes(sedesRes.data);
                setTiposEquipo(tiposRes.data);
                setMarcas(marcasRes.data);
                setUbicaciones(ubiRes.data);
                setRams(ramsRes.data);
                setAlmacenamientos(almRes.data);
                setSos(sosRes.data);
                setOffices(officesRes.data);

            } catch (error) {
                console.error("Error al cargar datos auxiliares:", error);
            }
        };

        if (isOpen) {
            fetchData();
        }

        if (initialData) {
            setFormData({
                ...initialData
            });
        } else {
            setFormData({
                nombre_impresora: "", nombre_usuario: "", ubicacion: "", modelo: "",
                ip: "", operativo: "SI", sede: "", unidad: "", marca: "",
                serie: "", codigo_adl: "", observaciones: ""
            });
        }
    }, [initialData, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        // Required fields
        if (!formData.nombre_impresora?.trim()) {
            toast.error('El nombre de la impresora es obligatorio');
            return false;
        }
        if (!formData.marca) {
            toast.error('La marca es obligatoria');
            return false;
        }
        if (!formData.sede) {
            toast.error('La sede es obligatoria');
            return false;
        }
        if (!formData.unidad) {
            toast.error('La unidad/sección es obligatoria');
            return false;
        }
        if (!formData.ubicacion) {
            toast.error('La ubicación física es obligatoria');
            return false;
        }

        // Validate emails if any exist (check internal state of EmailTagsInput might be tricky, 
        // but we can check the string value against regex here too for safety)


        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm overflow-y-auto p-4 md:p-6">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl m-auto animate-fadeIn flex flex-col max-h-[95vh] overflow-hidden border border-gray-100">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg text-white shadow-sm ${initialData ? 'bg-purple-500' : 'bg-purple-600'}`}>
                            {initialData ? <FaPrint size={20} /> : <FaPlus size={20} />}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 leading-tight">
                                {initialData ? "Editar Impresora / Escáner" : "Nueva Impresora / Escáner"}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">
                                {initialData ? `ID: #${initialData.id_impresora} - ${initialData.nombre_impresora}` : "Complete el formulario para registrar un nuevo equipo"}
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

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 md:p-8 bg-white scrollbar-thin scrollbar-thumb-gray-200" noValidate>
                    {/* Full Width Column */}
                    <div className="col-span-1 lg:col-span-12 space-y-8">

                        {/* General Info */}
                        <div>
                            <SectionHeader title="Datos Técnicos y Ubicación" icon={FaMapMarkerAlt} />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <InputGroup label="Nombre Impresora / Escáner" name="nombre_impresora" value={formData.nombre_impresora} onChange={handleChange} />
                                <SelectGroup label="Marca" name="marca" value={formData.marca} onChange={handleChange} options={marcas} valueKey="nombre_marca" labelKey="nombre_marca" />
                                <InputGroup label="Modelo" name="modelo" value={formData.modelo} onChange={handleChange} />

                                <InputGroup label="Dirección IP" name="ip" value={formData.ip} onChange={handleChange} className="font-mono" />
                                <InputGroup label="N° Serie" name="serie" value={formData.serie} onChange={handleChange} className="uppercase font-mono" />
                                <InputGroup label="Código ADL" name="codigo_adl" value={formData.codigo_adl} onChange={handleChange} />

                                <SelectGroup label="Sede" name="sede" value={formData.sede} onChange={handleChange} options={sedes} valueKey="nombre_lugaranalisis" labelKey="nombre_lugaranalisis" />
                                <SelectGroup label="Unidad / Sección" name="unidad" value={formData.unidad} onChange={handleChange} options={secciones} valueKey="nombre_seccion" labelKey="nombre_seccion" />
                                <SelectGroup label="Ubicación Física" name="ubicacion" value={formData.ubicacion} onChange={handleChange} options={ubicaciones} valueKey="nombre_ubicacion" labelKey="nombre_ubicacion" />

                                <InputGroup label="Usuario / Responsable" name="nombre_usuario" value={formData.nombre_usuario} onChange={handleChange} />
                                <SelectGroup label="Estado Operativo" name="operativo" value={formData.operativo} onChange={handleChange} options={[{ id: 'SI', label: 'SI' }, { id: 'NO', label: 'NO' }, { id: 'ROBADO', label: 'ROBADO' }]} valueKey="id" labelKey="label" />
                            </div>
                        </div>

                        {/* Observations */}
                        <div>
                            <SectionHeader title="Observaciones" icon={FaCommentAlt} />
                            <textarea
                                name="observaciones"
                                value={formData.observaciones || ""}
                                onChange={handleChange}
                                rows="4"
                                className="w-full px-4 py-3 bg-purple-50/30 border border-purple-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-400/20 focus:border-purple-400 transition-all outline-none text-sm text-gray-700 leading-relaxed placeholder-gray-400 resize-none"
                                placeholder="Ingrese observaciones o detalles adicionales sobre el equipo..."
                            ></textarea>
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50 flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-all font-medium shadow-sm"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="flex items-center gap-2 px-6 py-2.5 text-white bg-purple-600 rounded-lg hover:bg-purple-700 hover:shadow-lg hover:-translate-y-0.5 transition-all font-medium shadow-md"
                    >
                        <FaSave /> {initialData ? "Guardar Cambios" : "Registrar Equipo"}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Helper components moved outside
const SectionHeader = ({ title, icon: Icon }) => (
    <div className="flex items-center gap-2 pb-2 mb-6 border-b border-gray-100 mt-2">
        {Icon && <Icon className="text-purple-600" size={16} />}
        <h4 className="text-base font-bold text-gray-800">{title}</h4>
    </div>
);

const InputGroup = ({ label, name, type = "text", value, onChange, placeholder, className = "", ...props }) => (
    <div className={className}>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">{label}</label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm text-gray-700 font-medium placeholder-gray-400 ${props.readOnly ? 'opacity-70 cursor-not-allowed bg-gray-100' : ''}`}
            {...props}
        />
    </div>
);

const SelectGroup = ({ label, name, value, onChange, options, valueKey, labelKey, className = "" }) => (
    <div className={className}>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">{label}</label>
        <div className="relative">
            <select
                name={name}
                value={value}
                onChange={onChange}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm text-gray-700 font-medium appearance-none cursor-pointer"
            >
                <option value="">Seleccionar...</option>
                {options.map((opt, idx) => (
                    <option key={idx} value={opt[valueKey] || opt}>
                        {opt[labelKey] || opt}
                    </option>
                ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-400">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
            </div>
        </div>
    </div>
);

const EmailTagsInput = ({ label, value, onChange, className = "" }) => {
    const [inputValue, setInputValue] = useState("");

    // Initial emails from value string (split by / or ,)
    const emails = value ? value.split(/[\/,]+/).map(e => e.trim()).filter(Boolean) : [];

    const handleKeyDown = (e) => {
        if (['Enter', 'Tab', ','].includes(e.key)) {
            e.preventDefault();
            addEmail();
        }
    };

    const addEmail = () => {
        const email = inputValue.trim();
        if (!email) return;

        // Simple email regex validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            toast.error("Correo inválido");
            return;
        }

        if (emails.includes(email)) {
            setInputValue("");
            return;
        }

        const newEmails = [...emails, email];
        onChange({ target: { name: 'correo', value: newEmails.join(' / ') } });
        setInputValue("");
    };

    const removeEmail = (emailToRemove) => {
        const newEmails = emails.filter(email => email !== emailToRemove);
        onChange({ target: { name: 'correo', value: newEmails.join(' / ') } });
    };

    return (
        <div className={className}>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">{label}</label>
            <div className="w-full bg-gray-50 border border-gray-200 rounded-lg focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all p-2 min-h-[42px]">
                <div className="flex flex-wrap gap-2">
                    {emails.map((email, idx) => (
                        <div key={idx} className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium border border-blue-200">
                            <span className="break-all">{email}</span>
                            <button
                                type="button"
                                onClick={() => removeEmail(email)}
                                className="text-blue-400 hover:text-blue-900 focus:outline-none"
                            >
                                <FaTimes size={10} />
                            </button>
                        </div>
                    ))}
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => { setInputValue(e.target.value); }}
                        onKeyDown={handleKeyDown}
                        onBlur={addEmail}
                        placeholder={emails.length === 0 ? "ingrese.correo@ejemplo.com" : ""}
                        className="flex-1 bg-transparent outline-none text-sm text-gray-700 min-w-[150px]"
                    />
                </div>
            </div>
        </div>
    );
};


export default ImpresoraModal;
