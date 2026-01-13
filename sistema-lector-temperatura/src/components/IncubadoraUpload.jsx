import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import api from "@/api/apiConfig";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const IncubadoraUpload = () => {
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState("");
  const [incubadoraId, setIncubadoraId] = useState("INC.12 LAB.BAM.PM");

  // Mapeo de validación: IncubadoraID -> Identificador en Excel (Row 0, Col 2)
  const INCUBATOR_MAPPING = {
    "INC.12 LAB.BAM.PM": "PM.VIR-inc-01 ch1",
    "INC.07_06.LAB.CCE.PM": "INC.06/LAB. CCE.PM",
    "INC.04.LAB.CCE.PM": "PM.VIR-inc-01 ch1"
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setLog(`Procesando archivo para ${incubadoraId}...`);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = await parseExcelData(event.target.result);
        if (data && data.length > 0) {
          await uploadData(data, file.name);
        } else {
          // Si data es vacío (y no tiró error), asumimos que el log ya fue seteado por la validación
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        setLog("❌ Error al leer el archivo Excel.");
        setLoading(false);
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = null; // Reset del input file
  };

  const parseExcelData = async (buffer) => {
    const workbook = XLSX.read(buffer, { type: 'array' });
    console.log("📚 Workbook Sheet Names:", workbook.SheetNames);

    if (workbook.SheetNames.length === 0) {
      console.error("❌ No sheets found in workbook");
      return [];
    }

    // Buscamos explícitamente la hoja "Datos"
    let sheetName = workbook.SheetNames.find(name => name === "Datos");

    // Si no existe, usamos la primera
    if (!sheetName) {
      console.warn("⚠️ Sheet 'Datos' not found. Falling back to first sheet:", workbook.SheetNames[0]);
      sheetName = workbook.SheetNames[0];
    }

    const sheet = workbook.Sheets[sheetName];
    console.log(`📄 Reading Sheet: "${sheetName}"`);
    console.log("DATA RANGE:", sheet['!ref']);

    // Convertir a array de arrays con cellDates: false para obtener los valores crudos (números seriales)
    // Esto evita que xlsx intente convertir a Date con la zona horaria del navegador, lo que causa el error del día anterior.
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1, cellDates: false });
    console.log("📊 Raw Excel Data (Length):", jsonData.length);

    // --- VALIDACIÓN DE IDENTIDAD ---
    if (jsonData.length > 0) {
      const row0 = jsonData[0];
      // El identificador suele estar en la columna 2 (índice 2)
      const fileIdentifier = row0 && row0[2] ? String(row0[2]).trim() : "DESCONOCIDO";
      const expectedIdentifier = INCUBATOR_MAPPING[incubadoraId];

      console.log(`🔍 Validación: Esperado "${expectedIdentifier}" vs Encontrado "${fileIdentifier}"`);

      if (expectedIdentifier && fileIdentifier !== expectedIdentifier) {
        setLog(`❌ Error de Seguridad: El archivo pertenece a la incubadora "${fileIdentifier}" pero has seleccionado "${incubadoraId}".`);
        return []; // Abortar
      }
    }
    // --------------------------------

    // Asumimos que la primera fila es header, empezamos desde la fila 1 (indice 1)
    const parsed = [];

    // Saltamos el header (i = 1)
    for (let i = 1; i < jsonData.length; i++) {
      const row = jsonData[i];
      if (!row || row.length === 0) continue;

      // Validación simple: Si no hay fecha/hora, saltamos
      if (!row[0]) {
        console.warn(`⚠️ Row ${i} skipped: No date found in column 0`, row);
        continue;
      }

      // Parsear Fecha y Hora
      let rawDate = row[0];
      let fechaPart = "";
      let horaPart = "";

      // Con cellDates: true, xlsx devuelve objetos Date nativos
      // Con cellDates: true, xlsx devuelve objetos Date nativos
      if (rawDate instanceof Date) {
        // Usamos dayjs local para mantener la fecha tal cual se ve en el Excel
        // .format() respeta el año/mes/dia local del objeto Date
        fechaPart = dayjs(rawDate).format("YYYY-MM-DD");
        horaPart = dayjs(rawDate).format("HH:mm");
      } else if (typeof rawDate === 'number') {
        // EXCEL SERIAL NUMBER (Ej: 45260.5)
        // El formato de celda en Excel probablemente es "General" y no "Date", por eso cellDates no lo convirtió.
        // Volvemos a la fórmula manual, pero USANDO UTC para evitar el error de desfase de zona horaria (30-11 vs 01-12).

        // Conversión estándar: (value - 25569) * 86400 * 1000
        const dateObj = new Date(Math.round((rawDate - 25569) * 86400 * 1000));

        // IMPORTANTE: El objeto Date creado representa el instante en UTC.
        // Si usamos .format() "local", JS restará 3/4 horas (Chile) y volveremos al 30-11.
        // Por eso AQUÍ usamos .utc() para extraer la fecha "visual" del Excel.
        fechaPart = dayjs.utc(dateObj).format("YYYY-MM-DD");
        horaPart = dayjs.utc(dateObj).format("HH:mm");
      } else {
        // Fallback por si viene como string
        // Intentar formatos explícitos (es posible que dayjs falle con DD-MM-YYYY por defecto)
        // Nota: requiere customParseFormat si no es estándar, pero voy a intentar validar primero
        const d = dayjs(rawDate);

        if (d.isValid()) {
          fechaPart = d.format("YYYY-MM-DD");
          horaPart = d.format("HH:mm");
        } else {
          // Intento manual simple para DD-MM-YYYY (común en latam) si dayjs falla
          // regex para dd-mm-yyyy o dd/mm/yyyy
          // ... (simplified checking)
          if (typeof rawDate === 'string' && (rawDate.includes('-') || rawDate.includes('/'))) {
            // Si el formato es DD-MM-YYYY...
            // Pero mejor dejemos que el log nos diga qué está pasando.
          }
          continue;
        }
      }

      // Mapeo de valores
      // Columnas con gaps (según log del usuario):
      // 0: Fecha
      // 2: Temp Min
      // 4: Temp Max
      // 6: Temp Min 2
      // 8: Temp Max 2
      // 10: Tiempo Puerta
      // 12: Tiempo Motor
      // 14: Tiempo Red
      // 16: Tiempo Alarma
      // 18: Observaciones

      parsed.push({
        fecha: fechaPart,
        hora_intervalo: horaPart,
        temp_minima: normalizeTemp(row[2]),
        temp_maxima: normalizeTemp(row[4]),
        temp_minima_2: normalizeTemp(row[6]),
        temp_maxima_2: normalizeTemp(row[8]),

        tiempo_puerta: Math.round(row[10] || 0),
        tiempo_motor: parseFloat((parseFloat(row[12] || 0)).toFixed(1)), // 1 decimal
        tiempo_red: Math.round(row[14] || 0),
        tiempo_alarma: Math.round(row[16] || 0),
        observaciones: row[18] || ""
      });
    }

    return parsed;
  };

  const normalizeTemp = (val) => {
    if (!val) return 0;
    const num = parseFloat(val);
    // Heurística: Si es mayor a 50, asumir que viene x10 (ej: 180 -> 18.0)
    // Si viene como 18.2, se queda igual.
    if (num > 50) return num / 10;
    return num;
  };

  const uploadData = async (data, fileName) => {
    try {
      const res = await api.post('/incubadora/consolidar', {
        data,
        nombreArchivo: fileName,
        incubadoraId: incubadoraId
      });

      const { nuevosInsertados, omitidosDuplicados } = res.data;

      setLog(`✅ ${fileName} procesado para ${incubadoraId}. (Guardados: ${nuevosInsertados}, Duplicados: ${omitidosDuplicados})`);

    } catch (error) {
      console.error(error);
      if (error.response) {
        setLog(`❌ Error del servidor: ${error.response.data.message || 'Desconocido'}`);
      } else {
        setLog("❌ Error de conexión al intentar guardar.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md max-w-lg w-full">
      <h3 className="text-lg font-bold mb-4 text-sky-900 border-b pb-2">
        Importar Datos Incubadora (Excel)
      </h3>

      <div className="flex flex-col gap-4">

        {/* ✅ SELECTOR DE INCUBADORA */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Seleccionar Incubadora
          </label>
          <select
            value={incubadoraId}
            onChange={(e) => setIncubadoraId(e.target.value)}
            className="block w-full border-gray-300 rounded-md shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm p-2 border bg-gray-50"
          >
            <option value="INC.12 LAB.BAM.PM">INC.12 LAB.BAM.PM</option>
            <option value="INC.07_06.LAB.CCE.PM">INC.07_06.LAB.CCE.PM</option>
            <option value="INC.04.LAB.CCE.PM">INC.04.LAB.CCE.PM</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Revisar que el archivo Excel tenga las columnas esperadas (Fecha, Intervalo, Temps, Tiempos, Obs).
          </p>
        </div>

        <label className="block">
          <span className="sr-only">Elegir archivo</span>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFile}
            disabled={loading}
            className="block w-full text-sm text-slate-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-sky-50 file:text-sky-700
                  hover:file:bg-sky-100 cursor-pointer"
          />
        </label>

        {/* Área de Logs */}
        <div className={`p-3 rounded text-sm font-medium ${log.includes('✅') ? 'bg-green-50 text-green-700' :
          log.includes('❌') ? 'bg-red-50 text-red-700' :
            log ? 'bg-blue-50 text-blue-700' : 'hidden'
          }`}>
          {log}
        </div>
      </div>
    </div>
  );
};

export default IncubadoraUpload;