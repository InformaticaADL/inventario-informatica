import React, { useMemo } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const IncubadoraChart = ({ data }) => {
    // Pre-procesar datos para el gráfico
    const chartData = useMemo(() => {
        // Clona y revierte para que el gráfico vaya de izquierda (antiguo) a derecha (nuevo)
        // Asumiendo que 'data' viene ordenado DESC por fecha/hora
        const reversed = [...data].reverse();

        return reversed.map(item => {
            // Formatear fecha/hora corta para el eje X
            // item.fecha: YYYY-MM-DD
            // item.hora_intervalo: HH:mm:ss OR 1970-01-01THH:mm:ss.000Z

            const datePart = item.fecha && item.fecha.length >= 5
                ? item.fecha.substring(5)
                : item.fecha; // 2023-12-05 -> 12-05

            let timePart = item.hora_intervalo || "";
            if (timePart.includes("T")) {
                timePart = timePart.split("T")[1].substring(0, 5); // 1970-01-01T14:00:00 -> 14:00
            } else if (timePart.length >= 5) {
                timePart = timePart.substring(0, 5);
            }

            const label = `${datePart} ${timePart}`;

            return {
                ...item,
                label,
                // Asegurarse de que sean números
                temp_minima: parseFloat(item.temp_minima),
                temp_maxima: parseFloat(item.temp_maxima),
                temp_minima_2: parseFloat(item.temp_minima_2),
                temp_maxima_2: parseFloat(item.temp_maxima_2),
            };
        });
    }, [data]);

    if (!data || data.length === 0) {
        return <div className="text-center text-gray-500 py-10">No hay datos para graficar.</div>;
    }

    return (
        <div className="w-full h-96 bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-10">
            <h4 className="text-md font-semibold text-gray-700 mb-4">Tendencia de Temperaturas</h4>

            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={chartData}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 0,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                        dataKey="label"
                        tick={{ fontSize: 10, fill: '#6b7280' }}
                        interval="preserveStartEnd"
                    />
                    <YAxis
                        tick={{ fontSize: 10, fill: '#6b7280' }}
                        domain={['auto', 'auto']}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        labelStyle={{ fontWeight: 'bold', color: '#374151' }}
                        itemStyle={{ fontSize: '12px' }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />

                    {/* Sensor 1 */}
                    <Line
                        type="monotone"
                        dataKey="temp_minima"
                        name="T. Min (S1)"
                        stroke="#3b82f6" // blue-500
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="temp_maxima"
                        name="T. Max (S1)"
                        stroke="#ef4444" // red-500
                        strokeWidth={2}
                        dot={false}
                    />

                    {/* Sensor 2 (Opcional: Si quieres mostrarlos. A veces ensucian mucho, los pondré punteados o colores distintos) */}
                    <Line
                        type="monotone"
                        dataKey="temp_minima_2"
                        name="T. Min (S2)"
                        stroke="#60a5fa" // blue-400
                        strokeDasharray="5 5"
                        strokeWidth={1}
                        dot={false}
                    />
                    <Line
                        type="monotone"
                        dataKey="temp_maxima_2"
                        name="T. Max (S2)"
                        stroke="#f87171" // red-400
                        strokeDasharray="5 5"
                        strokeWidth={1}
                        dot={false}
                    />

                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default IncubadoraChart;
