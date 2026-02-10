const xlsx = require('xlsx');
const path = require('path');
const { CorreosADL } = require('./models');
const sequelize = require('./db/SequelizeConfig');

const importCorreos = async () => {
    try {
        const filePath = path.join(__dirname, '../correosADL.xlsx');
        console.log(`Leyendo archivo desde: ${filePath}`);

        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const data = xlsx.utils.sheet_to_json(sheet);
        console.log(`Se encontraron ${data.length} registros para importar.`);

        let count = 0;
        for (const row of data) {
            try {
                const correoData = {
                    sede: row['Sede'] ? String(row['Sede']).trim() : null,
                    area: row['Area'] ? String(row['Area']).trim() : null,
                    unidad: row['Unidad'] ? String(row['Unidad']).trim() : null,
                    nombre: row['nombre'] ? String(row['nombre']).trim() : null,
                    password: row['password'] ? String(row['password']).trim() : null,
                    email: row['e-mail'] ? String(row['e-mail']).trim() : null,
                    empresa: row['Empresa'] ? String(row['Empresa']).trim() : null,
                    habilitado: row['Habilitado'] ? String(row['Habilitado']).trim() : null,
                    observaciones: row['Observaciones'] ? String(row['Observaciones']).trim() : null,
                };

                await CorreosADL.create(correoData);
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
        await CorreosADL.sync({ force: true });
        console.log('Tabla recreada (force: true).');
        await importCorreos();
    } catch (err) {
        console.error('Error sincronizando o importando:', err);
    }
}).catch(err => {
    console.error('No se pudo conectar a la base de datos:', err);
});
