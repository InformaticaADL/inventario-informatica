module.exports = (sequelize, DataTypes) => {
    const Casuistica = sequelize.define("Casuistica", {
        id_casuistica: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        empresa: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        pass: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        correo: {
            type: DataTypes.TEXT,
            allowNull: true,
        }
    }, {
        tableName: 'casuistica',
        timestamps: true
    });

    return Casuistica;
};
