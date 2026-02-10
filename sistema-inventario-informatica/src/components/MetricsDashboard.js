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
    FaServer,
    FaChartPie,
    FaFileExcel
} from 'react-icons/fa';
import * as XLSX from 'xlsx';
import ValueDetailsModal from './ValueDetailsModal';
import InactiveDetailsModal from './InactiveDetailsModal';
import ActiveDetailsModal from './ActiveDetailsModal';
import OfficeDetailsModal from './OfficeDetailsModal';
import MetricsDetailModal from './MetricsDetailModal';
import { useAuth } from '@/hooks/useAuth';
import { parseCLP } from '@/utils/numberParsers';

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
    const [showValueModal, setShowValueModal] = useState(false);
    const [showInactiveModal, setShowInactiveModal] = useState(false);
    const [showActiveModal, setShowActiveModal] = useState(false);
    const [showOfficeModal, setShowOfficeModal] = useState(false);
    const [selectedOfficeVersion, setSelectedOfficeVersion] = useState(null);

    // Generic Modal State
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [detailModalConfig, setDetailModalConfig] = useState({ title: '', filterType: '', filterValue: '' });

    const router = useRouter();
    const { user } = useAuth();

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
    // Calculate approximate value if 'valor_neto' exists and is numeric-ish
    const totalValor = data.reduce((acc, item) => {
        // Include all equipment regardless of status
        const val = parseCLP(item.valor_neto);
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

    // 3. Office Versions
    const officeCount = data.reduce((acc, item) => {
        let version = 'Sin Office'; // Default for null/undefined/empty

        if (item.office && item.office.trim() !== '') {
            const lower = item.office.toLowerCase();
            if (lower.includes('libre')) version = 'LibreOffice';
            else if (lower.includes('365')) version = 'Office 365';
            else if (lower.includes('2019')) version = 'Office 2019';
            else if (lower.includes('2016')) version = 'Office 2016';
            else if (lower.includes('2013')) version = 'Office 2013';
            // Else remains 'Sin Office' -> Catches "Otro Office" cases
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



    // 6. Excel Export Logic (Replicated from OfficeReportTable)
    const handleExportOffice = () => {
        try {
            const dataToExport = data.map(item => ({
                "Nombre Equipo": item.nombre_equipo,
                "Sistema Operativo": item.sistema_operativo,
                "Versión Office": item.office,
                "Unidad": item.unidad
            }));

            const worksheet = XLSX.utils.json_to_sheet(dataToExport);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte Office");

            const date = new Date().toISOString().split('T')[0];
            XLSX.writeFile(workbook, `Reporte_Office_${date}.xlsx`);
        } catch (error) {
            console.error("Error exporting excel:", error);
        }
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen font-sans">
            <div className="max-w-7xl mx-auto">
                {user?.seccion === 'INF' && (
                    <button
                        onClick={() => router.back()}
                        className="mb-8 flex items-center gap-2 text-gray-500 hover:text-blue-600 font-medium transition-colors bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 hover:border-blue-200"
                    >
                        <FaArrowLeft size={14} /> Volver al Inventario
                    </button>
                )}

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
                    <div onClick={() => setShowActiveModal(true)} className="cursor-pointer transition-transform hover:scale-105">
                        <KPICard
                            title="Equipos Activos"
                            value={activos}
                            icon={FaCheckCircle}
                            bgClass="bg-emerald-50"
                            colorClass="text-emerald-600"
                        />
                    </div>
                    <div onClick={() => setShowInactiveModal(true)} className="cursor-pointer transition-transform hover:scale-105">
                        <KPICard
                            title="Equipos Inactivos"
                            value={inactivos}
                            icon={FaTimesCircle}
                            bgClass="bg-red-50"
                            colorClass="text-red-600"
                        />
                    </div>
                    <div onClick={() => setShowValueModal(true)} className="cursor-pointer transition-transform hover:scale-105">
                        <KPICard
                            title="Valor Estimado (Activos)"
                            value={totalValor > 0 ? formattedValor : "N/A"}
                            icon={FaDollarSign}
                            bgClass="bg-amber-50"
                            colorClass="text-amber-600"
                        />
                    </div>
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
                        <div className="flex items-center gap-2 mb-6">
                            <FaChartPie className="text-teal-500" />
                            <h3 className="text-lg font-bold text-gray-800">Oficina vs Terreno</h3>
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
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart
                                    data={brandData}
                                    layout="vertical"
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                    <XAxis type="number" tick={{ fontSize: 12, fill: '#6b7280' }} />
                                    <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12, fill: '#6b7280' }} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar
                                        dataKey="value"
                                        fill="#6366f1"
                                        radius={[0, 4, 4, 0]}
                                        name="Cantidad"
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
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Office Distribution (Vertical Bar) */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <FaDesktop className="text-sky-500" />
                                <h3 className="text-lg font-bold text-gray-800">Versiones de Office</h3>
                            </div>
                            <button
                                onClick={handleExportOffice}
                                className="text-sm bg-green-50 text-green-600 hover:bg-green-100 px-3 py-1 rounded-md flex items-center gap-1 transition-colors border border-green-200"
                                title="Exportar Reporte Office"
                            >
                                <FaFileExcel />
                                <span>Exportar</span>
                            </button>
                        </div>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={officeData} layout="vertical" margin={{ left: 20, right: 20, top: 10, bottom: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 13, fill: '#4b5563' }} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar
                                        dataKey="value"
                                        fill="#0ea5e9"
                                        radius={[0, 4, 4, 0]}
                                        name="Cantidad"
                                        onClick={(data) => {
                                            if (data && data.name) {
                                                setSelectedOfficeVersion(data.name);
                                                setShowOfficeModal(true);
                                            }
                                        }}
                                        cursor="pointer"
                                    >
                                        {officeData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cursor="pointer" />
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
                                    <Bar
                                        dataKey="value"
                                        fill="#f59e0b"
                                        radius={[4, 4, 0, 0]}
                                        name="Cantidad"
                                        onClick={(data) => {
                                            if (data && data.name) {
                                                setDetailModalConfig({
                                                    title: 'Detalle Modelo',
                                                    filterType: 'MODEL',
                                                    filterValue: data.name
                                                });
                                                setShowDetailModal(true);
                                            }
                                        }}
                                        cursor="pointer"
                                    />
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

            <OfficeDetailsModal
                isOpen={showOfficeModal}
                onClose={() => setShowOfficeModal(false)}
                data={data}
                filterVersion={selectedOfficeVersion}
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
        </div>
    );
};

export default MetricsDashboard;
