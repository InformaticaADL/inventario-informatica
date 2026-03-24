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
    FaUserSecret,
    FaPrint,
    FaDollarSign,
    FaServer,
    FaChartPie,
    FaFileExcel,
    FaBuilding,
    FaWindows,
    FaCogs
} from 'react-icons/fa';
import * as XLSX from 'xlsx';
import ValueDetailsModal from './ValueDetailsModal';
import InactiveDetailsModal from './InactiveDetailsModal';
import ActiveDetailsModal from './ActiveDetailsModal';
import RobadoDetailsModal from './RobadoDetailsModal';
import PrinterDetailsModal from './PrinterDetailsModal';
import MetricsDetailModal from './MetricsDetailModal';
import ProgramListModal from './ProgramListModal';
import { useAuth } from '@/hooks/useAuth';
import { parseCLP } from '@/utils/numberParsers';
import { calculateDepreciatedValue } from '@/utils/depreciation';

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
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow h-full flex flex-col justify-center">
        <div className="flex items-start justify-between gap-4">
            <div>
                <p className="text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wide leading-tight">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-2">{value}</h3>
            </div>
            <div className={`p-3 rounded-lg ${bgClass} shrink-0`}>
                <Icon className={colorClass} size={24} />
            </div>
        </div>
    </div>
);

