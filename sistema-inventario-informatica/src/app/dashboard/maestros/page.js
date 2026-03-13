"use client";
import React, { useState, useEffect } from 'react';
import api from '@/api/apiConfig';
import MaestroManager from '@/components/MaestroManager';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { FaBuilding, FaTags, FaDesktop, FaMicrochip, FaHdd, FaWindows, FaBriefcase, FaLayerGroup, FaMapMarkerAlt, FaChevronLeft } from 'react-icons/fa';
import Link from 'next/link';
import { Toaster } from 'react-hot-toast';

export default function MaestrosPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("sedes");
    const [secciones, setSecciones] = useState([]);

    useEffect(() => {
        const fetchSecciones = async () => {
            try {
                const response = await api.get("/seccion");
                setSecciones(response.data.map(s => ({ id: s.id_seccion, label: s.nombre_seccion })));
            } catch (error) {
                console.error("Error fetching sections:", error);
            }
        };
        fetchSecciones();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Role protection
    if (user && user.seccion !== 'INF' && user.seccion !== 'GER') {
        router.push('/dashboard');
        return null;
    }

    const tabs = [
        {
            id: "sedes", label: "Sedes", icon: FaBuilding, endpoint: "/sede", idField: "id_lugaranalisis", fields: [
                { name: "nombre_lugaranalisis", label: "Nombre", type: "text", required: true },
                { name: "sigla", label: "Sigla", type: "text" },
                { name: "habilitado", label: "Habilitado", type: "select", options: [{ id: "S", label: "S" }, { id: "N", label: "N" }] },
            ]
        },
        {
            id: "marcas", label: "Marcas", icon: FaTags, endpoint: "/marca", idField: "id_marca", fields: [
                { name: "nombre_marca", label: "Nombre Marca", type: "text", required: true },
            ]
        },
        {
            id: "tipos", label: "Tipos de Equipo", icon: FaDesktop, endpoint: "/tipo-equipo", idField: "id_tipoequipo", isMale: true, singularTitle: "Tipo de equipo", fields: [
                { name: "nombre_tipoequipo", label: "Nombre Tipo", type: "text", required: true },
            ]
        },
        {
            id: "ram", label: "RAM", icon: FaMicrochip, endpoint: "/ram", idField: "id_ram", fields: [
                { name: "capacidad", label: "Capacidad (GB)", type: "number", required: true },
            ]
        },
        {
            id: "almacenamiento", label: "Disco Duro", icon: FaHdd, endpoint: "/almacenamiento", idField: "id_almacenamiento", isMale: true, singularTitle: "Disco duro", fields: [
                { name: "almacenamiento", label: "Capacidad/Tipo", type: "text", required: true },
            ]
        },
        { id: "so", label: "Sistemas Operativos", icon: FaWindows, endpoint: "/so", idField: "id_so", isMale: true, singularTitle: "Sistema operativo", fields: [{ name: "so", label: "Nombre S.O.", type: "text", required: true }] },
        {
            id: "programas", label: "Programas", icon: FaBriefcase, endpoint: "/programa", idField: "id_programa", isMale: true, singularTitle: "Programa", fields: [
                { name: "nombre_programa", label: "Nombre Programa", type: "text", required: true },
                { name: "id_seccion", label: "Sección(es) de Uso", type: "select", options: secciones, plural: true }
            ]
        },
        { id: "office", label: "Versiones Office", icon: FaBriefcase, endpoint: "/office", idField: "id_office", singularTitle: "Versión de Office", fields: [{ name: "office", label: "Versión Office", type: "text", required: true }] },
        {
            id: "secciones", label: "Secciones", icon: FaLayerGroup, endpoint: "/seccion", idField: "id_seccion", fields: [
                { name: "nombre_seccion", label: "Nombre Sección", type: "text", required: true },
                { name: "sigla_seccion", label: "Sigla", type: "text" },
                { name: "codigo_seccion", label: "Código", type: "text" },
                { name: "orden", label: "Orden", type: "number" },
            ]
        },
        {
            id: "ubicaciones", label: "Ubicaciones", icon: FaMapMarkerAlt, endpoint: "/ubicacion", idField: "id_ubicacion", fields: [
                { name: "nombre_ubicacion", label: "Ubicación", type: "text", required: true },
            ]
        }
    ];

    const currentTab = tabs.find(t => t.id === activeTab);

    return (
        <div className="flex flex-col h-full gap-6">
            <Toaster position="top-right" />

            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Link href="/dashboard" className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 text-sm font-medium">
                            <FaChevronLeft size={12} /> Volver al Dashboard
                        </Link>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Gestión de Maestros</h1>
                    <p className="text-gray-500 mt-1">Configuración de categorías y valores del sistema</p>
                </div>
                <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg border border-blue-100 text-sm font-medium">
                    Solo visible para Informática
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 items-start">
                {/* Sidebar Navigation */}
                <div className="w-full lg:w-72 bg-white rounded-xl shadow-sm border border-gray-100 p-2 flex-shrink-0">
                    <div className="space-y-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                                    }`}
                            >
                                <tab.icon size={16} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 w-full">
                    {currentTab && (
                        <MaestroManager
                            key={currentTab.id}
                            endpoint={currentTab.endpoint}
                            title={currentTab.label}
                            idField={currentTab.idField}
                            fields={currentTab.fields}
                            isMale={currentTab.isMale}
                            singularTitle={currentTab.singularTitle}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
