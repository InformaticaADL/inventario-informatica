module.exports = (sequelize, DataTypes) => {
    const Ubicacion = sequelize.define(
        "mae_ubicacion",
        {
            id_ubicacion: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            nombre_ubicacion: {
                type: DataTypes.STRING(20),
                allowNull: true,
            },
        },

        {
            tableName: "mae_ubicacion",
            freezeTableName: true,
            timestamps: false,
        }
    );

    Ubicacion.associate = (models) => {
        // Asociaciones eliminadas
    };
    return Ubicacion;
}