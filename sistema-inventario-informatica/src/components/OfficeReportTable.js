"use client";
import { useState, useEffect } from "react";
import { FaFileExcel, FaArrowLeft, FaSearch } from "react-icons/fa";
import api from "@/api/apiConfig";
import * as XLSX from "xlsx";
import { useRouter } from "next/navigation";

const OfficeReportTable = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const router = useRouter();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await api.get("/inventario");
            // Mapping only relevant data for the table view
            const mappedData = response.data.map(item => ({
                id: item.id_inventario,
                nombre_equipo: item.nombre_equipo,
                office: item.office || "No registrado", // Default if null
                sistema_operativo: item.sistema_operativo || "No registrado",
                sede: item.sede,
                unidad: item.unidad,
                responsable: item.nombre_responsable || "No asignado"
            }));
            setData(mappedData);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };

    const handleExport = () => {
        // Prepare data specifically for Excel (cleaner keys if needed)
        const dataToExport = data.map(item => ({
            "Nombre Equipo": item.nombre_equipo,
            "Sistema Operativo": item.sistema_operativo,
            "Versión Office": item.office,
            "Unidad": item.unidad
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte Office");

        // Generate timestamp for filename
        const date = new Date().toISOString().split('T')[0];
        XLSX.writeFile(workbook, `Reporte_Office_${date}.xlsx`);
    };

    const filteredData = data.filter(item =>
        item.nombre_equipo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.office?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="text-center p-10">Cargando reporte...</div>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
                        title="Volver"
                    >
                        <FaArrowLeft size={20} />
                    </button>
                    <h2 className="text-2xl font-bold text-gray-800">Reporte de Office</h2>
                </div>

                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Buscar en reporte..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 transition-all"
                        />
                        <FaSearch className="absolute left-3 top-3 text-gray-400" />
                    </div>

                    <button
                        onClick={handleExport}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
                    >
                        <FaFileExcel /> Exportar Excel
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre Equipo</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sistema Operativo</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Versión Office</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unidad</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredData.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.nombre_equipo}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.sistema_operativo.toLowerCase().includes("linux") || item.sistema_operativo.toLowerCase().includes("ubuntu") ? "bg-orange-100 text-orange-800" :
                                        item.sistema_operativo.toLowerCase().includes("windows 11") ? "bg-indigo-100 text-indigo-800" :
                                            item.sistema_operativo.toLowerCase().includes("windows") ? "bg-blue-100 text-blue-800" :
                                                "bg-gray-100 text-gray-800"
                                        }`}>
                                        {item.sistema_operativo}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.office.toLowerCase().includes("libre") ? "bg-orange-100 text-orange-800" :
                                        item.office.toLowerCase().includes("office") ? "bg-blue-100 text-blue-800" :
                                            "bg-gray-100 text-gray-800"
                                        }`}>
                                        {item.office}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.unidad}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 text-sm text-gray-500 text-right">
                Total registros: {filteredData.length}
            </div>
        </div>
    );
};

export default OfficeReportTable;
