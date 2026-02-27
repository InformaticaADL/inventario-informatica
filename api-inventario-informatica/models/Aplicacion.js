module.exports = (sequelize, DataTypes) => {
    const Aplicacion = sequelize.define("Aplicacion", {
        id_aplicacion: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        puerto: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        servidor: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        base_datos: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        estado: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: 'Activo',
        },
        observaciones: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    }, {
        tableName: 'aplicaciones',
        timestamps: true
    });

    return Aplicacion;
};
