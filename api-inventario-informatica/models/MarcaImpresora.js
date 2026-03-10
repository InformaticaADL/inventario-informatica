module.exports = (sequelize, DataTypes) => {
    const MarcaImpresora = sequelize.define(
        "MarcaImpresora",
        {
            id_marca: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            nombre_marca: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
        },
        {
            tableName: "marca_impresoras",
            freezeTableName: true,
            timestamps: false,
        }
    );

    return MarcaImpresora;
};
