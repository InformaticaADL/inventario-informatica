"use client";
import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaLayerGroup, FaSearch, FaCheck, FaTimes } from 'react-icons/fa';
import api from '@/api/apiConfig';
import { toast } from 'react-hot-toast';
import Select from 'react-select';

const InventarioSoftware = ({ id_inventario, unidad }) => {
    const [associatedProgramas, setAssociatedProgramas] = useState([]);
    const [allProgramas, setAllProgramas] = useState([]);
    const [secciones, setSecciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [programasPorCategoria, setProgramasPorCategoria] = useState({});

    useEffect(() => {
        if (id_inventario) {
            fetchData();
            fetchProgramas(); // Fetch programs with categories
        }
    }, [id_inventario]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [assocRes, catRes] = await Promise.all([
                api.get(`/inventario-programas/${id_inventario}`),
                api.get("/seccion")
            ]);
            setAssociatedProgramas(assocRes.data);
            setSecciones(catRes.data);
        } catch (error) {
            console.error("Error fetching software data:", error);
            toast.error("Error al cargar datos de software");
        } finally {
            setLoading(false);
        }
    };

    const fetchProgramas = async () => {
        try {
            const response = await api.get("/programa");
            // Group programs by section
            const grouped = {};
            response.data.forEach(prog => {
                const sections = prog.secciones || [];
                sections.forEach(sec => {
                    if (!grouped[sec.nombre_seccion]) {
                        grouped[sec.nombre_seccion] = [];
                    }
                    grouped[sec.nombre_seccion].push(prog);
                });
                if (sections.length === 0) {
                    if (!grouped['Sin Sección']) grouped['Sin Sección'] = [];
                    grouped['Sin Sección'].push(prog);
                }
            });
            setProgramasPorCategoria(grouped);
            setAllProgramas(response.data);
        } catch (error) {
            console.error("Error fetching programas:", error);
            toast.error("Error al cargar lista de programas");
        }
    };

    const handleAssociate = async (id_programa) => {
        try {
            await api.post("/inventario-programas/asociar", {
                id_inventario,
                id_programas: [id_programa]
            });
            toast.success("Programa añadido");
            fetchData();
        } catch (error) {
            toast.error("Error al añadir programa");
        }
    };

    const handleDissociate = async (id_programa) => {
        try {
            await api.delete(`/inventario-programas/${id_inventario}/${id_programa}`);
            toast.success("Programa eliminado");
            fetchData();
        } catch (error) {
            toast.error("Error al eliminar programa");
        }
    };

    const handleAssociateByCategory = async () => {
        if (!selectedCategory) return;
        try {
            await api.post("/inventario-programas/asociar-seccion", {
                id_inventario,
                id_seccion: selectedCategory
            });
            toast.success("Sección añadida correctamente");
            setSelectedCategory("");
            fetchData();
        } catch (error) {
            toast.error("Error al añadir programas de la categoría");
        }
    };

    const availableProgramas = allProgramas.filter(p =>
        !associatedProgramas.some(ap => ap.id_programa === p.id_programa) &&
        (p.nombre_programa.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.secciones || []).some(s => s.nombre_seccion.toLowerCase().includes(searchTerm.toLowerCase())))
    );

    if (loading) return <div className="p-4 text-center text-gray-500">Cargando software...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                <div className="flex-1 w-full relative">
                    <input
                        type="text"
                        placeholder="Buscar programa para añadir..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <FaSearch className="absolute left-3 top-3 text-gray-400" size={14} />

                    {searchTerm && availableProgramas.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                            {availableProgramas.map(p => (
                                <button
                                    key={p.id_programa}
                                    onClick={() => { handleAssociate(p.id_programa); setSearchTerm(""); }}
                                    className="w-full text-left px-4 py-2 hover:bg-blue-50 flex justify-between items-center text-sm border-b border-gray-50 last:border-0"
                                >
                                    <span>{p.nombre_programa}</span>
                                    <div className="flex flex-wrap gap-1 justify-end max-w-[50%]">
                                        {(p.secciones && p.secciones.length > 0) ? p.secciones.map(s => (
                                            <span key={s.id_seccion} className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100 uppercase font-bold">
                                                {s.nombre_seccion}
                                            </span>
                                        )) : (
                                            <span className="text-xs text-gray-400 italic">Sin sección</span>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex-1 w-full md:max-w-xs">
                    <Select
                        placeholder="Seleccionar programa..."
                        options={allProgramas
                            .filter(p => !associatedProgramas.some(ap => ap.id_programa === p.id_programa))
                            .map(p => ({
                                value: p.id_programa,
                                label: p.nombre_programa,
                                secciones: p.secciones
                            }))}
                        onChange={(selected) => selected && handleAssociate(selected.value)}
                        isSearchable
                        isClearable
                        className="text-sm"
                        noOptionsMessage={() => "No hay más programas disponibles"}
                        styles={{
                            control: (base) => ({
                                ...base,
                                borderRadius: '0.5rem',
                                borderColor: '#e5e7eb',
                                padding: '1px',
                                boxShadow: 'none',
                                '&:hover': {
                                    borderColor: '#3b82f6'
                                }
                            }),
                            option: (base, state) => ({
                                ...base,
                                backgroundColor: state.isFocused ? '#eff6ff' : 'white',
                                color: state.isFocused ? '#1e40af' : '#374151',
                                cursor: 'pointer',
                                fontSize: '0.875rem'
                            })
                        }}
                        formatOptionLabel={(option) => (
                            <div className="flex justify-between items-center">
                                <span>{option.label}</span>
                                <div className="flex flex-wrap gap-1">
                                    {option.secciones && option.secciones.length > 0 ? (
                                        option.secciones.map(s => (
                                            <span key={s.id_seccion} className="text-[9px] bg-blue-50 text-blue-600 px-1 border border-blue-100 rounded uppercase font-bold">
                                                {s.nombre_seccion}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-[9px] text-gray-400 italic">Sin sección</span>
                                    )}
                                </div>
                            </div>
                        )}
                    />
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="flex-1 md:w-48 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="">Añadir por sección...</option>
                        {secciones.map(s => (
                            <option key={s.id_seccion} value={s.id_seccion}>{s.nombre_seccion}</option>
                        ))}
                    </select>
                    <button
                        onClick={handleAssociateByCategory}
                        disabled={!selectedCategory}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-2 rounded-lg transition-all shadow-sm"
                        title="Añadir toda la sección"
                    >
                        <FaLayerGroup size={16} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {associatedProgramas.length > 0 ? (
                    associatedProgramas.map(p => (
                        <div key={p.id_programa} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                            <div className="flex flex-col gap-1 overflow-hidden">
                                <span className="text-sm font-semibold text-gray-800 truncate">{p.nombre_programa}</span>
                                <div className="flex flex-wrap gap-1">
                                    {(() => {
                                        const filteredSecs = (p.secciones || []).filter(s => 
                                            s.nombre_seccion.toLowerCase() === (unidad || "").toLowerCase()
                                        );
                                        
                                        if (filteredSecs.length > 0) {
                                            return filteredSecs.map(s => (
                                                <span key={s.id_seccion} className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100 uppercase font-bold">
                                                    {s.nombre_seccion}
                                                </span>
                                            ));
                                        } else if (p.secciones && p.secciones.length > 0) {
                                            // Fallback if no match but has sections (should not happen with auto-assoc)
                                            return <span className="text-[9px] bg-gray-50 text-gray-500 px-1.5 py-0.5 rounded border border-gray-100 uppercase font-bold text-opacity-50">Otros</span>;
                                        } else {
                                            return <span className="text-[9px] bg-gray-50 text-gray-500 px-1.5 py-0.5 rounded border border-gray-100 uppercase font-bold text-opacity-50">General</span>;
                                        }
                                    })()}
                                </div>
                            </div>
                            <button
                                onClick={() => handleDissociate(p.id_programa)}
                                className="text-gray-300 hover:text-red-500 p-1.5 rounded transition-all opacity-0 group-hover:opacity-100 bg-red-50"
                                title="Eliminar"
                            >
                                <FaTrash size={12} />
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-8 text-center bg-gray-50 border border-dashed border-gray-200 rounded-xl text-gray-400 text-sm">
                        No hay programas asociados a este equipo.
                    </div>
                )}
            </div>
        </div>
    );
};

export default InventarioSoftware;
