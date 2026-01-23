"use client";
import React from 'react';
import InventarioTable from '../../components/InventarioTable';
import { useAuth } from '../../hooks/useAuth';
import { FaSignOutAlt, FaUser } from 'react-icons/fa';

export default function DashboardPage() {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Panel de Control</h1>
                        <p className="text-gray-500">Bienvenido al Sistema de Inventario Informática</p>
                    </div>

                    {user && (
                        <div className="flex items-center gap-4 bg-white p-2 pr-4 rounded-full shadow-sm border border-gray-100">
                            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                                {user.username ? user.username.charAt(0).toUpperCase() : <FaUser />}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold text-gray-800 leading-tight">{user.username}</span>
                                <span className="text-xs text-gray-500 leading-tight">{user.seccion || 'Sin Sección'}</span>
                            </div>
                            <div className="h-8 w-px bg-gray-200 mx-2"></div>
                            <button
                                onClick={logout}
                                className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
                                title="Cerrar Sesión"
                            >
                                <FaSignOutAlt size={18} />
                            </button>
                        </div>
                    )}
                </header>

                <main>
                    <InventarioTable />
                </main>
            </div>
        </div>
    );
}
