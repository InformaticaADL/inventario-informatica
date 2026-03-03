"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import CorreosADLTable from '@/components/CorreosADLTable';
import CorreosADLModal from '@/components/CorreosADLModal';
import { useAuth } from '@/hooks/useAuth';

const CorreosADLPage = () => {
    const { user, loading: authLoading } = useAuth();
    const [correos, setCorreos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const [showImage, setShowImage] = useState(false);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api';

    const fetchCorreos = async () => {
        try {
            const response = await axios.get(`${API_URL}/correos-adl`);
            setCorreos(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching correos:", error);
            toast.error("Error al cargar los correos");
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading && user) {
            fetchCorreos();
        }
    }, [authLoading, user]);

    const handleAdd = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = async (item) => {
        if (window.confirm(`¿Estás seguro de eliminar el correo de ${item.nombre}?`)) {
            try {
                await axios.delete(`${API_URL}/correos-adl/${item.id_correo}`);
                toast.success("Correo eliminado correctamente");
                fetchCorreos();
            } catch (error) {
                console.error("Error deleting correo:", error);
                toast.error("Error al eliminar el correo");
            }
        }
    };

    const handleSave = async (formData) => {
        try {
            if (editingItem) {
                await axios.put(`${API_URL}/correos-adl/${editingItem.id_correo}`, formData);
                toast.success("Correo actualizado correctamente");
            } else {
                await axios.post(`${API_URL}/correos-adl`, formData);
                toast.success("Correo creado correctamente");
            }
            setIsModalOpen(false);
            fetchCorreos();
        } catch (error) {
            console.error("Error saving correo:", error);
            toast.error("Error al guardar el correo");
        }
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
                        <img src="/FoGe-IE-06.png" alt="FoGe IE-06" className="w-full max-w-4xl h-auto object-contain max-h-[450px] rounded" />
                    </div>
                )}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Correos ADL</h1>
                        <p className="text-gray-600 mt-1">Gestión de cuentas de correo</p>
                    </div>
                    <button
                        onClick={() => setShowImage(!showImage)}
                        className="px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-md text-sm font-medium hover:bg-blue-100 transition shadow-sm flex items-center gap-2"
                    >
                        {showImage ? (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path></svg>
                                Ocultar FoGe IE-06
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                Mostrar FoGe IE-06
                            </>
                        )}
                    </button>
                </div>
            </div>

            <CorreosADLTable
                data={correos}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAdd={handleAdd}
            />

            <CorreosADLModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                editingItem={editingItem}
            />
        </div>
    );
};

export default CorreosADLPage;