const MetricsDashboard = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [brandFilter, setBrandFilter] = useState("TODOS"); // TODAY, ACTIVOS, INACTIVOS
    const [showValueModal, setShowValueModal] = useState(false);
    const [showInactiveModal, setShowInactiveModal] = useState(false);
    const [showActiveModal, setShowActiveModal] = useState(false);
    const [showRobadoModal, setShowRobadoModal] = useState(false);
    const [showPrinterModal, setShowPrinterModal] = useState(false);
    const [showProgramModal, setShowProgramModal] = useState(false);

    // Generic Modal State
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [detailModalConfig, setDetailModalConfig] = useState({ title: '', filterType: '', filterValue: '' });

    const router = useRouter();
    const { user } = useAuth();

    const [impresorasData, setImpresorasData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [invRes, printerRes] = await Promise.all([
                    api.get("/inventario"),
                    api.get("/impresoras")
                ]);
                setData(invRes.data);
                setImpresorasData(printerRes.data);
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
    const robados = data.filter(i => i.operativo && i.operativo.trim().toUpperCase() === 'ROBADO').length;
    const impresoras = impresorasData.length;
    const otros = totalEquipos - (activos + inactivos + robados);

    // Calculate depreciated value
    const totalValor = data.reduce((acc, item) => {
        // Include all equipment regardless of status
        const val = calculateDepreciatedValue(item.valor_neto, item.fecha_adquisicion) || 0;
        return acc + val;
    }, 0);

    const formattedValor = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(totalValor);

    // 2. Activos vs Inactivos (Chart Data)
    const operativoData = [
        { name: 'Activos', value: activos },
        { name: 'Inactivos', value: inactivos },
    ];

    if (robados > 0) {
        operativoData.push({ name: 'Robados', value: robados });
    }

    if (otros > 0) {
        operativoData.push({ name: 'Sin Info / Otros', value: otros });
    }

    // 2.5 Location Distribution (Oficina vs Terreno)
    const locationCount = data.reduce((acc, item) => {
        const ubicacion = item.ubicacion ? item.ubicacion.toLowerCase() : '';
        if (ubicacion.includes('terreno')) {
            acc.terreno++;
        } else if (ubicacion.includes('oficina')) {
            acc.oficina++;
        } else {
            acc.otros++;
        }
        return acc;
    }, { oficina: 0, terreno: 0, otros: 0 });

    const locationData = [
        { name: 'Oficina', value: locationCount.oficina },
        { name: 'Terreno', value: locationCount.terreno },
    ];
    if (locationCount.otros > 0) {
        locationData.push({ name: 'Otro/Sin Info', value: locationCount.otros });
    }

    // 2.8 OS Distribution (Windows 10 vs 11 vs Others)
    const osCount = data.reduce((acc, item) => {
        let os = item.sistema_operativo ? item.sistema_operativo.trim() : '';
        let category = 'Sin Información';
        if (os) {
            const lowerOS = os.toLowerCase();
            if (lowerOS.includes('windows 11')) category = 'Windows 11';
            else if (lowerOS.includes('windows 10')) category = 'Windows 10';
            else if (lowerOS.includes('windows 8') || lowerOS.includes('windows 7')) category = 'Windows 7/8';
            else if (lowerOS.includes('mac') || lowerOS.includes('osx') || lowerOS.includes('os x')) category = 'macOS';
            else category = 'Otros';
        }
        acc[category] = (acc[category] || 0) + 1;
        return acc;
    }, {});

    const osData = Object.keys(osCount).map(key => ({
        name: key,
        value: osCount[key]
    })).sort((a, b) => b.value - a.value);

    // 3.5 Windows License Distribution
    const licenseCount = data.reduce((acc, item) => {
        let license = item.licencia_windows ? item.licencia_windows.trim() : 'Sin Información';
        if (license === '') license = 'Sin Información';

        acc[license] = (acc[license] || 0) + 1;
        return acc;
    }, {});

    const licenseData = Object.keys(licenseCount).map(key => ({
        name: key,
        value: licenseCount[key]
    })).sort((a, b) => b.value - a.value);

    // 4.5 Unit Distribution
    const unitCount = data.reduce((acc, item) => {
        let unit = item.unidad ? item.unidad.trim() : 'Sin Unidad';
        if (unit === '') unit = 'Sin Unidad';
        // Normalize
        unit = unit.toUpperCase();

        acc[unit] = (acc[unit] || 0) + 1;
        return acc;
    }, {});

    const unitData = Object.keys(unitCount)
        .map(key => ({ name: key, value: unitCount[key] }))
        .sort((a, b) => b.value - a.value);

    // 5.5 Program Distribution
    const programCount = data.reduce((acc, item) => {
        if (item.programas && item.programas.length > 0) {
            item.programas.forEach(p => {
                const progName = p.nombre_programa;
                acc[progName] = (acc[progName] || 0) + 1;
            });
        }
        return acc;
    }, {});

    const programDataFull = Object.keys(programCount).map(key => {
        const value = programCount[key];
        const percentage = totalEquipos > 0 ? ((value / totalEquipos) * 100).toFixed(1) : 0;
        return {
            name: key,
            value: value,
            percentage: Number(percentage)
        };
    }).sort((a, b) => b.value - a.value);

    const programData = programDataFull.slice(0, 20); // Top 20 para que no sea infinita

    // 5. Brands Logic with Filter

    const getFilteredBrandData = () => {
        let filtered = data;
        if (brandFilter === 'ACTIVOS') {
            filtered = data.filter(i => i.operativo === 'SI');
        } else if (brandFilter === 'INACTIVOS') {
            filtered = data.filter(i => i.operativo === 'NO');
        } else if (brandFilter === 'ROBADOS') {
            filtered = data.filter(i => i.operativo && i.operativo.trim().toUpperCase() === 'ROBADO');
        }
        return filtered;
    };

    const brandCount = getFilteredBrandData().reduce((acc, item) => {
        let brand = item.marca ? item.marca.trim() : 'Sin Marca';

        // Normalize Brands to avoid duplicates
        if (brand.toUpperCase() === 'DELL') brand = 'Dell';
        if (brand.toUpperCase() === 'HP') brand = 'HP';
        if (brand.toUpperCase() === 'LENOVO') brand = 'Lenovo';

        acc[brand] = (acc[brand] || 0) + 1;
        return acc;
    }, {});

    const brandData = Object.keys(brandCount)
        .map(key => ({ name: key, value: brandCount[key] }))
        .sort((a, b) => b.value - a.value);



    return (
        <div className="p-8 bg-gray-50 min-h-screen font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="mb-10">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Panel de Métricas</h1>
                    <p className="text-gray-500 mt-2">Visión general del estado del inventario y distribución de recursos.</p>
                </div>

                {/* KPI Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 items-stretch">
                    <div className="h-full">
                        <KPICard
                            title="Total Equipos"
                            value={totalEquipos}
                            icon={FaDesktop}
                            bgClass="bg-blue-50"
                            colorClass="text-blue-600"
                        />
                    </div>
                    <div onClick={() => setShowActiveModal(true)} className="cursor-pointer transition-transform hover:scale-105 h-full">
                        <KPICard
                            title="Equipos Activos"
                            value={activos}
                            icon={FaCheckCircle}
                            bgClass="bg-emerald-50"
                            colorClass="text-emerald-600"
                        />
                    </div>
                    <div onClick={() => setShowInactiveModal(true)} className="cursor-pointer transition-transform hover:scale-105 h-full">
                        <KPICard
                            title="Equipos Inactivos"
                            value={inactivos}
                            icon={FaTimesCircle}
                            bgClass="bg-red-50"
                            colorClass="text-red-600"
                        />
                    </div>
                    <div onClick={() => setShowRobadoModal(true)} className="cursor-pointer transition-transform hover:scale-105 h-full">
                        <KPICard
                            title="Equipos Robados"
                            value={robados}
                            icon={FaUserSecret}
                            bgClass="bg-orange-50"
                            colorClass="text-orange-600"
                        />
                    </div>
                    <div onClick={() => setShowPrinterModal(true)} className="cursor-pointer transition-transform hover:scale-105 h-full">
                        <KPICard
                            title="Total Impresoras y Escáneres"
                            value={impresoras}
                            icon={FaPrint}
                            bgClass="bg-purple-50"
                            colorClass="text-purple-600"
                        />
                    </div>
                    <div onClick={() => setShowValueModal(true)} className="cursor-pointer transition-transform hover:scale-105 lg:col-span-3 h-full">
                        <KPICard
                            title="Valor Estimado Total"
                            value={totalValor > 0 ? formattedValor : "N/A"}
                            icon={FaDollarSign}
                            bgClass="bg-amber-50"
                            colorClass="text-amber-600"
                        />
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">

                    {/* Windows License Distribution (Donut Chart) - NEW */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <FaDesktop className="text-blue-500" />
                                <h3 className="text-lg font-bold text-gray-800">Licencias Windows</h3>
                            </div>
                            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                Total: {totalEquipos}
                            </span>
                        </div>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={licenseData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={5}
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        onClick={(data) => {
                                            if (data && data.name) {
                                                setDetailModalConfig({
                                                    title: 'Detalle Licencia',
                                                    filterType: 'LICENSE',
                                                    filterValue: data.name
                                                });
                                                setShowDetailModal(true);
                                            }
                                        }}
                                        cursor="pointer"
                                    >
                                        {licenseData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cursor="pointer" />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Operatividad (Donut Chart) */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <FaChartPie className="text-purple-500" />
                                <h3 className="text-lg font-bold text-gray-800">Estado Operativo</h3>
                            </div>
                            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                Total: {totalEquipos}
                            </span>
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
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        onClick={(data) => {
                                            if (data && data.name) {
                                                setDetailModalConfig({
                                                    title: 'Detalle Estado Operativo',
                                                    filterType: 'STATUS',
                                                    filterValue: data.name
                                                });
                                                setShowDetailModal(true);
                                            }
                                        }}
                                        cursor="pointer"
                                    >
                                        <Cell fill="#10b981" cursor="pointer" /> {/* Activos */}
                                        <Cell fill="#ef4444" cursor="pointer" /> {/* Inactivos */}
                                        {robados > 0 && <Cell fill="#f97316" cursor="pointer" />} {/* Robados */}
                                        {otros > 0 && <Cell fill="#9ca3af" cursor="pointer" />} {/* Otros - Gray */}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Location Distribution (Pie Chart) - NEW */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <FaChartPie className="text-teal-500" />
                                <h3 className="text-lg font-bold text-gray-800">Oficina vs Terreno</h3>
                            </div>
                            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                Total: {totalEquipos}
                            </span>
                        </div>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={locationData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={5}
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        onClick={(data) => {
                                            if (data && data.name) {
                                                setDetailModalConfig({
                                                    title: 'Detalle Ubicación',
                                                    filterType: 'LOCATION',
                                                    filterValue: data.name
                                                });
                                                setShowDetailModal(true);
                                            }
                                        }}
                                        cursor="pointer"
                                    >
                                        {/* Oficina: Teal, Terreno: Orange, Otros: Gray */}
                                        <Cell fill="#0d9488" cursor="pointer" />
                                        <Cell fill="#f97316" cursor="pointer" />
                                        <Cell fill="#9ca3af" cursor="pointer" />
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* OS Distribution (Donut Chart) - NEW */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <FaWindows className="text-blue-600" />
                                <h3 className="text-lg font-bold text-gray-800">Sistemas Operativos</h3>
                            </div>
                            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                Total: {totalEquipos}
                            </span>
                        </div>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={osData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={5}
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        onClick={(data) => {
                                            if (data && data.name) {
                                                setDetailModalConfig({
                                                    title: 'Detalle Sistema Operativo',
                                                    filterType: 'OS',
                                                    filterValue: data.name
                                                });
                                                setShowDetailModal(true);
                                            }
                                        }}
                                        cursor="pointer"
                                    >
                                        {osData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} cursor="pointer" />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Brands (Pie Chart) */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 md:col-span-2">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                            <div className="flex items-center gap-2">
                                <FaChartPie className="text-indigo-500" />
                                <h3 className="text-lg font-bold text-gray-800">Distribución por Marca</h3>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                    Total: {getFilteredBrandData().length}
                                </span>
                                <div className="flex bg-gray-100 p-1 rounded-lg text-xs font-medium">
                                    {['TODOS', 'ACTIVOS', 'INACTIVOS', 'ROBADOS'].filter(f => {
                                        if (f === 'TODOS') return true;
                                        if (f === 'ACTIVOS') return activos > 0;
                                        if (f === 'INACTIVOS') return inactivos > 0;
                                        if (f === 'ROBADOS') return robados > 0;
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
                        <div className="h-[450px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={brandData}
                                    layout="vertical"
                                    margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                                    <XAxis type="number" tick={{ fontSize: 12, fill: '#6b7280' }} />
                                    <YAxis
                                        dataKey="name"
                                        type="category"
                                        width={180}
                                        tick={{ fontSize: 11, fill: '#4b5563' }}
                                        interval={0}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar
                                        dataKey="value"
                                        radius={[0, 4, 4, 0]}
                                        name="Cantidad"
                                        barSize={20}
                                        onClick={(data) => {
                                            if (data && data.name) {
                                                setDetailModalConfig({
                                                    title: 'Detalle Marca',
                                                    filterType: 'BRAND',
                                                    filterValue: data.name,
                                                    secondaryFilter: brandFilter // Pass the current status filter (ACTIVOS, INACTIVOS, TODOS)
                                                });
                                                setShowDetailModal(true);
                                            }
                                        }}
                                        cursor="pointer"
                                    >
                                        {brandData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cursor="pointer" />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>




                    {/* Program Distribution (Bar Chart) - Full Width */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 md:col-span-2">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <FaCogs className="text-rose-500" />
                                <h3 className="text-lg font-bold text-gray-800">Uso de Programas (Top 20)</h3>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                    Total Equipos: {totalEquipos}
                                </span>
                                <button
                                    onClick={() => setShowProgramModal(true)}
                                    className="text-sm bg-rose-50 text-rose-600 hover:bg-rose-100 px-3 py-1 rounded-md flex items-center gap-1 transition-colors border border-rose-200 font-medium"
                                >
                                    Ver Todos
                                </button>
                            </div>
                        </div>
                        <div className="h-96">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={programData}
                                    layout="vertical"
                                    margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                                    <XAxis type="number" tick={{ fontSize: 12, fill: '#6b7280' }} />
                                    <YAxis
                                        dataKey="name"
                                        type="category"
                                        width={200}
                                        tick={{ fontSize: 11, fill: '#4b5563' }}
                                        interval={0}
                                    />
                                    <Tooltip 
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                return (
                                                    <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-lg">
                                                        <p className="text-sm font-bold text-gray-800 mb-1">{payload[0].payload.name}</p>
                                                        <p className="text-sm text-rose-600 font-medium whitespace-nowrap">
                                                            Equipos: {payload[0].value}
                                                        </p>
                                                        <p className="text-xs text-gray-500 font-medium">
                                                            Porcentaje de Uso: {payload[0].payload.percentage}%
                                                        </p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Bar
                                        dataKey="value"
                                        radius={[0, 4, 4, 0]}
                                        name="Cantidad"
                                        barSize={16}
                                        onClick={(data) => {
                                            if (data && data.name) {
                                                setDetailModalConfig({
                                                    title: 'Detalle Programa',
                                                    filterType: 'PROGRAM',
                                                    filterValue: data.name
                                                });
                                                setShowDetailModal(true);
                                            }
                                        }}
                                        cursor="pointer"
                                    >
                                        {programData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cursor="pointer" />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Unit Distribution (Bar Chart) - NEW */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 md:col-span-2">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <FaBuilding className="text-gray-600" />
                                <h3 className="text-lg font-bold text-gray-800">Distribución por Unidad</h3>
                            </div>
                            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                Total: {totalEquipos}
                            </span>
                        </div>
                        <div className="h-96">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={unitData}
                                    layout="vertical"
                                    margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                                    <XAxis type="number" tick={{ fontSize: 12, fill: '#6b7280' }} />
                                    <YAxis
                                        dataKey="name"
                                        type="category"
                                        width={180}
                                        tick={{ fontSize: 11, fill: '#4b5563' }}
                                        interval={0}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar
                                        dataKey="value"
                                        fill="#6366f1" // Indigo
                                        radius={[0, 4, 4, 0]}
                                        name="Cantidad"
                                        barSize={20}
                                        onClick={(data) => {
                                            if (data && data.name) {
                                                setDetailModalConfig({
                                                    title: 'Detalle Unidad',
                                                    filterType: 'UNIT',
                                                    filterValue: data.name
                                                });
                                                setShowDetailModal(true);
                                            }
                                        }}
                                        cursor="pointer"
                                    >
                                        {unitData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cursor="pointer" />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>
            </div>

            <ValueDetailsModal
                isOpen={showValueModal}
                onClose={() => setShowValueModal(false)}
                data={data}
            />

            <InactiveDetailsModal
                isOpen={showInactiveModal}
                onClose={() => setShowInactiveModal(false)}
                data={data}
            />

            <ActiveDetailsModal
                isOpen={showActiveModal}
                onClose={() => setShowActiveModal(false)}
                data={data}
            />

            <RobadoDetailsModal
                isOpen={showRobadoModal}
                onClose={() => setShowRobadoModal(false)}
                data={data}
            />

            <PrinterDetailsModal
                isOpen={showPrinterModal}
                onClose={() => setShowPrinterModal(false)}
                data={data}
            />



            <MetricsDetailModal
                isOpen={showDetailModal}
                onClose={() => setShowDetailModal(false)}
                data={data}
                title={detailModalConfig.title}
                filterType={detailModalConfig.filterType}
                filterValue={detailModalConfig.filterValue}
                secondaryFilter={detailModalConfig.secondaryFilter}
            />

            <ProgramListModal
                isOpen={showProgramModal}
                onClose={() => setShowProgramModal(false)}
                programData={programDataFull}
                totalEquipos={totalEquipos}
            />
        </div>
    );
};

export default MetricsDashboard;
