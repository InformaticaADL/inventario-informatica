"use client";
import React, { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import InventarioTable from '@/components/InventarioTable';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function InventarioPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [showImage, setShowImage] = useState(false);

    useEffect(() => {
        // Ninguna restricción de GER, todos los usuarios pueden acceder
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <Toaster position="top-right" />

            <div className="mb-6 flex flex-col gap-4">
                {showImage && (
                    <div className="w-full rounded-lg overflow-hidden shadow-sm border border-gray-200 bg-gray-50 p-4 flex justify-center">
                        <img src="/FoGe-IE-05.png" alt="FoGe IE-05" className="w-full max-w-4xl h-auto object-contain max-h-[450px] rounded" />
                    </div>
                )}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Inventario de Equipos</h1>
                        <p className="text-gray-600 mt-1">Gestión completa de activos informáticos</p>
                    </div>
                    <button
                        onClick={() => setShowImage(!showImage)}
                        className="px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-md text-sm font-medium hover:bg-blue-100 transition shadow-sm flex items-center gap-2"
                    >
                        {showImage ? (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path></svg>
                                Ocultar FoGe IE-05
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                Mostrar FoGe IE-05
                            </>
                        )}
                    </button>
                </div>
            </div>

            <InventarioTable />
        </div>
    );
}
