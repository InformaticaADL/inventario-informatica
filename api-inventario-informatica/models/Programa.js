module.exports = (sequelize, DataTypes) => {
    const Programa = sequelize.define(
        "mae_programa",
        {
            id_programa: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
            },
            nombre_programa: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            tableName: "mae_programa",
            freezeTableName: true,
            timestamps: false,
        }
    );

    Programa.associate = (models) => {
        Programa.belongsToMany(models.Seccion, {
            through: models.ProgramaSecciones,
            foreignKey: "id_programa",
            otherKey: "id_seccion",
            as: "secciones",
        });
        Programa.belongsToMany(models.Inventario, {
            through: "inventario_programas",
            foreignKey: "id_programa",
            otherKey: "id_inventario",
            as: "equipos",
        });
    };

    return Programa;
};
