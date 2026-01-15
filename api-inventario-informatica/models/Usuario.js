module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define(
    "mae_usuario",
    {
      id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      nombre_usuario: {
        type: DataTypes.STRING(25),
        allowNull: true,
      },
      clave_usuario: {
        type: DataTypes.STRING(6),
        allowNull: true,
      },
      seccion: {
        type: DataTypes.STRING(6),
        allowNull: true,
      },
      usuario: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      correo_electronico: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
    },
    {
      tableName: "mae_usuario",
      freezeTableName: true,
      timestamps: false,
    }
  );

  Usuario.associate = (models) => {
    // Asociaciones eliminadas
  };
  return Usuario;
}