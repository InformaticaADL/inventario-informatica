"use client";
import React, { useEffect } from 'react';
import InventarioTable from '@/components/InventarioTable';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function InventarioPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            // Keep the GER redirect logic if relevant for this specific view, 
            // or maybe GER users shouldn't even see the card to get here? 
            // For now, I'll keep it to be safe, or remove it if GER only uses Metrics.
            // The original code redirected GER from dashboard to metrics. 
            // If they land here, they might still need redirect if they shouldn't see this.
            if (user.seccion === 'GER') {
                router.push('/dashboard/metrics');
            }
        }
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
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Inventario de Equipos</h1>
                    <p className="text-gray-600 mt-1">Gestión completa de activos informáticos</p>
                </div>
            </div>

            <InventarioTable />
        </div>
    );
}
