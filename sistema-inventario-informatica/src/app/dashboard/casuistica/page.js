"use client";
import React, { useState, useEffect } from 'react';
import { FaCalendarWeek, FaCalendarAlt } from 'react-icons/fa';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import CasuisticaTable from '@/components/CasuisticaTable';
import CasuisticaModal from '@/components/CasuisticaModal';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

const CasuisticaPage = () => {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [casuisticas, setCasuisticas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api';

    useEffect(() => {
        if (!authLoading) {
            if (!user || (user.seccion !== 'INF' && user.seccion !== 'GER')) {
                router.push('/dashboard');
            } else {
                fetchCasuisticas();
            }
        }
    }, [authLoading, user, router]);

    const fetchCasuisticas = async () => {
        try {
            const response = await axios.get(`${API_URL}/casuistica`);
            setCasuisticas(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching casuisticas:", error);
            toast.error("Error al cargar la información de casuística");
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = async (item) => {
        if (window.confirm(`¿Estás seguro de eliminar el registro de ${item.empresa}?`)) {
            try {
                await axios.delete(`${API_URL}/casuistica/${item.id_casuistica}`);
                toast.success("Registro eliminado correctamente");
                fetchCasuisticas();
            } catch (error) {
                console.error("Error deleting casuistica:", error);
                toast.error("Error al eliminar el registro");
            }
        }
    };

    const handleSave = async (formData) => {
        try {
            if (editingItem) {
                await axios.put(`${API_URL}/casuistica/${editingItem.id_casuistica}`, formData);
                toast.success("Registro actualizado correctamente");
            } else {
                await axios.post(`${API_URL}/casuistica`, formData);
                toast.success("Registro creado correctamente");
            }
            setIsModalOpen(false);
            fetchCasuisticas();
        } catch (error) {
            console.error("Error saving casuistica:", error);
            toast.error("Error al guardar el registro");
        }
    };

    if (authLoading || loading) {
        return (
            <div className="flex items-center justify-center min-h-screen relative">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (user?.seccion !== 'INF' && user?.seccion !== 'GER') return null;

    return (
        <div className="flex flex-col h-full">
            <Toaster position="top-right" />

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Casuística (Lunes)</h1>
                    <p className="text-gray-600 mt-1">Gestión de datos enviados a clientes todos los lunes.</p>
                </div>
            </div>

            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-4 shadow-sm">
                    <div className="p-3 bg-blue-100 rounded-lg text-blue-600 mt-1">
                        <FaCalendarWeek size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-blue-900 text-lg">Envío Semanal</h3>
                        <p className="text-sm text-blue-700 mt-1 font-medium">Blumar, Camanchaca, Multi X</p>
                    </div>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex items-start gap-4 shadow-sm">
                    <div className="p-3 bg-purple-100 rounded-lg text-purple-600 mt-1">
                        <FaCalendarAlt size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-purple-900 text-lg">Envío Mensual</h3>
                        <p className="text-sm text-purple-700 mt-1 font-medium">Australis Mar, Invermar</p>
                    </div>
                </div>
            </div>

            <CasuisticaTable
                data={casuisticas}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAdd={handleAdd}
            />

            <CasuisticaModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                editingItem={editingItem}
            />
        </div>
    );
};

export default CasuisticaPage;
