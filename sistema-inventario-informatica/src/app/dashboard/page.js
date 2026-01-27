"use client";
import React from 'react';
import InventarioTable from '../../components/InventarioTable';

export default function DashboardPage() {
    // const { user, logout } = useAuth();

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
