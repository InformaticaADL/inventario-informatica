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
import { FaFileExcel, FaSearch, FaArrowUp, FaArrowDown, FaCalendarAlt, FaCheckCircle, FaExclamationTriangle, FaClock, FaCopy } from 'react-icons/fa';
import * as XLSX from 'xlsx';

// Helper function to parse 'DD-MM-YYYY' string to Date object
const parseDateString = (dateString) => {
    if (!dateString) return null;
    const parts = dateString.split(/[-/]/);
    if (parts.length === 3) {
        // Assume DD-MM-YYYY or DD/MM/YYYY
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Months are 0-indexed in JS
        const year = parseInt(parts[2], 10);
        return new Date(year, month, day);
    }
    return null;
};

// Helper function to calculate the next maintenance date and status
const calculateNextMaintenance = (fechaMantencion) => {
    if (!fechaMantencion) return null;

    const lastDate = parseDateString(fechaMantencion);
    if (!lastDate || isNaN(lastDate.getTime())) return null;

    // Add 6 months
    const nextDate = new Date(lastDate);
    nextDate.setMonth(nextDate.getMonth() + 6);

    const today = new Date();
    // Normalize today removing time
    today.setHours(0, 0, 0, 0);

    const differenceInTime = nextDate.getTime() - today.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

    let status = 'Al día';
    let colorClass = 'bg-green-100 text-green-800 border-green-200';
    let icon = <FaCheckCircle className="text-green-600" />;

    if (differenceInDays < 0) {
        status = 'Vencida';
        colorClass = 'bg-red-100 text-red-800 border-red-200';
        icon = <FaExclamationTriangle className="text-red-600" />;
    } else if (differenceInDays <= 30) {
        status = 'Próxima a vencer';
        colorClass = 'bg-yellow-100 text-yellow-800 border-yellow-200';
        icon = <FaClock className="text-yellow-600" />;
    }

    return {
        nextDate: nextDate.toLocaleDateString('es-CL'),
        daysRemaining: differenceInDays,
        status,
        colorClass,
        icon
    };
};

const MantencionesTable = ({ data, onDuplicate }) => {
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState([]);

    // Helper for rendering boolean as Yes/No
    const renderBoolean = (value) => value ? 'Sí' : 'No';

    const columns = useMemo(() => [
        {
            id: 'acciones',
            header: 'Acciones',
            cell: ({ row }) => {
                return (
                    <div className="flex justify-center gap-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                const info = calculateNextMaintenance(row.original.fecha_mantencion);
                                onDuplicate(row.original, info ? info.nextDate : null);
                            }}
                            className="text-blue-600 hover:text-blue-900 bg-blue-50 p-2 rounded-md transition-colors hover:bg-white flex items-center gap-1"
                            title="Renovar / Replicar Mantención"
                        >
                            <FaCopy />
                        </button>
                    </div>
                );
            }
        },
        {
            accessorKey: 'nombre_equipo',
            header: 'Nombre Equipo',
            cell: ({ row }) => (
                <div className="font-medium text-gray-900">{row.original.nombre_equipo}</div>
            )
        },
        {
            accessorKey: 'sede',
            header: 'Sede',
        },
        {
            accessorKey: 'seccion',
            header: 'Sección',
        },
        {
            accessorKey: 'estado',
            header: 'Estado',
        },
        {
            accessorKey: 'nombre_usuario',
            header: 'Usuario',
        },
        {
            accessorKey: 'fecha_mantencion',
            header: 'Última Mantención',
        },
        {
            id: 'proxima_mantencion',
            header: 'Próxima Mantención',
            cell: ({ row }) => {
                const fechaMantencion = row.original.fecha_mantencion;
                const info = calculateNextMaintenance(fechaMantencion);

                if (!info) return <span className="text-gray-400 italic">No disponible</span>;

                return (
                    <div className="flex flex-col gap-2 min-w-[150px]">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <FaCalendarAlt className="text-gray-400" />
                            {info.nextDate}
                        </div>
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border w-max bg-opacity-50 ${info.colorClass}`}>
                            {info.icon}
                            <span>{info.status}</span>
                            <span className="ml-1 opacity-75 hidden sm:inline">
                                ({Math.abs(info.daysRemaining)} días {info.daysRemaining < 0 ? 'atraso' : 'restantes'})
                            </span>
                        </div>
                    </div>
                );
            }
        },
        {
            accessorKey: 'realizada_por',
            header: 'Realizada Por',
        },
        {
            accessorKey: 'recepcion_nombre',
            header: 'Recepción',
        },
        {
            accessorKey: 'detalle_mantencion',
            header: 'Detalle',
        }
    ], [onDuplicate]);

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
        const dataToExport = data.map(item => {
            const info = calculateNextMaintenance(item.fecha_mantencion);

            return {
                "Nombre Equipo": item.nombre_equipo,
                "Estado": item.estado,
                "Sede": item.sede,
                "Área": item.area,
                "Sección": item.seccion,
                "Fecha Mantención": item.fecha_mantencion,
                "Próxima Mantención": info ? info.nextDate : '-',
                "Estado Próxima": info ? info.status : '-',
                "Días Restantes/Vencidos": info ? info.daysRemaining : '-',
                "Usuario": item.nombre_usuario,
                "Tipo Equipo": item.tipo_equipo,
                "Código Interno": item.codigo_interno,
                "IP": item.ip,
                "Realizada Por": item.realizada_por,
                "Recepción Nombre": item.recepcion_nombre,
                "Recepción Fecha": item.recepcion_fecha,
                "Detalle": item.detalle_mantencion,
                "Fecha Registro": item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '-'
            };
        });

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(dataToExport);
        XLSX.utils.book_append_sheet(wb, ws, "Mantenciones");
        XLSX.writeFile(wb, "Mantenciones.xlsx");
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div className="relative w-full md:w-96">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        value={globalFilter ?? ''}
                        onChange={e => setGlobalFilter(e.target.value)}
                        placeholder="Buscar mantenciones..."
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <button
                        onClick={exportToExcel}
                        className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex justify-center items-center gap-2 transition-colors shadow-sm"
                    >
                        <FaFileExcel />
                        <span className="hidden sm:inline">Exportar Excel</span>
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
        </div>
    );
};

export default MantencionesTable;
