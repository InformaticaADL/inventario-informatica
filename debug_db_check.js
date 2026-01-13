const { Sequelize } = require('sequelize');
const defineIncubadoraModel = require('./api-lector-temperatura/models/IncubadoraData');
require('dotenv').config({ path: './api-lector-temperatura/.env' });

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PWD, {
    host: '192.168.10.5',
    dialect: 'mssql',
    logging: false,
    dialectOptions: {
        options: {
            encrypt: true,
            trustServerCertificate: true
        }
    }
});

const IncubadoraData = defineIncubadoraModel(sequelize);

async function checkData() {
    try {
        await sequelize.authenticate();
        console.log('Connection established.');

        const records = await IncubadoraData.findAll({
            limit: 20,
            order: [['fecha', 'DESC'], ['hora_intervalo', 'DESC']],
            raw: true
        });

        console.log('--- TOP 20 LATEST RECORDS ---');
        records.forEach(r => {
            console.log(`ID: ${r.id_registro} | Fecha: ${r.fecha} | Hora: ${r.hora_intervalo} | T.Min: ${r.temp_minima}`);
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

checkData();
