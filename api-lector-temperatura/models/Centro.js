module.exports = (sequelize, DataTypes) => {
  const Centro = sequelize.define(
    "mae_centro",
    {
      id_centro: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      codigo_centro: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      nombre_centro: {
        type: DataTypes.STRING(60),
        allowNull: true,
      },
      id_empresa: {
        type: DataTypes.DECIMAL(10, 0),
        allowNull: true,
      },
      id_zona: {
        type: DataTypes.DECIMAL(10, 0),
        allowNull: true,
      },
      id_zonageografica: {
        type: DataTypes.DECIMAL(10, 0),
        allowNull: true,
      },
      id_tipoagua: {
        type: DataTypes.DECIMAL(10, 0),
        allowNull: true,
      },
      id_barrio: {
        type: DataTypes.DECIMAL(10, 0),
        allowNull: true,
      },
      vigente: {
        type: DataTypes.STRING(1),
        allowNull: true,
      },
      latitud: {
        type: DataTypes.DECIMAL(10, 4),
        allowNull: true,
      },
      longitud: {
        type: DataTypes.DECIMAL(10, 4),
        allowNull: true,
      },
      geo_longitud: {
        type: DataTypes.DECIMAL(10, 5),
        allowNull: true,
      },
      geo_latitud: {
        type: DataTypes.DECIMAL(10, 5),
        allowNull: true,
      },
      geo_barrio: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      ubicacion: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      ma_latitud: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      ma_longitud: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      utm_este: {
        type: DataTypes.DECIMAL(10, 0),
        allowNull: true,
      },
      utm_norte: {
        type: DataTypes.DECIMAL(10, 0),
        allowNull: true,
      },
      id_region: {
        type: DataTypes.DECIMAL(10, 0),
        allowNull: true,
      },
      id_comuna: {
        type: DataTypes.DECIMAL(10, 0),
        allowNull: true,
      },
      id_sanitario: {
        type: DataTypes.DECIMAL(10, 0),
        allowNull: true,
      },
      nombre_corto: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      co_ensilaje: {
        type: DataTypes.STRING(1),
        allowNull: true,
      },
      lleva_nombrealternativo: {
        type: DataTypes.STRING(1),
        allowNull: true,
      },
      nombre_alternativo: {
        type: DataTypes.STRING(60),
        allowNull: true,
      },
      observaciones: {
        type: DataTypes.STRING(250),
        allowNull: true,
      },
      instrumentoambiental: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      realiza_screening: {
        type: DataTypes.STRING(1),
        allowNull: true,
      },
    },
    {
      tableName: "mae_centro",
      freezeTableName: true,
      timestamps: false,
    }
  );

  Centro.associate = (models) => {
    // Un Centro pertenece a una ZonaGeografica (relación N:1)
    Centro.belongsTo(models.ZonaGeografica, {
      foreignKey: 'id_zonageografica',
      as: 'zonaGeografica' 
    });
  };
return Centro;
}

