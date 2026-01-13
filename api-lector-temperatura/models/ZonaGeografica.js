module.exports = (sequelize, DataTypes) => {
  const ZonaGeografica = sequelize.define(
    "mae_zonageografica",
    {
      id_zonageografica: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      nombre_zonageografica: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
    },
    {
      tableName: "mae_zonageografica",
      freezeTableName: true,
      timestamps: false,
    }
  );

  ZonaGeografica.associate = (models) => {
    // Una ZonaGeografica tiene un Centro asociado (relación 1:1)
    ZonaGeografica.hasMany(models.Centro, {
        foreignKey: 'id_zonageografica',
        as: 'empresasAsociadas' 
    });
  };
return ZonaGeografica;
}

