const xlsx = require('xlsx');
const path = require('path');
const { Casuistica } = require('./models');
const sequelize = require('./db/SequelizeConfig');

const importCasuistica = async () => {
    try {
        const filePath = path.join(__dirname, '..', 'casuistica.xlsx');
        console.log(`Leyendo archivo desde: ${filePath}`);

        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const data = xlsx.utils.sheet_to_json(sheet);
        console.log(`Se encontraron ${data.length} registros para importar.`);

        let count = 0;
        for (const row of data) {
            try {
                const rowData = {
                    empresa: row['EMPRESA'] ? String(row['EMPRESA']).trim() : null,
                    pass: row['PASS'] ? String(row['PASS']).trim() : null,
                    nombre: row['Nombre'] ? String(row['Nombre']).trim() : null,
                    correo: row['CORREO ELECTRONICO'] ? String(row['CORREO ELECTRONICO']).trim() : null,
                };

                await Casuistica.create(rowData);
                count++;

                if (count % 50 === 0) {
                    console.log(`Importados ${count} registros...`);
                }
            } catch (err) {
                console.error(`Error importando fila ${count}:`, err.original || err);
            }
        }

        console.log(`Importación completada exitosamente. Total importados: ${count}`);
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
        await Casuistica.sync({ force: true });
        console.log('Tabla Casuistica recreada (force: true).');
        await importCasuistica();
    } catch (err) {
        console.error('Error sincronizando o importando:', err);
    }
}).catch(err => {
    console.error('No se pudo conectar a la base de datos:', err);
});
