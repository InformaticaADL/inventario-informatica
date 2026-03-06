"use client";
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FaTimes, FaSave, FaDesktop, FaBuilding, FaUser, FaInfoCircle, FaCalendarAlt } from 'react-icons/fa';

const MantencionModal = ({ isOpen, onClose, onSave, initialData }) => {
    // We start with empty values for a new record. 
    // If we wanted to search for an existing equipment, we'd add an autocomplete or search field here.
    const [formData, setFormData] = useState({
        estado: 'Realizada',
        sede: '',
        area: '',
        seccion: '',
        fecha_mantencion: '',
        nombre_usuario: '',
        nombre_equipo: '',
        tipo_equipo: '',
        codigo_interno: '',
        ip: '',
        realizada_por: '',
        recepcion_nombre: '',
        recepcion_fecha: '',
        detalle_mantencion: ''
    });

    useEffect(() => {
        if (isOpen && initialData) {
            setFormData(initialData);
        } else if (!isOpen) {
            setFormData({
                estado: 'Realizada',
                sede: '',
                area: '',
                seccion: '',
                fecha_mantencion: '',
                nombre_usuario: '',
                nombre_equipo: '',
                tipo_equipo: '',
                codigo_interno: '',
                ip: '',
                realizada_por: '',
                recepcion_nombre: '',
                recepcion_fecha: '',
                detalle_mantencion: ''
            });
        }
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (!formData.nombre_equipo?.trim()) {
            toast.error('El nombre del equipo es requerido');
            return false;
        }
        if (!formData.fecha_mantencion?.trim()) {
            toast.error('La fecha de mantención es requerida');
            return false;
        }

        // Basic DD-MM-YYYY validation
        const dateRegex = /^(0[1-9]|[12][0-9]|3[01])[-/](0[1-9]|1[012])[-/]\d{4}$/;
        if (!dateRegex.test(formData.fecha_mantencion)) {
            toast.error('El formato de la fecha de mantención debe ser DD-MM-YYYY');
            return false;
        }

        if (formData.recepcion_fecha && !dateRegex.test(formData.recepcion_fecha)) {
            toast.error('El formato de la fecha de recepción debe ser DD-MM-YYYY');
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
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">
                        Nueva Mantención
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

                        {/* Detalles de la Mantención */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
                                <FaCalendarAlt className="text-blue-600" />
                                Detalles de la Mantención
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="space-y-1 lg:col-span-2">
                                    <label className="text-xs font-medium text-gray-700">Fecha Mantención (DD-MM-YYYY) <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="fecha_mantencion"
                                        value={formData.fecha_mantencion}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                        placeholder="Ej: 05-03-2026"
                                    />
                                </div>
                                <div className="space-y-1 lg:col-span-2">
                                    <label className="text-xs font-medium text-gray-700">Estado de Mantención</label>
                                    <select
                                        name="estado"
                                        value={formData.estado}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                    >
                                        <option value="">Seleccionar</option>
                                        <option value="Realizada">Realizada</option>
                                        <option value="Pendiente">Pendiente</option>
                                    </select>
                                </div>
                                <div className="space-y-1 lg:col-span-2">
                                    <label className="text-xs font-medium text-gray-700">Realizada Por</label>
                                    <input
                                        type="text"
                                        name="realizada_por"
                                        value={formData.realizada_por}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                        placeholder="Nombre del técnico"
                                    />
                                </div>
                                <div className="space-y-1 lg:col-span-4">
                                    <label className="text-xs font-medium text-gray-700">Detalle de Mantención</label>
                                    <textarea
                                        name="detalle_mantencion"
                                        value={formData.detalle_mantencion}
                                        onChange={handleChange}
                                        rows="3"
                                        placeholder="Describa el trabajo realizado..."
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Información del Equipo */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
                                <FaDesktop className="text-blue-600" />
                                Información del Equipo
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="space-y-1 lg:col-span-2">
                                    <label className="text-xs font-medium text-gray-700">Nombre del Equipo <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="nombre_equipo"
                                        value={formData.nombre_equipo}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                        placeholder="Ej: PC-LAB-01"
                                    />
                                </div>
                                <div className="space-y-1 lg:col-span-2">
                                    <label className="text-xs font-medium text-gray-700">Tipo de Equipo</label>
                                    <input
                                        type="text"
                                        name="tipo_equipo"
                                        value={formData.tipo_equipo}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                        placeholder="Ej: Desktop"
                                    />
                                </div>
                                <div className="space-y-1 lg:col-span-2">
                                    <label className="text-xs font-medium text-gray-700">Código Interno</label>
                                    <input
                                        type="text"
                                        name="codigo_interno"
                                        value={formData.codigo_interno}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                    />
                                </div>
                                <div className="space-y-1 lg:col-span-2">
                                    <label className="text-xs font-medium text-gray-700">Dirección IP</label>
                                    <input
                                        type="text"
                                        name="ip"
                                        value={formData.ip}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                        placeholder="Ej: 192.168.1.10"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Organización & Usuario */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
                                <FaBuilding className="text-blue-600" />
                                Organización & Usuario
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="space-y-1 lg:col-span-2">
                                    <label className="text-xs font-medium text-gray-700">Usuario / Responsable</label>
                                    <input
                                        type="text"
                                        name="nombre_usuario"
                                        value={formData.nombre_usuario}
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
                                <div className="space-y-1 lg:col-span-2">
                                    <label className="text-xs font-medium text-gray-700">Sección</label>
                                    <input
                                        type="text"
                                        name="seccion"
                                        value={formData.seccion}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Recepción */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
                                <FaUser className="text-blue-600" />
                                Recepción
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-700">Nombre Recepción</label>
                                    <input
                                        type="text"
                                        name="recepcion_nombre"
                                        value={formData.recepcion_nombre}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                        placeholder="Nombre de quien recibe el equipo"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-700">Fecha Recepción (DD-MM-YYYY)</label>
                                    <input
                                        type="text"
                                        name="recepcion_fecha"
                                        value={formData.recepcion_fecha}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                        placeholder="Ej: 05-03-2026"
                                    />
                                </div>
                            </div>
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

export default MantencionModal;
