const xlsx = require('xlsx');
const path = require('path');
const { ClavesWifi } = require('./models');
const sequelize = require('./db/SequelizeConfig');

const importClavesWifi = async () => {
    try {
        const filePath = path.join(__dirname, '..', 'claves_wifi.xlsx');
        console.log(`Leyendo archivo desde: ${filePath}`);

        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const data = xlsx.utils.sheet_to_json(sheet);
        console.log(`Se encontraron ${data.length} registros para importar.`);

        let count = 0;
        for (const row of data) {
            try {
                const claveData = {
                    sede: row['Sede'] ? String(row['Sede']).trim() : null,
                    nombre: row['Nombre'] ? String(row['Nombre']).trim() : null,
                    password_wifi: row['Contraseña'] ? String(row['Contraseña']).trim() : null,
                    ip: row['IP'] ? String(row['IP']).trim() : null,
                    usuario_admin: row['Usuario'] ? String(row['Usuario']).trim() : null,
                    password_admin: row['Pasword'] ? String(row['Pasword']).trim() : null,
                };

                await ClavesWifi.create(claveData);
                count++;

                if (count % 10 === 0) {
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
        await ClavesWifi.sync({ force: true });
        console.log('Tabla ClavesWifi recreada (force: true).');
        await importClavesWifi();
    } catch (err) {
        console.error('Error sincronizando o importando:', err);
    }
}).catch(err => {
    console.error('No se pudo conectar a la base de datos:', err);
});
