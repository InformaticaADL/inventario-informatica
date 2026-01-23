module.exports = (sequelize, DataTypes) => {
    const Almacenamiento = sequelize.define(
        "mae_almacenamiento",
        {
            id_almacenamiento: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            almacenamiento: {
                type: DataTypes.STRING(15),
                allowNull: true,
            },
        },

        {
            tableName: "mae_almacenamiento",
            freezeTableName: true,
            timestamps: false,
        }
    );

    Almacenamiento.associate = (models) => {
        // Asociaciones eliminadas
    };
    return Almacenamiento;
}