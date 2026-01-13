const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelizeInstance = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PWD, {
    host: '192.168.10.5',
    dialect: 'mssql',
    dialectOptions: {
      options: {
        encrypt: true,
        trustServerCertificate: true
      }
    }
  });

  module.exports = sequelizeInstance