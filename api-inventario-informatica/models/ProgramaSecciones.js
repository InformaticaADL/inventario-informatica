module.exports = (sequelize, DataTypes) => {
    const ProgramaSecciones = sequelize.define(
        "ProgramaSecciones",
        {
            id_programa: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                references: {
                    model: 'mae_programa',
                    key: 'id_programa'
                }
            },
            id_seccion: {
                type: DataTypes.DECIMAL(10, 0),
                primaryKey: true,
                references: {
                    model: 'mae_seccion',
                    key: 'id_seccion'
                }
            }
        },
        {
            tableName: "mae_programa_seccion",
            freezeTableName: true,
            timestamps: false,
        }
    );

    return ProgramaSecciones;
};
