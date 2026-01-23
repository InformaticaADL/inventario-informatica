module.exports = (sequelize, DataTypes) => {
    const Seccion = sequelize.define(
        "mae_seccion",
        {
            id_seccion: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            nombre_seccion: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            codigo_seccion: {
                type: DataTypes.STRING(4),
                allowNull: true,
            },
            sigla_seccion: {
                type: DataTypes.STRING(5),
                allowNull: true,
            },
            orden: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
        },

        {
            tableName: "mae_seccion",
            freezeTableName: true,
            timestamps: false,
        }
    );

    Seccion.associate = (models) => {
        // Asociaciones eliminadas
    };
    return Seccion;
}