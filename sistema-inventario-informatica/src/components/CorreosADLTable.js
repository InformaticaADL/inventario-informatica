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
import { FaEdit, FaSearch, FaFileExcel, FaPlus, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import CorreosADLDetailsModal from './CorreosADLDetailsModal';

const CorreosADLTable = ({ data, onEdit, onAdd }) => {
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState([]);
    const [habilitadoFilter, setHabilitadoFilter] = useState("ALL"); // ALL, S, N
    const [sedeFilter, setSedeFilter] = useState("ALL");

    // Details Modal State
    const [viewItem, setViewItem] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    // Get unique sedes for filter
    const uniqueSedes = useMemo(() => {
        const sedes = data.map(item => item.sede).filter(Boolean);
        return [...new Set(sedes)].sort();
    }, [data]);

    // Filter data based on habilitado status and sede
    const filteredData = useMemo(() => {
        return data.filter(item => {
            // Filter by Habilitado
            const status = item.habilitado ? String(item.habilitado).toUpperCase() : 'N';
            const matchesHabilitado = habilitadoFilter === 'ALL' || status === habilitadoFilter;

            // Filter by Sede
            const matchesSede = sedeFilter === 'ALL' || item.sede === sedeFilter;

            return matchesHabilitado && matchesSede;
        });
    }, [data, habilitadoFilter, sedeFilter]);

    const columns = useMemo(() => [
        {
            accessorKey: 'sede',
            header: 'Sede',
        },
        {
            accessorKey: 'area',
            header: 'Área',
        },
        {
            accessorKey: 'unidad',
            header: 'Unidad',
        },
        {
            accessorKey: 'nombre',
            header: 'Nombre',
        },
        {
            accessorKey: 'email',
            header: 'Email',
        },
        {
            accessorKey: 'empresa',
            header: 'Empresa',
        },
        {
            accessorKey: 'habilitado',
            header: 'Habilitado',
            cell: ({ getValue }) => {
                const val = getValue();
                return (
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${String(val).toUpperCase() === 'S'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                        }`}>
                        {String(val).toUpperCase() === 'S' ? 'Si' : 'No'}
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
                </div>
            ),
        }
    ], [onEdit]);

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
            "Área": item.area,
            "Unidad": item.unidad,
            "Nombre": item.nombre,
            "Email": item.email,
            "Empresa": item.empresa,
            "Habilitado": item.habilitado === 'S' ? 'Si' : 'No'
        }));

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(dataToExport);
        XLSX.utils.book_append_sheet(wb, ws, "CorreosADL");
        XLSX.writeFile(wb, "CorreosADL.xlsx");
    };

    const handleView = (item) => {
        setViewItem(item);
        setIsDetailsModalOpen(true);
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
                            className="px-4 py-1.5 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
                        >
                            <option value="ALL">Todas las sedes</option>
                            {uniqueSedes.map(sede => (
                                <option key={sede} value={sede}>{sede}</option>
                            ))}
                        </select>

                        {/* Filter Buttons */}
                        <div className="flex bg-gray-100 p-1 rounded-lg w-fit">
                            {['ALL', 'S', 'N'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setHabilitadoFilter(status)}
                                    className={`px-4 py-1 rounded-md text-sm font-medium transition-all ${habilitadoFilter === status
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {status === 'ALL' ? 'Todos' : status === 'S' ? 'Activos' : 'Inactivos'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="relative w-full md:w-96">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            value={globalFilter ?? ''}
                            onChange={e => setGlobalFilter(e.target.value)}
                            placeholder="Buscar correos..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onAdd}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
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
                            <tr
                                key={row.id}
                                className="hover:bg-blue-50 transition-colors cursor-pointer"
                                onClick={() => handleView(row.original)}
                            >
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
                    Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
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
            <CorreosADLDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                data={viewItem}
            />
        </div>
    );
};

export default CorreosADLTable;
