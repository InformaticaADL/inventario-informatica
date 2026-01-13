module.exports = (sequelizeInstance, DataTypes) => {
    const Termografo = sequelizeInstance.define(
        "Termografo",
        {
            id_termografo: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            nombre_termografo: {
                type: DataTypes.STRING(30),
                allowNull: false,
            },
            habilitado: {
                type: DataTypes.STRING(1),
                allowNull: true,
            },
            id_lugaranalisis: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
        },
        {
            tableName: "mae_termografo",
            freezeTableName: true,
            timestamps: false,
        }
    );
    return Termografo;
}
