"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import ClavesWifiTable from '@/components/ClavesWifiTable';
import ClavesWifiModal from '@/components/ClavesWifiModal';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

const ClavesWifiPage = () => {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [claves, setClaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api';

    useEffect(() => {
        if (!authLoading) {
            if (!user || user.seccion !== 'INF') {
                router.push('/dashboard');
            } else {
                fetchClaves();
            }
        }
    }, [authLoading, user, router]);

    const fetchClaves = async () => {
        try {
            const response = await axios.get(`${API_URL}/claves-wifi`);
            setClaves(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching claves wifi:", error);
            toast.error("Error al cargar las claves WiFi");
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
        if (window.confirm(`¿Estás seguro de eliminar el registro de wifi: ${item.nombre}?`)) {
            try {
                await axios.delete(`${API_URL}/claves-wifi/${item.id_clave}`);
                toast.success("Registro eliminado correctamente");
                fetchClaves();
            } catch (error) {
                console.error("Error deleting clave:", error);
                toast.error("Error al eliminar el registro");
            }
        }
    };

    const handleSave = async (formData) => {
        try {
            if (editingItem) {
                await axios.put(`${API_URL}/claves-wifi/${editingItem.id_clave}`, formData);
                toast.success("Registro actualizado correctamente");
            } else {
                await axios.post(`${API_URL}/claves-wifi`, formData);
                toast.success("Registro creado correctamente");
            }
            setIsModalOpen(false);
            fetchClaves();
        } catch (error) {
            console.error("Error saving clave:", error);
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

    // Doble validación visual por seguridad
    if (user?.seccion !== 'INF') return null;

    return (
        <div className="flex flex-col h-full">
            <Toaster position="top-right" />

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Claves WiFi y Accesos Técnicos</h1>
                    <p className="text-gray-600 mt-1">Gestión de credenciales exclusivas del equipo INF</p>
                </div>
            </div>

            <ClavesWifiTable
                data={claves}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAdd={handleAdd}
            />

            <ClavesWifiModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                editingItem={editingItem}
            />
        </div>
    );
};

export default ClavesWifiPage;
