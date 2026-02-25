"use client";
import React, { useState, useMemo } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
} from '@tanstack/react-table';
import { FaEdit, FaTrash, FaSearch, FaFileExcel, FaPlus, FaArrowUp, FaArrowDown, FaEye, FaEyeSlash } from 'react-icons/fa';
import * as XLSX from 'xlsx';

const ClavesWifiTable = ({ data, onEdit, onDelete, onAdd }) => {
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState([]);
    const [sedeFilter, setSedeFilter] = useState('ALL');
    const [visiblePasswords, setVisiblePasswords] = useState({});

    const togglePasswordVisibility = (id_clave, field) => {
        setVisiblePasswords(prev => ({
            ...prev,
            [`${id_clave}-${field}`]: !prev[`${id_clave}-${field}`]
        }));
    };

    const uniqueSedes = useMemo(() => {
        const sedes = data.map(item => item.sede).filter(Boolean);
        return [...new Set(sedes)].sort();
    }, [data]);

    const filteredData = useMemo(() => {
        return data.filter(item => {
            if (sedeFilter === 'ALL') return true;
            return item.sede === sedeFilter;
        });
    }, [data, sedeFilter]);

    const columns = useMemo(() => [
        {
            accessorKey: 'sede',
            header: 'Sede',
        },
        {
            accessorKey: 'nombre',
            header: 'Nombre (Equipo/Red)',
        },
        {
            accessorKey: 'ip',
            header: 'IP',
            cell: ({ getValue }) => {
                const val = getValue();
                return <span className="font-mono text-gray-600">{val || '-'}</span>;
            }
        },
        {
            accessorKey: 'password_wifi',
            header: 'Contraseña WiFi',
            cell: ({ row, getValue }) => {
                const val = getValue();
                if (!val) return '-';
                const isVisible = visiblePasswords[`${row.original.id_clave}-wifi`];
                return (
                    <div className="flex items-center gap-2">
                        <span className="font-mono bg-gray-50 px-2 py-1 rounded text-gray-700 min-w-[80px]">
                            {isVisible ? val : '••••••••'}
                        </span>
                        <button
                            onClick={(e) => { e.stopPropagation(); togglePasswordVisibility(row.original.id_clave, 'wifi') }}
                            className="text-gray-400 hover:text-blue-500 transition-colors"
                        >
                            {isVisible ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                );
            }
        },
        {
            accessorKey: 'usuario_admin',
            header: 'Usuario Admin',
        },
        {
            accessorKey: 'password_admin',
            header: 'Password Admin',
            cell: ({ row, getValue }) => {
                const val = getValue();
                if (!val) return '-';
                const isVisible = visiblePasswords[`${row.original.id_clave}-admin`];
                return (
                    <div className="flex items-center gap-2">
                        <span className="font-mono bg-red-50 text-red-700 px-2 py-1 rounded min-w-[80px]">
                            {isVisible ? val : '••••••••'}
                        </span>
                        <button
                            onClick={(e) => { e.stopPropagation(); togglePasswordVisibility(row.original.id_clave, 'admin') }}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                            {isVisible ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                );
            }
        },
        {
            id: 'actions',
            header: 'Acciones',
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); onEdit(row.original); }}
                        className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 p-2 rounded-md transition-colors hover:bg-white"
                        title="Editar"
                    >
                        <FaEdit />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(row.original); }}
                        className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-md transition-colors hover:bg-white"
                        title="Eliminar"
                    >
                        <FaTrash />
                    </button>
                </div>
            ),
        }
    ], [onEdit, onDelete, visiblePasswords]);

    const table = useReactTable({
        data: filteredData,
        columns,
        state: {
            globalFilter,
            sorting,
        },
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    const exportToExcel = () => {
        const dataToExport = filteredData.map(item => ({
            "Sede": item.sede,
            "Nombre (Equipo/Red)": item.nombre,
            "Contraseña WiFi": item.password_wifi,
            "IP": item.ip,
            "Usuario Admin": item.usuario_admin,
            "Password Admin": item.password_admin
        }));

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(dataToExport);
        XLSX.utils.book_append_sheet(wb, ws, "ClavesWifi");
        XLSX.writeFile(wb, "ClavesWifi.xlsx");
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div className="flex flex-col gap-4 w-full md:w-auto">
                    <div className="flex flex-wrap gap-4 items-center">
                        {/* Sede Filter */}
                        <select
                            value={sedeFilter}
                            onChange={(e) => setSedeFilter(e.target.value)}
                            className="px-4 py-1.5 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 h-[38px]"
                        >
                            <option value="ALL">Todas las sedes</option>
                            {uniqueSedes.map(sede => (
                                <option key={sede} value={sede}>{sede}</option>
                            ))}
                        </select>
                        <div className="relative w-full md:w-96">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                value={globalFilter ?? ''}
                                onChange={e => setGlobalFilter(e.target.value)}
                                placeholder="Buscar en claves y equipos..."
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono text-sm"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onAdd}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
                    >
                        <FaPlus />
                        <span>Nuevo Acceso</span>
                    </button>
                    <button
                        onClick={exportToExcel}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
                    >
                        <FaFileExcel />
                        <span>Exportar Excel</span>
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th
                                        key={header.id}
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        <div className="flex items-center gap-2">
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                            {{
                                                asc: <FaArrowUp size={12} />,
                                                desc: <FaArrowDown size={12} />,
                                            }[header.column.getIsSorted()] ?? null}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {table.getRowModel().rows.map(row => (
                            <tr key={row.id} className="hover:bg-blue-50 transition-colors">
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
                <div>
                    Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount() || 1}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Anterior
                    </button>
                    <button
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Siguiente
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ClavesWifiTable;
