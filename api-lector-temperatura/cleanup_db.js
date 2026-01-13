const { Sequelize, Op } = require('sequelize');
const defineIncubadoraModel = require('./models/IncubadoraData');
require('dotenv').config();

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

async function cleanData() {
    try {
        await sequelize.authenticate();
        console.log('Connection established.');

        // Eliminar datos desde Noviembre 2025 en adelante para limpiar lo corrupto
        const result = await IncubadoraData.destroy({
            where: {
                fecha: {
                    [Op.gte]: '2025-11-01'
                }
            }
        });

        console.log(`🗑️ Eliminados ${result} registros corruptos/antiguos.`);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

cleanData();
