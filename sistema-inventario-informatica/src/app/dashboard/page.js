"use client";
import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaDesktop, FaEnvelope } from 'react-icons/fa';

export default function DashboardPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            if (user.seccion === 'GER') {
                router.push('/dashboard/metrics');
            }
        }
    }, [user, loading, router]);

    if (loading || (user && user.seccion === 'GER')) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Bienvenido al Sistema de Gestión</h1>
                <p className="text-gray-600 max-w-lg mx-auto">
                    Selecciona una categoría para comenzar a gestionar los recursos de informática.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl px-4">
                {/* Card Equipos */}
                <Link
                    href="/dashboard/inventario"
                    className="group bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300 flex flex-col items-center text-center cursor-pointer"
                >
                    <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                        <FaDesktop size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">Equipos y Periféricos</h2>
                    <p className="text-gray-500 text-sm">
                        Gestión detallada de computadores, monitores, impresoras y otros activos de hardware.
                    </p>
                </Link>

                {/* Card Correos */}
                <Link
                    href="/dashboard/correos-adl"
                    className="group bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:border-emerald-100 transition-all duration-300 flex flex-col items-center text-center cursor-pointer"
                >
                    <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                        <FaEnvelope size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-emerald-600 transition-colors">Correos ADL</h2>
                    <p className="text-gray-500 text-sm">
                        Administración de cuentas de correo electrónico, contraseñas y asignaciones.
                    </p>
                </Link>
            </div>
        </div>
    );
}
