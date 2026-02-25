"use client";
import React, { useState, useEffect } from 'react';
import { FaTimes, FaSave, FaBriefcase } from 'react-icons/fa';

const CasuisticaModal = ({ isOpen, onClose, onSave, editingItem }) => {
    const initialState = {
        empresa: '',
        nombre: '',
        pass: '',
        correo: ''
    };

    const [formData, setFormData] = useState(initialState);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (editingItem) {
            setFormData({
                empresa: editingItem.empresa || '',
                nombre: editingItem.nombre || '',
                pass: editingItem.pass || '',
                correo: editingItem.correo || ''
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
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg m-auto flex flex-col max-h-[90vh] overflow-hidden border border-gray-100">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                            <FaBriefcase size={18} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">
                            {editingItem ? 'Editar Cliente de Casuística' : 'Nuevo Cliente de Casuística'}
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
                    <form id="casuisticaForm" onSubmit={handleSubmit} className="space-y-5">

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Empresa / Cliente *</label>
                            <input
                                type="text"
                                name="empresa"
                                required
                                value={formData.empresa}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                                placeholder="Ej. Empresa ABC"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Contacto</label>
                            <input
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                                placeholder="Ej. Juan Pérez"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Correos Electrónicos *</label>
                            <textarea
                                name="correo"
                                required
                                value={formData.correo}
                                onChange={handleChange}
                                rows="3"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow font-mono text-sm"
                                placeholder="usuario1@empresa.com, usuario2@empresa.com"
                            />
                            <p className="text-xs text-gray-500 mt-1">Separa múltiples correos con comas o saltos de línea.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña (PASS)</label>
                            <input
                                type="text"
                                name="pass"
                                value={formData.pass}
                                onChange={handleChange}
                                className="w-full font-mono px-4 py-2 border border-yellow-300 bg-yellow-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-yellow-900"
                                placeholder="Contraseña asignada"
                            />
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
                        form="casuisticaForm"
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

export default CasuisticaModal;
