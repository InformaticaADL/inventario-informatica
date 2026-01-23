const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../db/SequelizeConfig");

const db = {};

// Cargar modelos
db.Usuario = require('./Usuario')(sequelize, DataTypes);
db.Inventario = require('./Inventario')(sequelize, DataTypes);
db.Seccion = require('./Seccion')(sequelize, DataTypes);
db.Sede = require('./Sede')(sequelize, DataTypes);
db.TipoEquipo = require('./TipoEquipo')(sequelize, DataTypes);
db.Marca = require('./Marca')(sequelize, DataTypes);
db.Ubicacion = require('./Ubicacion')(sequelize, DataTypes);
db.Ram = require('./Ram')(sequelize, DataTypes);
db.Almacenamiento = require('./Almacenamiento')(sequelize, DataTypes);
db.So = require('./So')(sequelize, DataTypes);
db.Office = require('./Office')(sequelize, DataTypes);

// Ejecutar asociaciones
Object.values(db).forEach((model) => {
  if (typeof model.associate === "function") {
    model.associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
