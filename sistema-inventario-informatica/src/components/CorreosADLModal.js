"use client";
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FaTimes, FaSave, FaBuilding, FaUser, FaEnvelope, FaKey, FaListUl, FaCheckCircle, FaCommentAlt } from 'react-icons/fa';

const CorreosADLModal = ({ isOpen, onClose, onSave, editingItem }) => {
    const [formData, setFormData] = useState({
        sede: '',
        area: '',
        unidad: '',
        nombre: '',
        password: '',
        email: '',
        empresa: '',
        habilitado: '',
        observaciones: ''
    });

    useEffect(() => {
        if (editingItem) {
            setFormData(editingItem);
        } else {
            setFormData({
                sede: '',
                area: '',
                unidad: '',
                nombre: '',
                password: '',
                email: '',
                empresa: '',
                habilitado: '',
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
            toast.error('El nombre es requerido');
            return false;
        }
        if (!formData.email?.trim()) {
            toast.error('El email es requerido');
            return false;
        }

        // Split emails by / or , and validate each one
        const emails = formData.email.split(/[\/,]+/).map(e => e.trim()).filter(Boolean);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const invalidEmails = emails.filter(email => !emailRegex.test(email));

        if (invalidEmails.length > 0) {
            toast.error(`Los siguientes correos no son válidos: ${invalidEmails.join(', ')}`);
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
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">
                        {editingItem ? 'Editar Correo' : 'Nuevo Correo'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6" noValidate>
                    <div className="space-y-6">
                        {/* Información Personal */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
                                <FaUser className="text-blue-600" />
                                Información General
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-700">Nombre</label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                        placeholder="Nombre completo"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <EmailTagsInput
                                        label="Email"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-700">Password</label>
                                    <div className="relative">
                                        <FaKey className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                                        <input
                                            type="text"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                            placeholder="Contraseña"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-700">Habilitado</label>
                                    <select
                                        name="habilitado"
                                        value={formData.habilitado}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                    >
                                        <option value="">Seleccionar</option>
                                        <option value="S">Si</option>
                                        <option value="N">No</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Organización */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
                                <FaBuilding className="text-blue-600" />
                                Organización
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-700">Empresa</label>
                                    <input
                                        type="text"
                                        name="empresa"
                                        value={formData.empresa}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-700">Sede</label>
                                    <input
                                        type="text"
                                        name="sede"
                                        value={formData.sede}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-700">Área</label>
                                    <input
                                        type="text"
                                        name="area"
                                        value={formData.area}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-700">Unidad</label>
                                    <input
                                        type="text"
                                        name="unidad"
                                        value={formData.unidad}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Observaciones */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
                                <FaCommentAlt className="text-blue-600" />
                                Observaciones
                            </h3>
                            <textarea
                                name="observaciones"
                                value={formData.observaciones}
                                onChange={handleChange}
                                rows="3"
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm resize-none"
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
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
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

export default CorreosADLModal;

const EmailTagsInput = ({ label, value, onChange }) => {
    const [inputValue, setInputValue] = useState("");
    const [error, setError] = useState(null);

    // Initial emails from value string (split by / or ,)
    const emails = value ? value.split(/[\/,]+/).map(e => e.trim()).filter(Boolean) : [];

    const handleKeyDown = (e) => {
        if (['Enter', 'Tab', ','].includes(e.key)) {
            e.preventDefault();
            addEmail();
        }
    };

    const addEmail = () => {
        const email = inputValue.trim();
        if (!email) return;

        // Simple email regex validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Correo inválido");
            return;
        }

        if (emails.includes(email)) {
            setInputValue("");
            return;
        }

        const newEmails = [...emails, email];
        onChange({ target: { name: 'email', value: newEmails.join(' / ') } });
        setInputValue("");
        setError(null);
    };

    const removeEmail = (emailToRemove) => {
        const newEmails = emails.filter(email => email !== emailToRemove);
        onChange({ target: { name: 'email', value: newEmails.join(' / ') } });
    };

    return (
        <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">{label}</label>
            <div className="w-full bg-gray-50 border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all p-2 min-h-[42px]">
                <div className="flex flex-wrap gap-2">
                    {emails.map((email, idx) => (
                        <div key={idx} className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium border border-blue-200">
                            <span className="break-all">{email}</span>
                            <button
                                type="button"
                                onClick={() => removeEmail(email)}
                                className="text-blue-400 hover:text-blue-900 focus:outline-none"
                            >
                                <FaTimes size={10} />
                            </button>
                        </div>
                    ))}
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => { setInputValue(e.target.value); setError(null); }}
                        onKeyDown={handleKeyDown}
                        onBlur={addEmail}
                        placeholder={emails.length === 0 ? "ingrese.correo@ejemplo.com" : ""}
                        className="flex-1 bg-transparent outline-none text-sm text-gray-700 min-w-[150px]"
                    />
                </div>
            </div>
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
};
