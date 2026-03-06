"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import MantencionesTable from '@/components/MantencionesTable';
import MantencionModal from '@/components/MantencionModal';
import { useAuth } from '@/hooks/useAuth';

const MantencionesPage = () => {
    const { user, loading: authLoading } = useAuth();
    const [mantenciones, setMantenciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showImage, setShowImage] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [duplicationData, setDuplicationData] = useState(null);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api';

    const fetchMantenciones = async () => {
        try {
            const response = await axios.get(`${API_URL}/mantenciones`);
            setMantenciones(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching mantenciones:", error);
            toast.error("Error al cargar las mantenciones");
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading && user) {
            fetchMantenciones();
        }
    }, [authLoading, user]);

    const handleSave = async (formData) => {
        try {
            await axios.post(`${API_URL}/mantenciones`, formData);
            toast.success("Mantención creada correctamente");
            setIsModalOpen(false);
            fetchMantenciones();
        } catch (error) {
            console.error("Error saving mantencion:", error);
            toast.error("Error al registrar la mantención");
        }
    };

    const handleDuplicate = (mantencion, nextDate) => {
        // Copiamos los datos pero limpiamos el ID y la fecha_mantencion
        const { id, fecha_mantencion: old_fecha, createdAt, updatedAt, ...rest } = mantencion;

        // Obtenemos la fecha actual en formato DD-MM-YYYY como respaldo
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const formattedToday = `${dd}-${mm}-${yyyy}`;

        const targetDate = nextDate || formattedToday;

        setDuplicationData({
            ...rest,
            fecha_mantencion: targetDate, // Usamos la fecha calculada de próxima mantención
            estado: 'Realizada', // Setear automáticamente a realizada
            // El campo recepcion_nombre se mantiene igual que el registro original
            recepcion_nombre: rest.recepcion_nombre || '',
            recepcion_fecha: targetDate // Misma fecha de mantención y recepción
            // El detalle_mantencion se mantiene igual al del registro original (base de datos)
        });
        setIsModalOpen(true);
    };

    if (authLoading || loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <Toaster position="top-right" />

            <div className="mb-6 flex flex-col gap-4">
                {showImage && (
                    <div className="w-full rounded-lg overflow-hidden shadow-sm border border-gray-200 bg-gray-50 p-4 flex justify-center">
                        <img src="/FoGe-IE 04.PNG" alt="FoGe IE-04" className="w-full max-w-4xl h-auto object-contain max-h-[450px] rounded" />
                    </div>
                )}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Mantenciones de Equipos</h1>
                        <p className="text-gray-600 mt-1">Registro histórico de mantenciones preventivas y correctivas (Ref: FoGe IE-04)</p>
                    </div>
                    <button
                        onClick={() => setShowImage(!showImage)}
                        className="px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-md text-sm font-medium hover:bg-blue-100 transition shadow-sm flex items-center gap-2"
                    >
                        {showImage ? (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path></svg>
                                Ocultar FoGe IE-04
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                Mostrar FoGe IE-04
                            </>
                        )}
                    </button>
                </div>
            </div>

            <MantencionesTable
                data={mantenciones}
                onDuplicate={handleDuplicate}
            />

            <MantencionModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setDuplicationData(null);
                }}
                onSave={handleSave}
                initialData={duplicationData}
            />
        </div>
    );
};

export default MantencionesPage;
