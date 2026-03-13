module.exports = (sequelize, DataTypes) => {
    const Seccion = sequelize.define(
        "mae_seccion",
        {
            id_seccion: {
                type: DataTypes.DECIMAL(10, 0),
                primaryKey: true,
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
        Seccion.belongsToMany(models.Programa, {
            through: models.ProgramaSecciones,
            foreignKey: "id_seccion",
            otherKey: "id_programa",
            as: "programas",
        });
    };
    return Seccion;
}