const XLSX = require('xlsx');
const path = require('path');
const db = require('../models');
const fs = require('fs');

const importData = async () => {
    try {
        await db.sequelize.authenticate();
        console.log('Database connected.');

        // Sync the model to ensure table exists (FORCE RECREATE)
        await db.Inventario.sync({ force: true });
        console.log('Inventario table synced (FORCE).');

        const filePath = path.join(__dirname, '../../inventarioADL.xlsx');
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const data = XLSX.utils.sheet_to_json(worksheet); // Returns array of objects

        // Helper to handle potential date strings or numbers
        const cleanString = (val) => {
            if (val === undefined || val === null) return null;
            return String(val);
        };

        const records = data.map(row => ({
            estado: cleanString(row['ESTADO']),
            operativo: cleanString(row['OPERATIVO']),
            proveedor: cleanString(row['PROVEEDOR']),
            n_factura: cleanString(row['N° DE FACTURA']),
            fecha_factura: cleanString(row['FECHA DE FACTURA']),
            valor_neto: cleanString(row['VALOR NETO']),
            frecuencia_mantencion: cleanString(row['FRECUENCIA DE MANTENCIÓN']),
            fecha_adquisicion: cleanString(row['FECHA DE ADQUISICIÓN']),
            fecha_recepcion: cleanString(row['FECHA DE RECEPCIÓN']),
            sede: cleanString(row['SEDE']),
            unidad: cleanString(row['UNIDAD']),
            nombre_responsable: cleanString(row['NOMBRE RESPONSABLE']),
            nombre_equipo: cleanString(row['NOMBRE EQUIPO']),
            nombre_usuario: cleanString(row['NOMBRE USUARIO']),
            password: cleanString(row['PASSWORD 2016 (adlserver /  adlws)']),
            ip: cleanString(row['IP']),
            tipo_equipo: cleanString(row['TIPO DE EQUIPO']),
            ubicacion: cleanString(row['TERRENO / OFICINA']),
            anydesk: cleanString(row['ANYDESK']),
            marca: cleanString(row['MARCA']),
            modelo: cleanString(row['MODELO']),
            serie: cleanString(row['SERIE']),
            codigo_adl: cleanString(row['CODIGO-ADL']),
            sistema_operativo: cleanString(row['SO']),
            maquina_virtual: cleanString(row['MV']),
            office: cleanString(row['Office']),
            ram: cleanString(row['RAM']),
            procesador: cleanString(row['PROCESADOR']),
            disco_duro: cleanString(row['HD']),
            correo: cleanString(row['CORREO']),
            id_teamviewer: cleanString(row['ID TeamViewer']),
            observaciones: cleanString(row['Observaciones']),
            createdAt: new Date(),
            updatedAt: new Date()
        }));

        fs.writeFileSync('import_log.txt', `Mapped ${records.length} records.\n`);
        console.log(`Mapped ${records.length} records.`);

        const BATCH_SIZE = 50;
        for (let i = 0; i < records.length; i += BATCH_SIZE) {
            const chunk = records.slice(i, i + BATCH_SIZE);
            const msg = `Inserting chunk ${Math.floor(i / BATCH_SIZE) + 1} (${chunk.length} records)...\n`;
            console.log(msg.trim());
            fs.appendFileSync('import_log.txt', msg);
            try {
                await db.Inventario.bulkCreate(chunk);
                fs.appendFileSync('import_log.txt', `Chunk ${Math.floor(i / BATCH_SIZE) + 1} success.\n`);
            } catch (err) {
                const errMsg = `Error inserting chunk ${Math.floor(i / BATCH_SIZE) + 1}: ${err.message}\n`;
                console.error(errMsg.trim());
                fs.appendFileSync('import_log.txt', errMsg);
            }
        }
        console.log('Import completed.');

    } catch (error) {
        console.error('Import failed:', error);
    } finally {
        await db.sequelize.close();
    }
};

importData();
