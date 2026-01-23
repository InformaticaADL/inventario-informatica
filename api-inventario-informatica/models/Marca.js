module.exports = (sequelize, DataTypes) => {
    const Marca = sequelize.define(
        "mae_marca",
        {
            id_marca: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            nombre_marca: {
                type: DataTypes.STRING(20),
                allowNull: true,
            },
        },

        {
            tableName: "mae_marca",
            freezeTableName: true,
            timestamps: false,
        }
    );

    Marca.associate = (models) => {
        // Asociaciones eliminadas
    };
    return Marca;
}