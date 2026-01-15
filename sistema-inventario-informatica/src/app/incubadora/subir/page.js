"use client";
import "../../globals.css";
import React, { useState, useEffect } from "react";
import useIsMobile from "@/hooks/useIsMobile";
import Cookies from "js-cookie";
import SessionExpiredModal from "@/components/SessionExpiredModal";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
import useTokenVerification from "@/hooks/useTokenVerification";
import IncubadoraUpload from "@/components/IncubadoraUpload";


export default function PageSubir() {
    const isMobile = useIsMobile();
    const { sessionModalVisible, handleSessionModalOk } = useTokenVerification();
    const router = useRouter();

    return (
        <div className="flex w-full min-h-screen items-start text-sky-900 flex-col p-4">
            <div className="w-full mb-4">
                <button
                    onClick={() => router.push('/incubadora')}
                    className="flex items-center gap-2 text-sky-700 bg-sky-50 hover:bg-sky-100 px-4 py-2 rounded-lg transition-colors font-medium text-sm shadow-sm border border-sky-100"
                >
                    <span className="text-lg">←</span> Volver al Menú
                </button>
            </div>

            <div className="w-full flex justify-center mt-4">
                <IncubadoraUpload />
            </div>

            <SessionExpiredModal
                isVisible={sessionModalVisible}
                onOk={handleSessionModalOk}
            />
        </div>
    );
}
