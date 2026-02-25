"use client";
import React, { useState, useEffect } from 'react';
import { FaTimes, FaSave, FaNetworkWired } from 'react-icons/fa';

const ClavesWifiModal = ({ isOpen, onClose, onSave, editingItem }) => {
    const initialState = {
        sede: '',
        nombre: '',
        password_wifi: '',
        ip: '',
        usuario_admin: '',
        password_admin: ''
    };

    const [formData, setFormData] = useState(initialState);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (editingItem) {
            setFormData({
                sede: editingItem.sede || '',
                nombre: editingItem.nombre || '',
                password_wifi: editingItem.password_wifi || '',
                ip: editingItem.ip || '',
                usuario_admin: editingItem.usuario_admin || '',
                password_admin: editingItem.password_admin || ''
            });
        } else {
            setFormData(initialState);
        }
    }, [editingItem, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        await onSave(formData);
        setSubmitting(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl m-auto flex flex-col max-h-[90vh] overflow-hidden border border-gray-100">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                            <FaNetworkWired size={20} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">
                            {editingItem ? 'Editar Acceso Técnico' : 'Nuevo Acceso Técnico'}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-all"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Form Body */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-200">
                    <form id="clavesForm" onSubmit={handleSubmit} className="space-y-6">

                        {/* Identificación */}
                        <div>
                            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b">Identificación</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Equipo/Red *</label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        required
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                                        placeholder="Ej. AP Gerencia"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Sede</label>
                                    <input
                                        type="text"
                                        name="sede"
                                        value={formData.sede}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Red y Contraseña */}
                        <div>
                            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b">Red y Contraseñas</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">IP Asignada</label>
                                    <input
                                        type="text"
                                        name="ip"
                                        value={formData.ip}
                                        onChange={handleChange}
                                        className="w-full font-mono px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Ej. 192.168.1.10"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña WiFi</label>
                                    <input
                                        type="text"
                                        name="password_wifi"
                                        value={formData.password_wifi}
                                        onChange={handleChange}
                                        className="w-full font-mono px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Credenciales Admin */}
                        <div>
                            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b text-red-600">Credenciales Administrativas</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-red-50 rounded-lg">
                                <div>
                                    <label className="block text-sm font-medium text-red-700 mb-1">Usuario Admin</label>
                                    <input
                                        type="text"
                                        name="usuario_admin"
                                        value={formData.usuario_admin}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-red-700 mb-1">Contraseña Admin</label>
                                    <input
                                        type="text"
                                        name="password_admin"
                                        value={formData.password_admin}
                                        onChange={handleChange}
                                        className="w-full font-mono px-4 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                    />
                                </div>
                            </div>
                        </div>

                    </form>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors"
                        disabled={submitting}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        form="clavesForm"
                        disabled={submitting}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        {submitting ? (
                            <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
                        ) : (
                            <FaSave />
                        )}
                        <span>Guardar</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ClavesWifiModal;
