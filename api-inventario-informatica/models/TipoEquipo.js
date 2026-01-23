module.exports = (sequelize, DataTypes) => {
    const TipoEquipo = sequelize.define(
        "mae_tipoequipo",
        {
            id_tipoequipo: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            nombre_tipoequipo: {
                type: DataTypes.STRING(20),
                allowNull: true,
            },
        },

        {
            tableName: "mae_tipoequipo",
            freezeTableName: true,
            timestamps: false,
        }
    );

    TipoEquipo.associate = (models) => {
        // Asociaciones eliminadas
    };
    return TipoEquipo;
}