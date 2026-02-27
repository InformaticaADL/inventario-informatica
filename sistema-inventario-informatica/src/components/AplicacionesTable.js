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
import { FaEdit, FaSearch, FaFileExcel, FaPlus, FaArrowUp, FaArrowDown, FaTrash } from 'react-icons/fa';
import * as XLSX from 'xlsx';

const AplicacionesTable = ({ data, onEdit, onDelete, onAdd }) => {
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState([]);
    const [estadoFilter, setEstadoFilter] = useState("ALL"); // ALL, Activo, Inactivo

    // Filter data based on estado
    const filteredData = useMemo(() => {
        return data.filter(item => {
            if (estadoFilter === 'ALL') return true;
            return item.estado === estadoFilter;
        });
    }, [data, estadoFilter]);

    const columns = useMemo(() => [
        {
            accessorKey: 'nombre',
            header: 'Nombre',
            cell: ({ getValue }) => <span className="font-semibold text-gray-800">{getValue()}</span>
        },
        {
            accessorKey: 'url',
            header: 'URL',
            cell: ({ getValue }) => {
                const val = getValue();
                if (!val) return '-';
                return (
                    <a href={val} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {val}
                    </a>
                );
            }
        },
        {
            accessorKey: 'puerto',
            header: 'Puerto',
            cell: ({ getValue }) => {
                const val = getValue();
                return val ? <span className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">{val}</span> : '-';
            }
        },
        {
            accessorKey: 'servidor',
            header: 'Servidor',
        },
        {
            accessorKey: 'base_datos',
            header: 'Base de Datos',
        },
        {
            accessorKey: 'estado',
            header: 'Estado',
            cell: ({ getValue }) => {
                const val = getValue();
                return (
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${val === 'Activo'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                        }`}>
                        {val || 'Desconocido'}
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
    ], [onEdit, onDelete]);

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
            "Nombre": item.nombre,
            "URL": item.url,
            "Puerto": item.puerto,
            "Servidor": item.servidor,
            "Base de Datos": item.base_datos,
            "Estado": item.estado,
            "Observaciones": item.observaciones,
            "Fecha Creación": item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '-'
        }));

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(dataToExport);
        XLSX.utils.book_append_sheet(wb, ws, "Aplicaciones");
        XLSX.writeFile(wb, "Aplicaciones.xlsx");
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div className="flex flex-col gap-4 w-full md:w-auto">
                    <div className="flex flex-wrap gap-4 items-center">
                        {/* Filter Buttons */}
                        <div className="flex bg-gray-100 p-1 rounded-lg w-fit">
                            {['ALL', 'Activo', 'Inactivo'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setEstadoFilter(status)}
                                    className={`px-4 py-1 rounded-md text-sm font-medium transition-all ${estadoFilter === status
                                        ? 'bg-white text-purple-600 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {status === 'ALL' ? 'Todos' : status}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="relative w-full md:w-96">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            value={globalFilter ?? ''}
                            onChange={e => setGlobalFilter(e.target.value)}
                            placeholder="Buscar aplicaciones..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                        />
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onAdd}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
                    >
                        <FaPlus />
                        <span>Agregar</span>
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
                            <tr key={row.id} className="hover:bg-purple-50 transition-colors">
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
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

export default AplicacionesTable;
