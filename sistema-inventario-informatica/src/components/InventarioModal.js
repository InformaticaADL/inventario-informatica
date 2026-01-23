"use client";
import { useState, useEffect } from "react";
import { FaTimes, FaSave } from "react-icons/fa";
import api from "@/api/apiConfig"; // Import api
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

const InventarioModal = ({ isOpen, onClose, onSubmit, initialData }) => {
    const parseDate = (dateVal) => {
        if (!dateVal) return "";
        // Check for Excel serial number
        if (!isNaN(dateVal) && !isNaN(parseFloat(dateVal))) {
            const serial = parseFloat(dateVal);
            const unixTimestamp = (serial - 25569) * 86400 * 1000;
            return dayjs(unixTimestamp).utc();
        }
        return dayjs.utc(dateVal);
    };

    const [secciones, setSecciones] = useState([]); // State for sections
    const [sedes, setSedes] = useState([]); // State for sedes
    const [tiposEquipo, setTiposEquipo] = useState([]); // State for tiposEquipo
    const [marcas, setMarcas] = useState([]); // State for marcas
    const [ubicaciones, setUbicaciones] = useState([]); // State for ubicaciones
    const [rams, setRams] = useState([]); // State for rams
    const [almacenamientos, setAlmacenamientos] = useState([]); // State for almacenamientos
    const [sos, setSos] = useState([]); // State for sos
    const [offices, setOffices] = useState([]); // State for offices

    const [formData, setFormData] = useState({
        nombre_equipo: "",
        nombre_usuario: "",
        nombre_responsable: "",
        ubicacion: "",
        modelo: "",
        ip: "",
        estado: "",
        operativo: "",
        sede: "",
        unidad: "",
        tipo_equipo: "",
        marca: "",
        serie: "",
        codigo_adl: "",
        anydesk: "",
        id_teamviewer: "",
        sistema_operativo: "",
        office: "",
        ram: "",
        procesador: "",
        disco_duro: "",
        correo: "",
        password: "",
        proveedor: "",
        n_factura: "",
        fecha_factura: "",
        valor_neto: "",
        frecuencia_mantencion: "",
        fecha_adquisicion: "",
        fecha_recepcion: "",
        observaciones: ""
    });

    useEffect(() => {
        // Fetch secciones
        const fetchSecciones = async () => {
            try {
                const response = await api.get("/seccion");
                setSecciones(response.data);
            } catch (error) {
                console.error("Error al cargar secciones:", error);
            }
        };
        fetchSecciones();

        // Fetch sedes
        const fetchSedes = async () => {
            try {
                const response = await api.get("/sede");
                setSedes(response.data);
            } catch (error) {
                console.error("Error al cargar sedes:", error);
            }
        };
        fetchSedes();

        // Fetch tiposEquipo
        const fetchTiposEquipo = async () => {
            try {
                const response = await api.get("/tipo-equipo");
                setTiposEquipo(response.data);
            } catch (error) {
                console.error("Error al cargar tipos de equipo:", error);
            }
        };
        fetchTiposEquipo();

        // Fetch marcas
        const fetchMarcas = async () => {
            try {
                const response = await api.get("/marca");
                setMarcas(response.data);
            } catch (error) {
                console.error("Error al cargar marcas:", error);
            }
        };
        fetchMarcas();

        // Fetch ubicaciones
        const fetchUbicaciones = async () => {
            try {
                const response = await api.get("/ubicacion");
                setUbicaciones(response.data);
            } catch (error) {
                console.error("Error al cargar ubicaciones:", error);
            }
        };
        fetchUbicaciones();

        // Fetch rams
        const fetchRams = async () => {
            try {
                const response = await api.get("/ram");
                setRams(response.data);
            } catch (error) {
                console.error("Error al cargar rams:", error);
            }
        };
        fetchRams();

        // Fetch almacenamientos
        const fetchAlmacenamientos = async () => {
            try {
                const response = await api.get("/almacenamiento");
                setAlmacenamientos(response.data);
            } catch (error) {
                console.error("Error al cargar almacenamientos:", error);
            }
        };
        fetchAlmacenamientos();

        // Fetch sos
        const fetchSos = async () => {
            try {
                const response = await api.get("/so");
                setSos(response.data);
            } catch (error) {
                console.error("Error al cargar sistemas operativos:", error);
            }
        };
        fetchSos();

        // Fetch offices
        const fetchOffices = async () => {
            try {
                const response = await api.get("/office");
                setOffices(response.data);
            } catch (error) {
                console.error("Error al cargar versiones de office:", error);
            }
        };
        fetchOffices();

        if (initialData) {
            setFormData({
                ...initialData,
                fecha_adquisicion: initialData.fecha_adquisicion ? parseDate(initialData.fecha_adquisicion).format("YYYY-MM-DD") : "",
                fecha_recepcion: initialData.fecha_recepcion ? parseDate(initialData.fecha_recepcion).format("YYYY-MM-DD") : "",
                fecha_factura: initialData.fecha_factura ? parseDate(initialData.fecha_factura).format("YYYY-MM-DD") : ""
            });
        } else {
            setFormData({
                nombre_equipo: "",
                nombre_usuario: "",
                nombre_responsable: "",
                ubicacion: "",
                modelo: "",
                ip: "",
                estado: "",
                operativo: "",
                sede: "",
                unidad: "",
                tipo_equipo: "",
                marca: "",
                serie: "",
                codigo_adl: "",
                anydesk: "",
                id_teamviewer: "",
                sistema_operativo: "",
                office: "",
                ram: "",
                procesador: "",
                disco_duro: "",
                correo: "",
                password: "",
                proveedor: "",
                n_factura: "",
                fecha_factura: "",
                valor_neto: "",
                frecuencia_mantencion: "",
                fecha_adquisicion: "",
                fecha_recepcion: "",
                observaciones: ""
            });
        }
    }, [initialData, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto pt-10 pb-10">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl m-4 animate-fadeIn flex flex-col max-h-full">
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-gray-800">
                        {initialData ? "Editar Equipo" : "Nuevo Equipo"}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <FaTimes size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
                    {/* SECCIÓN 1: DATOS GENERALES Y UBICACIÓN */}
                    <div className="mb-6">
                        <h4 className="text-md font-bold text-gray-700 mb-3 border-b pb-2">Datos Generales y Ubicación</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Equipo</label>
                                <input
                                    type="text"
                                    name="nombre_equipo"
                                    value={formData.nombre_equipo || ""}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 font-mono"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Código ADL</label>
                                <input
                                    type="text"
                                    name="codigo_adl"
                                    value={formData.codigo_adl || ""}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo Equipo</label>
                                <select
                                    name="tipo_equipo"
                                    value={formData.tipo_equipo || ""}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Seleccione...</option>
                                    {tiposEquipo.map((tipo) => (
                                        <option key={tipo.id_tipoequipo} value={tipo.nombre_tipoequipo}>
                                            {tipo.nombre_tipoequipo}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                                <select
                                    name="marca"
                                    value={formData.marca || ""}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Seleccione...</option>
                                    {marcas.map((marca) => (
                                        <option key={marca.id_marca} value={marca.nombre_marca}>
                                            {marca.nombre_marca}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
                                <input
                                    type="text"
                                    name="modelo"
                                    value={formData.modelo || ""}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Serie</label>
                                <input
                                    type="text"
                                    name="serie"
                                    value={formData.serie || ""}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 uppercase"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Sede</label>
                                <select
                                    name="sede"
                                    value={formData.sede || ""}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Seleccione...</option>
                                    {sedes.map((sede) => (
                                        <option key={sede.id_lugaranalisis} value={sede.nombre_lugaranalisis}>
                                            {sede.nombre_lugaranalisis}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Unidad / Sección</label>
                                <select
                                    name="unidad"
                                    value={formData.unidad || ""}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Seleccione...</option>
                                    {secciones.map((sec) => (
                                        <option key={sec.id_seccion} value={sec.nombre_seccion}>
                                            {sec.nombre_seccion}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
                                <select
                                    name="ubicacion"
                                    value={formData.ubicacion || ""}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Seleccione...</option>
                                    {ubicaciones.map((ubi) => (
                                        <option key={ubi.id_ubicacion} value={ubi.nombre_ubicacion}>
                                            {ubi.nombre_ubicacion}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Usuario ADL</label>
                                <input
                                    type="text"
                                    name="nombre_usuario"
                                    value={formData.nombre_usuario || ""}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Responsable</label>
                                <input
                                    type="text"
                                    name="nombre_responsable"
                                    value={formData.nombre_responsable || ""}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Estado Operativo</label>
                                <select
                                    name="operativo"
                                    value={formData.operativo || ""}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Seleccione...</option>
                                    <option value="SI">SI</option>
                                    <option value="NO">NO</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Licencia Windows</label>
                                <select
                                    name="licencia_windows"
                                    value={formData.licencia_windows || ""}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Seleccione...</option>
                                    <option value="SI">SI</option>
                                    <option value="NO">NO</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* SECCIÓN 2: HARDWARE Y SOFTWARE */}
                    <div className="mb-6">
                        <h4 className="text-md font-bold text-gray-700 mb-3 border-b pb-2">Hardware y Software</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Procesador</label>
                                <input
                                    type="text"
                                    name="procesador"
                                    value={formData.procesador || ""}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">RAM</label>
                                <select
                                    name="ram"
                                    value={formData.ram || ""}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Seleccione...</option>
                                    {rams.map((ram) => (
                                        <option key={ram.id_ram} value={ram.capacidad}>
                                            {ram.capacidad} GB
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Disco Duro</label>
                                <select
                                    name="disco_duro"
                                    value={formData.disco_duro || ""}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Seleccione...</option>
                                    {almacenamientos.map((almacenamiento) => (
                                        <option key={almacenamiento.id_almacenamiento} value={almacenamiento.almacenamiento}>
                                            {almacenamiento.almacenamiento}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Sistema Operativo</label>
                                <select
                                    name="sistema_operativo"
                                    value={formData.sistema_operativo || ""}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Seleccione...</option>
                                    {sos.map((so) => (
                                        <option key={so.id_so} value={so.so}>
                                            {so.so}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Office</label>
                                <select
                                    name="office"
                                    value={formData.office || ""}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Seleccione...</option>
                                    {offices.map((off) => (
                                        <option key={off.id_office} value={off.office}>
                                            {off.office}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* SECCIÓN 3: CONECTIVIDAD Y ACCESOS */}
                    <div className="mb-6">
                        <h4 className="text-md font-bold text-gray-700 mb-3 border-b pb-2">Conectividad y Accesos</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección IP</label>
                                <input
                                    type="text"
                                    name="ip"
                                    value={formData.ip || ""}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 font-mono"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Correo Asociado</label>
                                <input
                                    type="text"
                                    name="correo"
                                    value={formData.correo || ""}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password Equipo</label>
                                <input
                                    type="text"
                                    name="password"
                                    value={formData.password || ""}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 font-mono"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">AnyDesk ID</label>
                                <input
                                    type="text"
                                    name="anydesk"
                                    value={formData.anydesk || ""}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 font-mono"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">TeamViewer ID</label>
                                <input
                                    type="text"
                                    name="id_teamviewer"
                                    value={formData.id_teamviewer || ""}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 font-mono"
                                />
                            </div>
                        </div>
                    </div>

                    {/* SECCIÓN 4: ADMINISTRATIVO Y COMPRA */}
                    <div className="mb-6">
                        <h4 className="text-md font-bold text-gray-700 mb-3 border-b pb-2">Administrativo y Compra</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor</label>
                                <input
                                    type="text"
                                    name="proveedor"
                                    value={formData.proveedor || ""}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">N° Factura</label>
                                <input
                                    type="text"
                                    name="n_factura"
                                    value={formData.n_factura || ""}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Factura</label>
                                <input
                                    type="date"
                                    name="fecha_factura"
                                    value={formData.fecha_factura || ""}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Valor Neto</label>
                                <input
                                    type="text"
                                    name="valor_neto"
                                    value={formData.valor_neto || ""}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Adquisición</label>
                                <input
                                    type="date"
                                    name="fecha_adquisicion"
                                    value={formData.fecha_adquisicion || ""}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Recepción</label>
                                <input
                                    type="date"
                                    name="fecha_recepcion"
                                    value={formData.fecha_recepcion || ""}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Frec. Mantención</label>
                                <input
                                    type="text"
                                    name="frecuencia_mantencion"
                                    value={formData.frecuencia_mantencion || ""}
                                    onChange={handleChange}
                                    placeholder="Ej: Semestral"
                                    className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mb-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                        <textarea
                            name="observaciones"
                            value={formData.observaciones || ""}
                            onChange={handleChange}
                            rows="3"
                            className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                        ></textarea>
                    </div>
                </form>

                <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="flex items-center gap-2 px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        <FaSave /> Guardar Cambios
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InventarioModal;
