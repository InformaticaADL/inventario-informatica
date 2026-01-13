import React, { useState, useEffect } from 'react';
import api from "@/api/apiConfig";
import IncubadoraChart from "./IncubadoraChart";


const IncubadoraHistorial = () => {
    const [incubadoras, setIncubadoras] = useState([]);
    const [selectedIncubadora, setSelectedIncubadora] = useState("");
    const [selectedYear, setSelectedYear] = useState("");
    const [availableYears, setAvailableYears] = useState([]);
    const [history, setHistory] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [globalRange, setGlobalRange] = useState({ min: null, max: null }); // Rango absoluto de datos
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleYearChange = (year) => {
        setSelectedYear(year);
        if (year) {
            let start = `${year}-01-01`;
            let end = `${year}-12-31`;

            console.log("DEBUG Year Change:", { year, start, end, globalRange });

            // CLAMP: Ajustar al rango real de datos si existe
            if (globalRange.min && start < globalRange.min) {
                console.log(`Clamping Start: ${start} -> ${globalRange.min}`);
                start = globalRange.min;
            }
            if (globalRange.max && end > globalRange.max) {
                console.log(`Clamping End: ${end} -> ${globalRange.max}`);
                // Si el año seleccionado es el mismo que el año del ultimo dato, cortamos.
                // O simplemente: tomar el menor entre (fin de año) y (ultimo dato)
                if (end > globalRange.max) {
                    end = globalRange.max;
                }
            }

            // Caso borde: Si por alguna razón el año seleccionado está fuera del rango global (aunque el filtro availableYears lo previene),
            // asegurar que start <= end
            setStartDate(start);
            setEndDate(end);
        } else {
            setStartDate("");
            setEndDate("");
        }
    };

    // Cargar lista de incubadoras al montar
    useEffect(() => {
        const fetchIncubadoras = async () => {
            try {
                const res = await api.get('/incubadora/list');
                setIncubadoras(res.data);
                if (res.data.length > 0) {
                    setSelectedIncubadora(res.data[0]);
                }
            } catch (err) {
                console.error("Error cargando incubadoras", err);
                setError("Error al cargar la lista de incubadoras.");
            }
        };
        fetchIncubadoras();
    }, []);

    // Cargar AÑOS disponibles y RANGO DE FECHAS cuando cambia la incubadora
    useEffect(() => {
        const fetchMetadata = async () => {
            if (!selectedIncubadora) return;
            try {
                const encodedId = encodeURIComponent(selectedIncubadora);

                // 1. Cargar Años Disponibles
                const resYears = await api.get(`/incubadora/years/${encodedId}`);
                setAvailableYears(resYears.data);

                // 2. Cargar Rango de Fechas (Min/Max)
                const resRange = await api.get(`/incubadora/range/${encodedId}`);
                console.log("DEBUG Metadata Range:", resRange.data);
                if (resRange.data && resRange.data.minDate && resRange.data.maxDate) {
                    // Asegurar formato YYYY-MM-DD (primeros 10 chars)
                    const minStr = String(resRange.data.minDate).substring(0, 10);
                    const maxStr = String(resRange.data.maxDate).substring(0, 10);

                    // Guardamos el rango global para usarlo en el filtro
                    setGlobalRange({ min: minStr, max: maxStr });

                    // Opcional: Si queremos setear el rango inicial COMPLETO al cargar:
                    // setStartDate(minStr);
                    // setEndDate(maxStr);
                    // setSelectedYear(""); 

                    // NOTA: El usuario pidió que al cargar se seteen las fechas,
                    // pero si luego elije año, se usa handleYearChange.
                    // Mantengamos el comportamiento de setear fecha inicial.

                    // Solo si no hay fechas ya seleccionadas (o si queremos forzar reset al cambiar incubadora)
                    setStartDate(minStr);
                    setEndDate(maxStr);
                    setSelectedYear("");

                } else {
                    setGlobalRange({ min: null, max: null });
                    setStartDate("");
                    setEndDate("");
                }

            } catch (err) {
                console.error("Error cargando metadatos (años/rango)", err);
            }
        };
        fetchMetadata();
    }, [selectedIncubadora]);

    // Format helpers...
    const formatTime = (timeStr) => {
        if (!timeStr) return "-";
        if (timeStr.includes("T")) {
            return timeStr.split("T")[1].substring(0, 5);
        }
        if (timeStr.length >= 5) {
            return timeStr.substring(0, 5);
        }
        return timeStr;
    };

    // Cargar historial
    const fetchHistory = async () => {
        if (!selectedIncubadora) return;

        setLoading(true);
        setError(null);
        try {
            const encodedId = encodeURIComponent(selectedIncubadora);
            let url = `/incubadora/history/${encodedId}`;

            const params = [];
            if (startDate) params.push(`startDate=${startDate}`);
            if (endDate) params.push(`endDate=${endDate}`);

            if (params.length > 0) {
                url += `?${params.join('&')}`;
            }

            const res = await api.get(url);
            setHistory(res.data);
        } catch (err) {
            console.error("Error cargando historial", err);
            setError("Error al cargar el historial.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [selectedIncubadora]);

    const handleSearch = () => {
        fetchHistory();
    };


    return (
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md w-full">
            <h3 className="text-lg font-bold mb-4 text-sky-900 border-b pb-2">
                Historial de Temperaturas
            </h3>

            {/* Filtros */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Incubadora
                    </label>
                    <select
                        value={selectedIncubadora}
                        onChange={(e) => setSelectedIncubadora(e.target.value)}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2 border bg-gray-50"
                    >
                        {incubadoras.map((inc) => (
                            <option key={inc} value={inc}>
                                {inc}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Filtro por Año */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Año
                    </label>
                    <select
                        value={selectedYear}
                        onChange={(e) => handleYearChange(e.target.value)}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2 border bg-gray-50"
                    >
                        <option value="">Personalizado</option>
                        {availableYears.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha Inicio
                    </label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => {
                            setStartDate(e.target.value);
                            setSelectedYear(""); // Si cambia manual, limpiar año
                        }}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2 border bg-gray-50"
                    />
                </div>

                <div className="flex gap-2">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Fecha Fin
                        </label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => {
                                setEndDate(e.target.value);
                                setSelectedYear(""); // Si cambia manual, limpiar año
                            }}
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2 border bg-gray-50"
                        />
                    </div>
                    <button
                        onClick={handleSearch}
                        className="h-[38px] mt-auto px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition"
                    >
                        Filtrar
                    </button>
                    {(startDate || endDate) && (
                        <button
                            onClick={() => {
                                setStartDate("");
                                setEndDate("");
                                setSelectedYear("");
                                setTimeout(fetchHistory, 0);
                            }}
                            className="h-[38px] mt-auto px-3 py-2 bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300 transition"
                        >
                            Limpiar
                        </button>
                    )}
                </div>
            </div>

            {/* Mensajes de Estado */}
            {loading && <p className="text-blue-500 text-sm">Cargando datos...</p>}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Tabla y Gráfico */}
            {!loading && history.length === 0 && (
                <p className="text-gray-500 text-sm">No hay datos para mostrar.</p>
            )}

            {!loading && history.length > 0 && (
                <>
                    <IncubadoraChart data={history} />

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-sm text-left text-gray-500">
                            <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
                                <tr>
                                    <th scope="col" className="px-4 py-3">Fecha</th>
                                    <th scope="col" className="px-4 py-3">Hora</th>
                                    <th scope="col" className="px-4 py-3 text-right">T. Min</th>
                                    <th scope="col" className="px-4 py-3 text-right">T. Max</th>
                                    <th scope="col" className="px-4 py-3 text-right">T. Min 2</th>
                                    <th scope="col" className="px-4 py-3 text-right">T. Max 2</th>
                                    <th scope="col" className="px-4 py-3 text-right">Puerta (s)</th>
                                    <th scope="col" className="px-4 py-3 text-right">Motor</th>
                                    <th scope="col" className="px-4 py-3 text-right">Red (s)</th>
                                    <th scope="col" className="px-4 py-3 text-right">Alarma (s)</th>

                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {history.map((row) => (
                                    <tr key={row.id_registro || `${row.fecha}-${row.hora_intervalo}`} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                                            {row.fecha}
                                        </td>
                                        <td className="px-4 py-3">{formatTime(row.hora_intervalo)}</td>
                                        <td className="px-4 py-3 text-right font-medium text-blue-600">{row.temp_minima}</td>
                                        <td className="px-4 py-3 text-right font-medium text-red-600">{row.temp_maxima}</td>
                                        <td className="px-4 py-3 text-right text-blue-800">{row.temp_minima_2}</td>
                                        <td className="px-4 py-3 text-right text-red-800">{row.temp_maxima_2}</td>
                                        <td className="px-4 py-3 text-right">{row.tiempo_puerta}</td>
                                        <td className="px-4 py-3 text-right">{row.tiempo_motor}</td>
                                        <td className="px-4 py-3 text-right">{row.tiempo_red}</td>
                                        <td className="px-4 py-3 text-right">{row.tiempo_alarma}</td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

export default IncubadoraHistorial;
