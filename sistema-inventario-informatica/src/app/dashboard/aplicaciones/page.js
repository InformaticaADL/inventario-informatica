"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import AplicacionesTable from '@/components/AplicacionesTable';
import AplicacionesModal from '@/components/AplicacionesModal';
import { useAuth } from '@/hooks/useAuth';

const AplicacionesPage = () => {
    const { user, loading: authLoading } = useAuth();
    const [aplicaciones, setAplicaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api';

    const fetchAplicaciones = async () => {
        try {
            const response = await axios.get(`${API_URL}/aplicaciones`);
            setAplicaciones(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching aplicaciones:", error);
            toast.error("Error al cargar las aplicaciones");
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading && user) {
            fetchAplicaciones();
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
        if (window.confirm(`¿Estás seguro de eliminar la aplicación ${item.nombre}?`)) {
            try {
                await axios.delete(`${API_URL}/aplicaciones/${item.id_aplicacion}`);
                toast.success("Aplicación eliminada correctamente");
                fetchAplicaciones();
            } catch (error) {
                console.error("Error deleting aplicacion:", error);
                toast.error("Error al eliminar la aplicación");
            }
        }
    };

    const handleSave = async (formData) => {
        try {
            if (editingItem) {
                await axios.put(`${API_URL}/aplicaciones/${editingItem.id_aplicacion}`, formData);
                toast.success("Aplicación actualizada correctamente");
            } else {
                await axios.post(`${API_URL}/aplicaciones`, formData);
                toast.success("Aplicación creada correctamente");
            }
            setIsModalOpen(false);
            fetchAplicaciones();
        } catch (error) {
            console.error("Error saving aplicacion:", error);
            toast.error("Error al guardar la aplicación");
        }
    };

    if (authLoading || loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <Toaster position="top-right" />

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Aplicaciones y Puertos</h1>
                    <p className="text-gray-600 mt-1">Gestión de aplicaciones desplegadas</p>
                </div>
            </div>

            <AplicacionesTable
                data={aplicaciones}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAdd={handleAdd}
            />

            <AplicacionesModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                editingItem={editingItem}
            />
        </div>
    );
};

export default AplicacionesPage;
