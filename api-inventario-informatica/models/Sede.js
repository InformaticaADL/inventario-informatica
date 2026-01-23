module.exports = (sequelize, DataTypes) => {
    const Sede = sequelize.define(
        "mae_lugaranalisis",
        {
            id_lugaranalisis: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            nombre_lugaranalisis: {
                type: DataTypes.STRING(30),
                allowNull: true,
            },
            sigla: {
                type: DataTypes.STRING(3),
                allowNull: true,
            },
            habilitado: {
                type: DataTypes.STRING(1),
                allowNull: true,
            },
            cod_contable: {
                type: DataTypes.STRING(1),
                allowNull: true,
            },
            screening: {
                type: DataTypes.STRING(1),
                allowNull: true,
            },
        },

        {
            tableName: "mae_lugaranalisis",
            freezeTableName: true,
            timestamps: false,
        }
    );

    Sede.associate = (models) => {
        // Asociaciones eliminadas
    };
    return Sede;
}