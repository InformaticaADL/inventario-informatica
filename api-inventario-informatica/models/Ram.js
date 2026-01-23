module.exports = (sequelize, DataTypes) => {
    const Ram = sequelize.define(
        "mae_ram",
        {
            id_ram: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            capacidad: {    
                type: DataTypes.INTEGER,
                allowNull: true,
            },
        },

        {
            tableName: "mae_ram",
            freezeTableName: true,
            timestamps: false,
        }
    );

    Ram.associate = (models) => {
        // Asociaciones eliminadas
    };
    return Ram;
}