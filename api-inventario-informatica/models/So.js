module.exports = (sequelize, DataTypes) => {
    const So = sequelize.define(
        "mae_so",
        {
            id_so: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            so: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
        },

        {
            tableName: "mae_so",
            freezeTableName: true,
            timestamps: false,
        }
    );

    So.associate = (models) => {
        // Asociaciones eliminadas
    };
    return So;
}