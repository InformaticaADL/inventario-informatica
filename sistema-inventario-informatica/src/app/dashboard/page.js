"use client";
import React, { useEffect } from 'react';
import InventarioTable from '../../components/InventarioTable';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

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

    // Opcional: Mostrar loading mientras decide o si es usuario GER (para evitar flash de contenido)
    if (loading || (user && user.seccion === 'GER')) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <>
            <header className="mb-6">
                <div>
                </div>
            </header>

            <main>
                <InventarioTable />
            </main>
        </>
    );
}
