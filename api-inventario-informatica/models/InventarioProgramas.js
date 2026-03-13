module.exports = (sequelize, DataTypes) => {
    const InventarioProgramas = sequelize.define(
        "inventario_programas",
        {
            id_inventario: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 'inventario',
                    key: 'id_inventario'
                }
            },
            id_programa: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 'mae_programa',
                    key: 'id_programa'
                }
            },
        },
        {
            tableName: "inventario_programas",
            freezeTableName: true,
            timestamps: true,
        }
    );

    return InventarioProgramas;
};
