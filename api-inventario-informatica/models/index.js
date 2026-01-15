const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../db/SequelizeConfig");

const db = {};

// Cargar modelos
db.Usuario = require('./Usuario')(sequelize, DataTypes);

// Ejecutar asociaciones
Object.values(db).forEach((model) => {
  if (typeof model.associate === "function") {
    model.associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
