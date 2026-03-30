"use client";
import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaTimes, FaSave, FaChevronLeft, FaChevronRight, FaBriefcase, FaLayerGroup } from 'react-icons/fa';
import api from '@/api/apiConfig';
import { toast } from 'react-hot-toast';

const MaestroManager = ({ endpoint, title, idField, fields, isMale, singularTitle, renderModalHint }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [editingItem, setEditingItem] = useState(null);
    const [detailItem, setDetailItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [formData, setFormData] = useState({});

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchData();
        setCurrentPage(1);
    }, [endpoint]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await api.get(endpoint);
            setData(response.data);
        } catch (error) {
            console.error(`Error fetching ${title}:`, error);
            toast.error(`Error al cargar ${title.toLowerCase()}`);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (item = null) => {
        if (item) {
            setEditingItem(item);
            const initialData = {};
            fields.forEach(f => {
                if (f.plural) {
                    const pluralKey = f.pluralKey || (f.name.startsWith('id_') ? f.name.replace('id_', '') + 's' : f.name + 's');
                    const actualPluralKey = (f.name === 'id_seccion' && !f.pluralKey) ? 'secciones' : pluralKey;
                    
                    if (item[actualPluralKey]) {
                        initialData[f.name] = item[actualPluralKey].map(obj => obj[f.idField || f.name] || obj.id);
                    }
                } else {
                    initialData[f.name] = item[f.name];
                }
            });
            setFormData(initialData);
        } else {
            setEditingItem(null);
            setFormData({});
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
        setFormData({});
    };

    const handleOpenDetail = (item) => {
        setDetailItem(item);
    };

    const handleCloseDetail = () => {
        setDetailItem(null);
    };

    const handleChange = (e) => {
        const { name, value, type, multiple } = e.target;
        if (multiple) {
            const values = Array.from(e.target.selectedOptions, option => option.value);
            setFormData(prev => ({ ...prev, [name]: values }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        for (const field of fields) {
            if (field.required && !formData[field.name]) {
                toast.error(`${field.label} es obligatorio`);
                return;
            }
        }

        try {
            if (editingItem) {
                await api.put(`${endpoint}/${editingItem[idField]}`, formData);
                toast.success(`${singularTitle || title} ${isMale ? 'actualizado' : 'actualizada'} correctamente`);
            } else {
                await api.post(endpoint, formData);
                toast.success(`${singularTitle || title} ${isMale ? 'creado' : 'creada'} correctamente`);
            }
            handleCloseModal();
            fetchData();
        } catch (error) {
            console.error(`Error saving ${title}:`, error);
            // Display specific error message from the backend if available
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error(`Error al guardar ${title.toLowerCase()}`);
            }
        }
    };

    const confirmDelete = (id) => {
        setItemToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!itemToDelete) return;

        try {
            await api.delete(`${endpoint}/${itemToDelete}`);
            toast.success(`${singularTitle || title} ${isMale ? 'eliminado' : 'eliminada'} correctamente`);
            setIsDeleteModalOpen(false);
            setItemToDelete(null);
            fetchData();
        } catch (error) {
            console.error(`Error deleting ${title}:`, error);
            toast.error(`Error al eliminar ${title.toLowerCase()}. Es posible que esté siendo usado por otros registros.`);
            setIsDeleteModalOpen(false);
            setItemToDelete(null);
        }
    };

    const normalizeString = (str) => {
        if (!str) return "";
        return String(str)
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();
    };

    const searchNormalized = normalizeString(searchTerm);

    const filteredData = data.filter(item => {
        return fields.some(field => {
            const val = item[field.name];
            
            // Handle associated arrays (like secciones)
            if (field.plural) {
                const pluralKey = field.pluralKey || (field.name.startsWith('id_') ? field.name.replace('id_', '') + 's' : field.name + 's');
                const actualPluralKey = (field.name === 'id_seccion' && !field.pluralKey) ? 'secciones' : pluralKey;
                const items = item[actualPluralKey] || [];
                return items.some(subItem => {
                    const subVal = subItem.nombre_seccion || subItem.nombre_categoria || subItem.label || subItem.nombre || "";
                    return normalizeString(subVal).includes(searchNormalized);
                });
            }
            
            // Handle simple fields
            return normalizeString(val).includes(searchNormalized);
        });
    });

    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    if (loading && data.length === 0) {
        return (
            <div className="flex justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
            {/* Header Area */}
            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 flex-shrink-0">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                    <p className="text-sm text-gray-500">Administración de valores para el sistema</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-none">
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all w-full md:w-64"
                        />
                        <FaSearch className="absolute left-3 top-3 text-gray-400" size={14} />
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all text-sm font-medium shadow-sm hover:shadow-md"
                    >
                        <FaPlus size={12} /> Nuevo
                    </button>
                </div>
            </div>

            {/* Table Area */}
            <div className="overflow-x-auto flex-grow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {fields.map(field => (
                                <th key={field.name} className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    {field.label}
                                </th>
                            ))}
                            <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentItems.length > 0 ? (
                            currentItems.map((item) => (
                                <tr 
                                    key={item[idField]} 
                                    onClick={() => handleOpenDetail(item)}
                                    className="hover:bg-blue-50/50 transition-colors cursor-pointer group"
                                >
                                    {fields.map((field, idx) => {
                                        let cellContent;
                                        if (field.type === 'select' && field.options) {
                                            if (field.plural) {
                                                const pluralKey = field.pluralKey || (field.name.startsWith('id_') ? field.name.replace('id_', '') + 's' : field.name + 's');
                                                const actualPluralKey = (field.name === 'id_seccion' && !field.pluralKey) ? 'secciones' : pluralKey;
                                                const values = item[actualPluralKey] || [];
                                                
                                                if (values.length > 0) {
                                                    const maxVisible = 2;
                                                    cellContent = (
                                                        <div className="flex flex-wrap gap-1 max-w-xs">
                                                            {values.slice(0, maxVisible).map((v, idx) => (
                                                                <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100 uppercase">
                                                                    {v.nombre_seccion || v.nombre_categoria || v.label || v.nombre}
                                                                </span>
                                                            ))}
                                                            {values.length > maxVisible && (
                                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-gray-50 text-gray-500 border border-gray-100 uppercase" title={values.slice(maxVisible).map(v => v.nombre_seccion || v.nombre_categoria || v.label || v.nombre).join(', ')}>
                                                                    +{values.length - maxVisible}
                                                                </span>
                                                            )}
                                                        </div>
                                                    );
                                                } else {
                                                    cellContent = <span className="text-gray-400 italic">Sin asignar</span>;
                                                }
                                            } else {
                                                const option = field.options.find(opt => String(opt.id) === String(item[field.name]));
                                                cellContent = option ? option.label : <span className="text-gray-400 italic">-</span>;
                                            }
                                        } else if (field.type === 'date' && item[field.name]) {
                                            cellContent = new Date(item[field.name]).toLocaleDateString('es-CL', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
                                        } else {
                                            cellContent = item[field.name] || <span className="text-gray-400 italic">-</span>;
                                        }

                                        const isFirstField = idx === 0;

                                        return (
                                            <td 
                                                key={field.name} 
                                                className={`px-6 py-4 text-sm text-gray-700 ${isFirstField ? 'group-hover:text-blue-600 transition-colors font-medium' : ''}`}
                                            >
                                                {cellContent}
                                            </td>
                                        );
                                    })}
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleOpenModal(item);
                                                }}
                                                className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 p-2 rounded-lg transition-colors"
                                                title="Editar"
                                            >
                                                <FaEdit size={14} />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    confirmDelete(item[idField]);
                                                }}
                                                className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-lg transition-colors"
                                                title="Eliminar"
                                            >
                                                <FaTrash size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={fields.length + 1} className="px-6 py-12 text-center text-gray-500 bg-gray-50/50">
                                    No se encontraron registros de {title.toLowerCase()}.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-white flex-shrink-0">
                    <div className="text-sm text-gray-500">
                        Mostrando <span className="font-medium">{indexOfFirstItem + 1}</span> a <span className="font-medium">{Math.min(indexOfLastItem, totalItems)}</span> de <span className="font-medium">{totalItems}</span> resultados
                    </div>
                    <div className="flex gap-1">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`p-2 rounded-lg border transition-all ${
                                currentPage === 1 
                                ? 'bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed' 
                                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50 hover:text-blue-600'
                            }`}
                        >
                            <FaChevronLeft size={12} />
                        </button>
                        
                        <div className="flex gap-1 overflow-x-auto max-w-[120px] md:max-w-none no-scrollbar">
                            {[...Array(totalPages)].map((_, i) => {
                                const pageNum = i + 1;
                                if (
                                    pageNum === 1 || 
                                    pageNum === totalPages || 
                                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                                ) {
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => handlePageChange(pageNum)}
                                            className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                                                currentPage === pageNum 
                                                ? 'bg-blue-600 text-white shadow-md' 
                                                : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                } else if (
                                    pageNum === currentPage - 2 || 
                                    pageNum === currentPage + 2
                                ) {
                                    return <span key={pageNum} className="text-gray-400">...</span>;
                                }
                                return null;
                            })}
                        </div>

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`p-2 rounded-lg border transition-all ${
                                currentPage === totalPages 
                                ? 'bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed' 
                                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50 hover:text-blue-600'
                            }`}
                        >
                            <FaChevronRight size={12} />
                        </button>
                    </div>
                </div>
            )}

            {/* Modal Area (Create/Edit) */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-fadeIn overflow-hidden border border-gray-100">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900">
                                {editingItem ? `Editar ${title}` : `Nueva ${title}`}
                            </h3>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <FaTimes size={18} />
                            </button>
                        </div>
                        {renderModalHint && renderModalHint(data, editingItem)}
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {fields.filter(f => !f.hiddenInForm).map(field => (
                                <div key={field.name}>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                                        {field.label}
                                        {field.required && <span className="text-red-500 ml-1">*</span>}
                                    </label>
                                    {field.type === 'select' ? (
                                        <select
                                            name={field.name}
                                            value={formData[field.name] || (field.plural ? [] : "")}
                                            onChange={handleChange}
                                            multiple={field.plural}
                                            className={`w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all ${field.plural ? 'h-32' : ''}`}
                                        >
                                            {!field.plural && <option value="">Seleccionar...</option>}
                                            {field.options.map(opt => (
                                                <option key={opt.id} value={opt.id}>{opt.label}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            type={field.type || "text"}
                                            name={field.name}
                                            value={formData[field.name] || ""}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium"
                                            placeholder={`Ingrese ${field.label.toLowerCase()}...`}
                                        />
                                    )}
                                </div>
                            ))}
                            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-medium shadow-md"
                                >
                                    <FaSave size={14} /> Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm animate-fadeIn overflow-hidden border border-gray-100">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaTrash size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">¿Estás seguro?</h3>
                            <p className="text-gray-500 text-sm mb-6">
                                Esta acción eliminará permanentemente el registro de <strong>{title}</strong>. 
                                Esta acción no se puede deshacer.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setIsDeleteModalOpen(false);
                                        setItemToDelete(null);
                                    }}
                                    className="flex-1 px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-all text-sm font-medium"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-sm font-medium shadow-md"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            {detailItem && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl animate-fadeIn overflow-hidden border border-gray-100">
                        <div className="relative h-32 bg-gradient-to-r from-blue-600 to-indigo-700 p-6 flex items-end">
                            <button 
                                onClick={handleCloseDetail} 
                                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                            >
                                <FaTimes size={20} />
                            </button>
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white border border-white/30 shadow-inner">
                                    <FaLayerGroup size={32} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white leading-tight">
                                        {detailItem[fields[0].name]}
                                    </h3>
                                    <p className="text-blue-100 text-sm font-medium">Detalles del Registro</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 space-y-8">
                            {fields.map(field => {
                                if (field.name === fields[0].name) return null;

                                const pluralKey = field.pluralKey || (field.name.startsWith('id_') ? field.name.replace('id_', '') + 's' : field.name + 's');
                                const actualPluralKey = (field.name === 'id_seccion' && !field.pluralKey) ? 'secciones' : pluralKey;
                                const isPlural = field.plural;
                                const values = isPlural ? (detailItem[actualPluralKey] || []) : null;

                                return (
                                    <div key={field.name} className="space-y-3">
                                        <div className="flex items-center gap-2 text-gray-400">
                                            <span className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                                                {field.label}
                                                {isPlural && values.length > 0 && (
                                                    <span className="bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full text-[9px]">
                                                        {values.length}
                                                    </span>
                                                )}
                                            </span>
                                            <div className="h-px flex-1 bg-gray-100"></div>
                                        </div>
                                        
                                        {isPlural ? (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                                {values.length > 0 ? values.map((v, idx) => (
                                                    <div 
                                                        key={idx} 
                                                        className="flex items-center gap-2 px-3 py-2 bg-blue-50/50 border border-blue-100 rounded-lg group hover:bg-blue-50 transition-colors"
                                                    >
                                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                                                        <span className="text-sm font-semibold text-blue-800">
                                                            {v.nombre_seccion || v.nombre_categoria || v.label || v.nombre}
                                                        </span>
                                                    </div>
                                                )) : (
                                                    <div className="col-span-2 py-4 text-center bg-gray-50 border border-dashed border-gray-200 rounded-xl text-gray-400 text-sm italic">
                                                        Sin unidades asociadas
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="px-4 py-3 bg-gray-50 rounded-xl border border-gray-100">
                                                <span className="text-gray-900 font-semibold">
                                                    {field.type === 'select' 
                                                        ? (field.options.find(opt => String(opt.id) === String(detailItem[field.name]))?.label || '-')
                                                        : (detailItem[field.name] || '-')
                                                    }
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="px-8 pb-8 pt-2">
                            <button
                                onClick={handleCloseDetail}
                                className="w-full py-3 bg-gray-900 hover:bg-black text-white rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-black/20"
                            >
                                Entendido
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MaestroManager;
