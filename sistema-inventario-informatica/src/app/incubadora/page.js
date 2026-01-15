"use client";
import "../globals.css";
import React, { useState, useEffect } from "react";
import useIsMobile from "@/hooks/useIsMobile";
import Cookies from "js-cookie";
import SessionExpiredModal from "@/components/SessionExpiredModal";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
import useTokenVerification from "@/hooks/useTokenVerification";
import { FaCloudUploadAlt, FaHistory } from 'react-icons/fa';

export default function Home() {
    const isMobile = useIsMobile();
    const { sessionModalVisible, handleSessionModalOk } = useTokenVerification();
    const router = useRouter();

    return (
        <div className="flex w-full min-h-screen items-center justify-start pt-20 text-sky-900 flex-col p-4 bg-gray-50">

            <h2 className="text-2xl font-bold mb-8">Menú Incubadoras</h2>

            <div className={`grid gap-6 ${isMobile ? 'grid-cols-1 w-full' : 'grid-cols-2 w-2/3 max-w-4xl'}`}>

                {/* Opción 1: Subir Temperatura */}
                <div
                    onClick={() => router.push('/incubadora/subir')}
                    className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow cursor-pointer flex flex-col items-center justify-center border border-gray-100 hover:border-sky-300 group"
                >
                    <div className="p-4 rounded-full bg-sky-100 group-hover:bg-sky-500 transition-colors mb-4">
                        <FaCloudUploadAlt className="text-4xl text-sky-600 group-hover:text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Subir Temperatura</h3>
                    <p className="text-sm text-gray-500 text-center">
                        Cargar archivos Excel con registros de temperatura.
                    </p>
                </div>

                {/* Opción 2: Consultar Historial */}
                <div
                    onClick={() => router.push('/incubadora/historial')}
                    className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow cursor-pointer flex flex-col items-center justify-center border border-gray-100 hover:border-sky-300 group"
                >
                    <div className="p-4 rounded-full bg-orange-100 group-hover:bg-orange-500 transition-colors mb-4">
                        <FaHistory className="text-4xl text-orange-600 group-hover:text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Consultar Historial</h3>
                    <p className="text-sm text-gray-500 text-center">
                        Visualizar registros históricos de incubadoras.
                    </p>
                </div>

            </div>

            <SessionExpiredModal
                isVisible={sessionModalVisible}
                onOk={handleSessionModalOk}
            />
        </div>
    );
}