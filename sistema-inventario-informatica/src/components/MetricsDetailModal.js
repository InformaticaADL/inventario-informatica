import { useState } from "react";
import { FaTimes, FaList, FaCheckCircle, FaTimesCircle, FaMapMarkerAlt, FaDesktop, FaWindows, FaBuilding, FaFilter, FaArrowRight } from "react-icons/fa";
import { getLastResponsable } from "@/utils/formatters";

// Sub-Modal for displaying filtered equipment
const HardwareListModal = ({ isOpen, onClose, items, title, filters }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-[85vw] flex flex-col max-h-[90vh] animate-fadeIn">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 leading-tight">
                            Equipos Filtrados: {title}
                        </h3>
                        <div className="flex gap-2 mt-2">
                            {filters.cpu && <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">CPU: {filters.cpu}</span>}
                            {filters.ram && <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">RAM: {filters.ram}</span>}
                            {filters.disk && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">Disco: {filters.disk}</span>}
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 hover:bg-black/5 p-2 rounded-lg transition-all">
                        <FaTimes size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-0">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">ID</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Equipo</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Hardware</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Responsable</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {items.map((item) => (
                                <tr key={item.id_inventario} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                                        {item.id_inventario}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 mr-3">
                                                <FaDesktop size={14} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{item.nombre_equipo}</div>
                                                <div className="text-xs text-gray-500">{item.marca} {item.modelo}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100 max-w-full text-wrap text-left" title={item.procesador}>
                                                    CPU: {item.procesador?.replace(/ @/g, '@').replace(/@/g, ' @ ') || "S/I"}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                                                    RAM: {item.ram || "S/I"}
                                                </span>
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
                                                    Disco: {item.disco_duro || "S/I"}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{item.nombre_usuario || "Sin Asignar"}</div>
                                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                            <FaMapMarkerAlt size={10} className="text-gray-400" />
                                            {item.ubicacion || "Sin ubicación"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${(item.operativo === 'SI') ? "bg-emerald-100 text-emerald-800" : (item.operativo === 'ROBADO') ? "bg-orange-100 text-orange-800" : "bg-red-100 text-red-800"}`}>
                                            {(item.operativo === 'SI') ? "Activo" : (item.operativo === 'ROBADO') ? "Robado" : "Inactivo"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {items.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                        No se encontraron equipos para esta selección de hardware.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-xl flex justify-end">
                    <button onClick={onClose} className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-all">
                        Volver
                    </button>
                </div>
            </div>
        </div>
    );
};

const MetricsDetailModal = ({ isOpen, onClose, title, data, filterType, filterValue, secondaryFilter }) => {
    const [hardwareFilters, setHardwareFilters] = useState({ cpu: null, ram: null, disk: null });
    const [isSubModalOpen, setIsSubModalOpen] = useState(false);

    if (!isOpen || !data) return null;

    // Reset filter when modal opens/closes or data changes
    const handleClose = () => {
        setHardwareFilters({ cpu: null, ram: null, disk: null });
        onClose();
    };

    // Filter Logic
    const filteredItems = data.filter(item => {
        if (!filterType || !filterValue) return false;

        if (filterType === 'STATUS') {
            const op = item.operativo ? item.operativo.trim().toUpperCase() : 'NO';
            if (filterValue === 'Activos') return op === 'SI';
            if (filterValue === 'Inactivos') return op === 'NO';
            if (filterValue === 'Robados') return op === 'ROBADO';
            // For 'Otros' or similar, we might need adjustments, but based on current dashboard logic:
            if (filterValue === 'Sin Info / Otros') return op !== 'SI' && op !== 'NO' && op !== 'ROBADO';
            return false;
        }

        if (filterType === 'LOCATION') {
            const loc = item.ubicacion ? item.ubicacion.toLowerCase() : '';
            if (filterValue === 'Oficina') return loc.includes('oficina');
            if (filterValue === 'Terreno') return loc.includes('terreno');
            if (filterValue === 'Otro/Sin Info') return !loc.includes('oficina') && !loc.includes('terreno');
            return false;
        }

        if (filterType === 'BRAND') {
            let brand = item.marca ? item.marca.trim() : 'Sin Marca';
            // Normalize for comparison
            if (brand.toUpperCase() === 'DELL') brand = 'Dell';
            if (brand.toUpperCase() === 'HP') brand = 'HP';
            if (brand.toUpperCase() === 'LENOVO') brand = 'Lenovo';

            if (brand !== filterValue) return false;

            // Apply secondary filter (Status) if present
            if (secondaryFilter) {
                const op = item.operativo ? item.operativo.trim().toUpperCase() : 'NO';
                if (secondaryFilter === 'ACTIVOS' && op !== 'SI') return false;
                if (secondaryFilter === 'INACTIVOS' && op !== 'NO') return false;
                if (secondaryFilter === 'ROBADOS' && op !== 'ROBADO') return false;
            }

            return true;
        }

        if (filterType === 'LICENSE') {
            let license = item.licencia_windows ? item.licencia_windows.trim() : 'Sin Información';
            if (license === '') license = 'Sin Información';
            return license === filterValue;
        }

        if (filterType === 'UNIT') {
            const unit = item.unidad ? item.unidad.trim().toUpperCase() : 'SIN UNIDAD';
            return unit === filterValue;
        }

        if (filterType === 'OS') {
            let os = item.sistema_operativo ? item.sistema_operativo.trim() : '';
            if (!os && filterValue === 'Sin Información') return true;

            os = os.toLowerCase();
            if (filterValue === 'Windows 11') return os.includes('windows 11');
            if (filterValue === 'Windows 10') return os.includes('windows 10');
            if (filterValue === 'Windows 7/8') return os.includes('windows 8') || os.includes('windows 7');
            if (filterValue === 'macOS') return os.includes('mac') || os.includes('osx') || os.includes('os x');

            // if "Otros"
            if (filterValue === 'Otros') {
                if (os.includes('windows') || os.includes('mac') || os.includes('osx')) return false;
                return os !== '';
            }
            if (filterValue === 'Sin Información') return os === '';

            return false;
        }

        return false;
    });

    // Apply Hardware Multi-Filters if active
    const finalTableItems = filteredItems.filter(item => {
        let match = true;

        if (hardwareFilters.cpu) {
            let cpu = item.procesador ? item.procesador.trim() : 'Sin Información';
            cpu = cpu.replace(/\(R\)/gi, '').replace(/\(TM\)/gi, '').replace(/CPU /gi, '').replace(/ @/g, '@').replace(/@/g, ' @ ').replace(/\s+/g, ' ').trim();
            if (cpu.toLowerCase() === 'sin información' || cpu === '') cpu = 'Desconocido / Sin Registrar';
            if (cpu !== hardwareFilters.cpu) match = false;
        }
        
        if (hardwareFilters.ram) {
            let ram = item.ram ? item.ram.trim().toUpperCase() : 'Sin Info';
            if (ram !== hardwareFilters.ram) match = false;
        }

        if (hardwareFilters.disk) {
            let disk = item.disco_duro ? item.disco_duro.trim().toUpperCase() : 'Sin Info';
            if (disk !== hardwareFilters.disk) match = false;
        }

        return match;
    });

    const hasActiveHardwareFilters = hardwareFilters.cpu !== null || hardwareFilters.ram !== null || hardwareFilters.disk !== null;

    // Helper to pick an icon based on filter type
    const renderIcon = () => {
        if (filterType === 'STATUS') {
            if (filterValue === 'Inactivos') return <FaTimesCircle size={24} />;
            return <FaCheckCircle size={24} />;
        }
        if (filterType === 'LOCATION') return <FaMapMarkerAlt size={24} />;

        if (filterType === 'BRAND') return <FaDesktop size={24} />;
        if (filterType === 'LICENSE') return <FaWindows size={24} />;
        if (filterType === 'OS') return <FaWindows size={24} />;
        if (filterType === 'UNIT') return <FaBuilding size={24} />;
        return <FaList size={24} />;
    };

    // Helper for chip color in modal header
    const getHeaderColor = () => {
        if (filterType === 'STATUS') {
            if (filterValue === 'Inactivos') return "bg-red-100 text-red-600 from-red-50";
            if (filterValue === 'Robados') return "bg-orange-100 text-orange-600 from-orange-50";
            return "bg-emerald-100 text-emerald-600 from-emerald-50";
        }
        if (filterType === 'LOCATION') return "bg-teal-100 text-teal-600 from-teal-50";

        if (filterType === 'BRAND') return "bg-indigo-100 text-indigo-600 from-indigo-50";
        if (filterType === 'LICENSE') return "bg-cyan-100 text-cyan-600 from-cyan-50";
        if (filterType === 'OS') return "bg-pink-100 text-pink-600 from-pink-50";
        if (filterType === 'UNIT') return "bg-purple-100 text-purple-600 from-purple-50";
        return "bg-blue-100 text-blue-600 from-blue-50";
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-[90vw] flex flex-col h-[95vh] max-h-[95vh] animate-fadeIn">

                {/* Header */}
                <div className={`flex justify-between items-center p-6 border-b border-gray-100 bg-gradient-to-r rounded-t-xl ${getHeaderColor()}`}>
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg shadow-sm bg-white/50`}>
                            {renderIcon()}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 leading-tight">
                                {title}: {filterValue}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                                {filteredItems.length} equipos encontrados
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-gray-500 hover:text-gray-700 hover:bg-black/5 p-2 rounded-lg transition-all"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Dashboard Metrics Header for Respective Filters */}
                {filterType === 'BRAND' && filteredItems.length > 0 && (
                    <div className="bg-gray-50 flex-1 flex flex-col min-h-0 relative">
                        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                                {/* Procesador Stats */}
                                <div className="flex flex-col bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2 shrink-0">
                                        <FaDesktop className="text-indigo-500" /> Procesador (Detallado)
                                    </h4>
                                    <div className="space-y-3 pr-2">
                                {Object.entries(
                                    filteredItems.reduce((acc, item) => {
                                        let cpu = item.procesador ? item.procesador.trim() : 'Sin Información';
                                        
                                        // Clean up unnecessary trademarks and redundant words for cleaner grouping
                                        cpu = cpu.replace(/\(R\)/gi, '')
                                                 .replace(/\(TM\)/gi, '')
                                                 .replace(/CPU /gi, '')
                                                 .replace(/ @/g, '@')
                                                 .replace(/@/g, ' @ ') // Normalize spacing around @
                                                 .replace(/\s+/g, ' ')
                                                 .trim();
                                                 
                                        if (cpu.toLowerCase() === 'sin información' || cpu === '') {
                                            cpu = 'Desconocido / Sin Registrar';
                                        }
                                        
                                        acc[cpu] = (acc[cpu] || 0) + 1;
                                        return acc;
                                    }, {})
                                ).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([cpu, count]) => {
                                    // Split CPU into Name and Frequency if '@' is present for better UI formatting
                                    const parts = cpu.split(' @ ');
                                    const cpuName = parts[0];
                                    const cpuFreq = parts[1] ? `@ ${parts[1]}` : '';

                                    return (
                                        <div 
                                            key={cpu} 
                                            onClick={() => setHardwareFilters(prev => ({ ...prev, cpu: prev.cpu === cpu ? null : cpu }))}
                                            className={`flex justify-between items-start text-sm p-2 rounded border shadow-sm cursor-pointer transition-colors ${
                                                hardwareFilters.cpu === cpu 
                                                ? 'bg-indigo-50 border-indigo-400 ring-2 ring-indigo-200' 
                                                : hardwareFilters.cpu ? 'bg-white opacity-40 border-gray-100 hover:opacity-100' : 'bg-white border-gray-100 hover:bg-gray-50'
                                            }`}
                                        >
                                            <div className="flex flex-col pr-2 overflow-hidden">
                                                <span className="text-gray-800 font-medium truncate" title={cpuName}>{cpuName}</span>
                                                {cpuFreq && <span className="text-xs text-gray-500 truncate">{cpuFreq}</span>}
                                                <span className="text-[10px] text-gray-400 mt-0.5">{count} {count === 1 ? 'equipo' : 'equipos'}</span>
                                            </div>
                                            <div className="flex flex-col items-end shrink-0">
                                                <span className={`font-bold px-2 py-1 rounded text-xs mb-1 transition-colors ${hardwareFilters.cpu === cpu ? 'text-white bg-indigo-600' : 'text-indigo-600 bg-indigo-50'}`}>
                                                    {Number(((count / filteredItems.length) * 100).toFixed(1))}%
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                                </div>
                            </div>

                                {/* RAM Stats */}
                                <div className="flex flex-col bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2 shrink-0">
                                        <FaCheckCircle className="text-emerald-500" /> Memoria RAM Principal
                                    </h4>
                                    <div className="space-y-3 pr-2">
                                {Object.entries(
                                    filteredItems.reduce((acc, item) => {
                                        let ram = item.ram ? item.ram.trim().toUpperCase() : 'Sin Info';
                                        acc[ram] = (acc[ram] || 0) + 1;
                                        return acc;
                                    }, {})
                                ).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([ram, count]) => (
                                    <div 
                                        key={ram} 
                                        onClick={() => setHardwareFilters(prev => ({ ...prev, ram: prev.ram === ram ? null : ram }))}
                                        className={`flex justify-between items-center text-sm p-2 rounded border shadow-sm cursor-pointer transition-colors ${
                                            hardwareFilters.ram === ram 
                                            ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-200' 
                                            : hardwareFilters.ram ? 'bg-white opacity-40 border-gray-100 hover:opacity-100' : 'bg-white border-gray-100 hover:bg-gray-50'
                                        }`}
                                    >
                                        <div className="flex flex-col">
                                            <span className="text-gray-800 font-medium">{ram}</span>
                                            <span className="text-[10px] text-gray-400">{count} {count === 1 ? 'equipo' : 'equipos'}</span>
                                        </div>
                                        <span className={`font-bold px-2 py-1 rounded text-xs transition-colors ${hardwareFilters.ram === ram ? 'text-white bg-emerald-600' : 'text-emerald-600 bg-emerald-50'}`}>
                                            {Number(((count / filteredItems.length) * 100).toFixed(1))}%
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                                {/* Almacenamiento Stats */}
                                <div className="flex flex-col bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2 shrink-0">
                                        <FaWindows className="text-amber-500" /> Almacenamiento Principal
                                    </h4>
                                    <div className="space-y-3 pr-2">
                                {Object.entries(
                                    filteredItems.reduce((acc, item) => {
                                        let disk = item.disco_duro ? item.disco_duro.trim().toUpperCase() : 'Sin Info';
                                        acc[disk] = (acc[disk] || 0) + 1;
                                        return acc;
                                    }, {})
                                ).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([disk, count]) => (
                                    <div 
                                        key={disk} 
                                        onClick={() => setHardwareFilters(prev => ({ ...prev, disk: prev.disk === disk ? null : disk }))}
                                        className={`flex justify-between items-center text-sm p-2 rounded border shadow-sm cursor-pointer transition-colors ${
                                            hardwareFilters.disk === disk 
                                            ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-200' 
                                            : hardwareFilters.disk ? 'bg-white opacity-40 border-gray-100 hover:opacity-100' : 'bg-white border-gray-100 hover:bg-gray-50'
                                        }`}
                                    >
                                        <div className="flex flex-col">
                                            <span className="text-gray-800 font-medium">{disk}</span>
                                            <span className="text-[10px] text-gray-400">{count} {count === 1 ? 'equipo' : 'equipos'}</span>
                                        </div>
                                        <span className={`font-bold px-2 py-1 rounded text-xs transition-colors ${hardwareFilters.disk === disk ? 'text-white bg-amber-600' : 'text-amber-600 bg-amber-50'}`}>
                                            {Number(((count / filteredItems.length) * 100).toFixed(1))}%
                                        </span>
                                    </div>
                                ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Table Body */}
                {filterType !== 'BRAND' && (
                <div className="flex-1 overflow-y-auto p-0 animate-fadeIn">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">ID</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Equipo</th>
                                {filterType === 'BRAND' ? (
                                    <>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Hardware</th>
                                    </>
                                ) : (
                                    <>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Sede</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Ubicación / Usuario</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Responsable</th>
                                    </>
                                )}
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {finalTableItems.map((item) => (
                                <tr key={item.id_inventario} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                                        {item.id_inventario}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 mr-3">
                                                <FaDesktop size={14} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{item.nombre_equipo}</div>
                                                <div className="text-xs text-gray-500">{item.marca} {item.modelo}</div>
                                            </div>
                                        </div>
                                    </td>
                                    {filterType === 'BRAND' ? (
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col gap-1.5">
                                                <div className="flex items-center">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100 max-w-full text-wrap text-left" title={item.procesador}>
                                                        CPU: {item.procesador?.replace(/ @/g, '@').replace(/@/g, ' @ ') || "S/I"}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                                                        RAM: {item.ram || "S/I"}
                                                    </span>
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
                                                        Disco: {item.disco_duro || "S/I"}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                    ) : (
                                        <>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {item.sede || "Sin Sede"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{item.nombre_usuario || "Sin usuario"}</div>
                                                <div className="text-xs text-gray-500">{item.ubicacion || "Sin ubicación"}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {getLastResponsable(item.nombre_responsable) || "Sin responsable"}
                                            </td>
                                        </>
                                    )}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${(item.operativo === 'SI') ? "bg-emerald-100 text-emerald-800" : (item.operativo === 'ROBADO') ? "bg-orange-100 text-orange-800" : "bg-red-100 text-red-800"
                                            }`}>
                                            {(item.operativo === 'SI') ? "Activo" : (item.operativo === 'ROBADO') ? "Robado" : "Inactivo"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {finalTableItems.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                        No se encontraron equipos para esta selección.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                )}

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-xl flex justify-between items-center z-10 sticky bottom-0">
                    <div className="text-sm text-gray-500">
                        * Listado filtrado por selección en gráfico.
                    </div>
                    <div className="flex items-center gap-3">
                        {hasActiveHardwareFilters && (
                            <>
                                <span className="text-sm font-medium text-blue-700 bg-blue-50 px-3 py-1.5 rounded-md border border-blue-100 mr-2 animate-fadeIn">
                                    {finalTableItems.length} equipos coinciden
                                </span>
                                <button 
                                    onClick={() => setHardwareFilters({ cpu: null, ram: null, disk: null })}
                                    className="bg-white border border-gray-300 text-gray-600 hover:text-gray-800 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-all animate-fadeIn"
                                >
                                    Limpiar
                                </button>
                                <button 
                                    onClick={() => setIsSubModalOpen(true)}
                                    className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 px-5 py-2 rounded-lg text-sm font-bold shadow-md transition-all animate-fadeIn"
                                >
                                    Ver Resultados <FaArrowRight size={12} />
                                </button>
                            </>
                        )}
                        <button
                            onClick={handleClose}
                            className={`${hasActiveHardwareFilters ? 'bg-gray-200 text-gray-700 hover:bg-gray-300 border-transparent' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'} border px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-all`}
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>

            <HardwareListModal 
                isOpen={isSubModalOpen} 
                onClose={() => setIsSubModalOpen(false)} 
                items={finalTableItems}
                title={filterValue}
                filters={hardwareFilters}
            />
        </div>
    );
};

export default MetricsDetailModal;
