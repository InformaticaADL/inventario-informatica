module.exports = (sequelize, DataTypes) => {
    const Office = sequelize.define(
        "mae_office",
        {
            id_office: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            office: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
        },

        {
            tableName: "mae_office",
            freezeTableName: true,
            timestamps: false,
        }
    );

    Office.associate = (models) => {
        // Asociaciones eliminadas
    };
    return Office;
}