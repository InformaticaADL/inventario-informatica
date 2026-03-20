module.exports = (sequelize, DataTypes) => {
    const CodigoADL = sequelize.define(
        "mae_codigoadl",
        {
            id_codigoadl: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
            },
            codigo_adl: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            fecha_creacion: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        },

        {
            tableName: "mae_codigoadl",
            freezeTableName: true,
            timestamps: false,
        }
    );

    CodigoADL.associate = (models) => {
        // Asociaciones aquí si las hay
    };
    return CodigoADL;
}
