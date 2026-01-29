"use client";
import React, { useState, useEffect } from 'react';
import {
    PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import api from '../api/apiConfig';
import { useRouter } from 'next/navigation';
import {
    FaArrowLeft,
    FaDesktop,
    FaCheckCircle,
    FaTimesCircle,
    FaDollarSign,
    Faserver,
    FaChartPie
} from 'react-icons/fa';

// Modern Color Palette
const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

// Custom Tooltip Component for Charts
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-lg">
                <p className="text-sm font-bold text-gray-800 mb-1">{label}</p>
                <p className="text-sm text-blue-600 font-medium">
                    {`${payload[0].name}: ${payload[0].value}`}
                </p>
            </div>
        );
    }
    return null;
};

// KPI Card Component
const KPICard = ({ title, value, icon: Icon, colorClass, bgClass }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-2">{value}</h3>
            </div>
            <div className={`p-3 rounded-lg ${bgClass}`}>
                <Icon className={colorClass} size={24} />
            </div>
        </div>
    </div>
);

const MetricsDashboard = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [brandFilter, setBrandFilter] = useState("ACTIVOS"); // ACTIVOS, INACTIVOS, TODOS
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get("/inventario");
                setData(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    // --- Data Processing ---

    // 1. KPI Calculations
    const totalEquipos = data.length;

    // Normalize and count
    const activos = data.filter(i => i.operativo && i.operativo.trim().toUpperCase() === 'SI').length;
    const inactivos = data.filter(i => i.operativo && i.operativo.trim().toUpperCase() === 'NO').length;
    const otros = totalEquipos - (activos + inactivos);

    // Calculate approximate value if 'valor_neto' exists and is numeric-ish
    const totalValor = data.reduce((acc, item) => {
        const val = parseFloat(item.valor_neto) || 0;
        return acc + val;
    }, 0);

    const formattedValor = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(totalValor);

    // 2. Activos vs Inactivos (Chart Data)
    const operativoData = [
        { name: 'Activos', value: activos },
        { name: 'Inactivos', value: inactivos },
    ];

    if (otros > 0) {
        operativoData.push({ name: 'Sin Info / Otros', value: otros });
    }

    // 3. Office Versions
    const officeCount = data.reduce((acc, item) => {
        let version = 'Sin Info';
        if (item.office) {
            const lower = item.office.toLowerCase();
            if (lower.includes('libre')) version = 'LibreOffice';
            else if (lower.includes('365')) version = 'Office 365';
            else if (lower.includes('2019')) version = 'Office 2019';
            else if (lower.includes('2016')) version = 'Office 2016';
            else if (lower.includes('2013')) version = 'Office 2013';
            else version = 'Otro Office';
        }
        acc[version] = (acc[version] || 0) + 1;
        return acc;
    }, {});

    const officeData = Object.keys(officeCount).map(key => ({
        name: key,
        value: officeCount[key]
    })).sort((a, b) => b.value - a.value);

    // 4. Top Models (Top 10)
    const modelCount = data.reduce((acc, item) => {
        const model = item.modelo || 'Sin Modelo';
        acc[model] = (acc[model] || 0) + 1;
        return acc;
    }, {});

    const modelData = Object.keys(modelCount)
        .map(key => ({ name: key, value: modelCount[key] }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10);

    // 5. Brands Logic with Filter

    const getFilteredBrandData = () => {
        let filtered = data;
        if (brandFilter === 'ACTIVOS') {
            filtered = data.filter(i => i.operativo === 'SI');
        } else if (brandFilter === 'INACTIVOS') {
            filtered = data.filter(i => i.operativo === 'NO');
        }
        return filtered;
    };

    const brandCount = getFilteredBrandData().reduce((acc, item) => {
        const brand = item.marca || 'Sin Marca';
        acc[brand] = (acc[brand] || 0) + 1;
        return acc;
    }, {});

    const brandData = Object.keys(brandCount)
        .map(key => ({ name: key, value: brandCount[key] }))
        .sort((a, b) => b.value - a.value);


    return (
        <div className="p-8 bg-gray-50 min-h-screen font-sans">
            <div className="max-w-7xl mx-auto">
                <button
                    onClick={() => router.back()}
                    className="mb-8 flex items-center gap-2 text-gray-500 hover:text-blue-600 font-medium transition-colors bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 hover:border-blue-200"
                >
                    <FaArrowLeft size={14} /> Volver al Inventario
                </button>

                <div className="mb-10">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Panel de Métricas</h1>
                    <p className="text-gray-500 mt-2">Visión general del estado del inventario y distribución de recursos.</p>
                </div>

                {/* KPI Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <KPICard
                        title="Total Equipos"
                        value={totalEquipos}
                        icon={FaDesktop}
                        bgClass="bg-blue-50"
                        colorClass="text-blue-600"
                    />
                    <KPICard
                        title="Equipos Activos"
                        value={activos}
                        icon={FaCheckCircle}
                        bgClass="bg-emerald-50"
                        colorClass="text-emerald-600"
                    />
                    <KPICard
                        title="Equipos Inactivos"
                        value={inactivos}
                        icon={FaTimesCircle}
                        bgClass="bg-red-50"
                        colorClass="text-red-600"
                    />
                    <KPICard
                        title="Valor Estimado"
                        value={totalValor > 0 ? formattedValor : "N/A"}
                        icon={FaDollarSign}
                        bgClass="bg-amber-50"
                        colorClass="text-amber-600"
                    />
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">

                    {/* Operatividad (Donut Chart) */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-2 mb-6">
                            <FaChartPie className="text-purple-500" />
                            <h3 className="text-lg font-bold text-gray-800">Estado Operativo</h3>
                        </div>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={operativoData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        <Cell fill="#10b981" /> {/* Activos */}
                                        <Cell fill="#ef4444" /> {/* Inactivos */}
                                        {otros > 0 && <Cell fill="#9ca3af" />} {/* Otros - Gray */}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Brands (Pie Chart) */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                            <div className="flex items-center gap-2">
                                <FaChartPie className="text-indigo-500" />
                                <h3 className="text-lg font-bold text-gray-800">Distribución por Marca</h3>
                            </div>
                            <div className="flex bg-gray-100 p-1 rounded-lg text-xs font-medium">
                                <div className="flex bg-gray-100 p-1 rounded-lg text-xs font-medium">
                                    {['ACTIVOS', 'INACTIVOS', 'TODOS'].filter(f => {
                                        if (f === 'TODOS') return true;
                                        if (f === 'ACTIVOS') return activos > 0;
                                        if (f === 'INACTIVOS') return inactivos > 0;
                                        return true;
                                    }).map((filter) => (
                                        <button
                                            key={filter}
                                            onClick={() => setBrandFilter(filter)}
                                            className={`px-3 py-1 rounded-md transition-all ${brandFilter === filter
                                                ? 'bg-white text-indigo-600 shadow-sm'
                                                : 'text-gray-500 hover:text-gray-700'
                                                }`}
                                        >
                                            {filter.charAt(0) + filter.slice(1).toLowerCase()}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={brandData}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={90}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {brandData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Office Distribution (Vertical Bar) */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-2 mb-6">
                            <FaDesktop className="text-sky-500" />
                            <h3 className="text-lg font-bold text-gray-800">Versiones de Office</h3>
                        </div>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={officeData} layout="vertical" margin={{ left: 20, right: 20, top: 10, bottom: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 13, fill: '#4b5563' }} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="value" fill="#0ea5e9" radius={[0, 4, 4, 0]} name="Cantidad">
                                        {officeData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Top Models (Bar Chart) */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-2 mb-6">
                            <FaDesktop className="text-orange-500" />
                            <h3 className="text-lg font-bold text-gray-800">Top 10 Modelos de Equipos</h3>
                        </div>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={modelData} margin={{ bottom: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis
                                        dataKey="name"
                                        angle={-45}
                                        textAnchor="end"
                                        interval={0}
                                        height={80}
                                        tick={{ fontSize: 11, fill: '#6b7280' }}
                                    />
                                    <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} allowDecimals={false} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Cantidad" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default MetricsDashboard;
