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
import { FaEdit, FaTrash, FaSearch, FaFileExcel, FaPlus, FaArrowUp, FaArrowDown, FaCopy, FaCheck } from 'react-icons/fa';
import * as XLSX from 'xlsx';

const CasuisticaTable = ({ data, onEdit, onDelete, onAdd }) => {
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState([]);
    const [copiedId, setCopiedId] = useState(null);

    const handleCopy = (text, id) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const columns = useMemo(() => [
        {
            accessorKey: 'empresa',
            header: 'Empresa',
            cell: ({ getValue }) => <span className="font-semibold text-gray-800">{getValue() || '-'}</span>
        },
        {
            accessorKey: 'nombre',
            header: 'Nombre Contacto',
            cell: ({ getValue }) => getValue() || <span className="text-gray-400 italic">No especificado</span>
        },
        {
            accessorKey: 'correo',
            header: 'Correos Electrónicos',
            cell: ({ row, getValue }) => {
                const val = getValue();
                if (!val) return <span className="text-gray-400 italic">-</span>;
                // Dividir por comas o punto y coma
                const emails = val.split(/[,;]+/).map(e => e.trim()).filter(Boolean);

                return (
                    <div className="flex items-start justify-between group">
                        <div className="flex flex-col gap-1">
                            {emails.map((email, idx) => (
                                <span key={idx} className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs w-fit font-medium">
                                    {email}
                                </span>
                            ))}
                        </div>
                        <button
                            onClick={(e) => { e.stopPropagation(); handleCopy(val, row.original.id_casuistica); }}
                            className="text-gray-400 hover:text-blue-600 p-1.5 rounded-md hover:bg-blue-50 transition-colors opacity-0 group-hover:opacity-100"
                            title="Copiar todos los correos"
                        >
                            {copiedId === row.original.id_casuistica ? <FaCheck className="text-emerald-500" /> : <FaCopy />}
                        </button>
                    </div>
                );
            }
        },
        {
            accessorKey: 'pass',
            header: 'Contraseña (PASS)',
            cell: ({ getValue }) => {
                const val = getValue();
                if (!val) return '-';
                return (
                    <span className="font-mono bg-yellow-50 text-yellow-800 border border-yellow-200 px-2 py-1 rounded select-all cursor-text">
                        {val}
                    </span>
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
    ], [onEdit, onDelete, copiedId]);

    const table = useReactTable({
        data,
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
        const dataToExport = data.map(item => ({
            "Empresa": item.empresa,
            "Nombre Contacto": item.nombre,
            "Correos Electrónicos": item.correo,
            "Contraseña (PASS)": item.pass
        }));

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(dataToExport);
        XLSX.utils.book_append_sheet(wb, ws, "Casuisticas");
        XLSX.writeFile(wb, "Casuisticas_Lunes.xlsx");
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div className="flex flex-col gap-4 w-full md:w-auto">
                    <div className="relative w-full md:w-96">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            value={globalFilter ?? ''}
                            onChange={e => setGlobalFilter(e.target.value)}
                            placeholder="Buscar empresa, correo, contacto..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono text-sm"
                        />
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onAdd}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
                    >
                        <FaPlus />
                        <span>Nuevo Cliente</span>
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
                                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
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

export default CasuisticaTable;
