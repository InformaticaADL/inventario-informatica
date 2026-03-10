"use client";
import React from 'react';
import { FaPrint } from 'react-icons/fa';
import ImpresorasTable from '@/components/ImpresorasTable';

export default function ImpresorasPage() {
    return (
        <div className="p-8 bg-gray-50 min-h-screen font-sans">
            <div className="max-w-[95%] mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center shadow-sm">
                        <FaPrint size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Gestión de Impresoras y Escáneres</h1>
                        <p className="text-gray-500 mt-1">Administración y control de periféricos de impresión y escáneres</p>
                    </div>
                </div>

                <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
                    <ImpresorasTable />
                </div>
            </div>
        </div>
    );
}
