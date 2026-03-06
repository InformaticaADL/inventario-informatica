const xlsx = require('xlsx');
const path = require('path');
const { Mantencion } = require('./models');
const sequelize = require('./db/SequelizeConfig');

const importMantenciones = async () => {
    try {
        const filePath = path.join(__dirname, '../FoGe IE-04.xlsx');
        console.log(`Leyendo archivo desde: ${filePath}`);

        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const data = xlsx.utils.sheet_to_json(sheet);
        console.log(`Se encontraron ${data.length} registros para importar.`);

        let count = 0;
        for (const row of data) {
            try {
                // Formatting Date Excel to String if necessary
                const formatDate = (dateVal) => {
                    if (!dateVal) return null;
                    if (typeof dateVal === 'number') {
                        // Excel date conversion trick
                        const date = new Date((dateVal - (25567 + 1)) * 86400 * 1000);
                        return date.toLocaleDateString('es-CL');
                    }
                    return String(dateVal).trim();
                };

                const mantencionData = {
                    estado: row['Estado'] ? String(row['Estado']).trim() : null,
                    sede: row['Sede'] ? String(row['Sede']).trim() : null,
                    area: row['Area'] ? String(row['Area']).trim() : null,
                    seccion: row['Sección'] ? String(row['Sección']).trim() : null,
                    fecha_mantencion: formatDate(row['Fecha Mantención']),
                    nombre_usuario: row['NombreUsuario'] ? String(row['NombreUsuario']).trim() : null,
                    nombre_equipo: row['NombreEquipo'] ? String(row['NombreEquipo']).trim() : null,
                    tipo_equipo: row['TipoEquipo'] ? String(row['TipoEquipo']).trim() : null,
                    codigo_interno: row['CódigoInterno'] ? String(row['CódigoInterno']).trim() : null,
                    ip: row['IP'] ? String(row['IP']).trim() : null,
                    realizada_por: row['RealizadaPOR'] ? String(row['RealizadaPOR']).trim() : null,
                    recepcion_nombre: row['RecepciónNombre'] ? String(row['RecepciónNombre']).trim() : null,
                    recepcion_fecha: formatDate(row['RecepciónFecha']),
                    detalle_mantencion: row['Detalle Mantención'] ? String(row['Detalle Mantención']).trim() : null,
                };

                await Mantencion.create(mantencionData);
                count++;

                if (count % 10 === 0) {
                    console.log(`Importados ${count} registros...`);
                }
            } catch (err) {
                console.error(`Error importando fila ${count}:`, err.original || err);
            }
        }

        console.log('Importación completada exitosamente.');
        process.exit(0);

    } catch (error) {
        console.error('Error general durante la importación:', error);
        process.exit(1);
    }
};

// Wait for DB connection
sequelize.authenticate().then(async () => {
    console.log('Conexión a la base de datos exitosa.');
    try {
        await Mantencion.sync({ force: true });
        console.log('Tabla recreada (force: true).');
        await importMantenciones();
    } catch (err) {
        console.error('Error sincronizando o importando:', err);
    }
}).catch(err => {
    console.error('No se pudo conectar a la base de datos:', err);
});
