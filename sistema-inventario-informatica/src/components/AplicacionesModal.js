"use client";
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FaTimes, FaSave, FaServer, FaGlobe, FaDatabase, FaCog } from 'react-icons/fa';

const AplicacionesModal = ({ isOpen, onClose, onSave, editingItem }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        url: '',
        puerto: '',
        servidor: '',
        base_datos: '',
        estado: 'Activo',
        observaciones: ''
    });

    useEffect(() => {
        if (editingItem) {
            setFormData(editingItem);
        } else {
            setFormData({
                nombre: '',
                url: '',
                puerto: '',
                servidor: '',
                base_datos: '',
                estado: 'Activo',
                observaciones: ''
            });
        }
    }, [editingItem, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (!formData.nombre?.trim()) {
            toast.error('El nombre de la aplicación es requerido');
            return false;
        }
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-purple-50">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <FaServer className="text-purple-600" />
                        {editingItem ? 'Editar Aplicación' : 'Nueva Aplicación'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-all"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6" noValidate>
                    <div className="space-y-6">
                        {/* Información General */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
                                <FaGlobe className="text-purple-600" />
                                Información General
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-700">Nombre de la Aplicación *</label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm"
                                        placeholder="Ej. Sistema de Inventario"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-700">URL</label>
                                    <input
                                        type="text"
                                        name="url"
                                        value={formData.url}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm"
                                        placeholder="http://192.168.10.52"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-700">Puerto</label>
                                    <input
                                        type="text"
                                        name="puerto"
                                        value={formData.puerto}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm"
                                        placeholder="Ej. 3000, 80"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-700">Estado</label>
                                    <select
                                        name="estado"
                                        value={formData.estado}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm"
                                    >
                                        <option value="Activo">Activo</option>
                                        <option value="Inactivo">Inactivo</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Infraestructura */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
                                <FaDatabase className="text-purple-600" />
                                Infraestructura
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-700">Servidor / IP</label>
                                    <input
                                        type="text"
                                        name="servidor"
                                        value={formData.servidor}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm"
                                        placeholder="Ej. SVR-Docker-01"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-700">Base de Datos</label>
                                    <input
                                        type="text"
                                        name="base_datos"
                                        value={formData.base_datos}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm"
                                        placeholder="Ej. MySQL - Inventario"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Observaciones */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
                                <FaCog className="text-purple-600" />
                                Observaciones Adicionales
                            </h3>
                            <textarea
                                name="observaciones"
                                value={formData.observaciones}
                                onChange={handleChange}
                                rows="3"
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm resize-none"
                                placeholder="..."
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
                        >
                            <FaSave />
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AplicacionesModal;
