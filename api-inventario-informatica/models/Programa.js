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
        // No associations needed for now
    };

    return Programa;
};
