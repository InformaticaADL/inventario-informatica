module.exports = (sequelize, DataTypes) => {
    const CorreosADL = sequelize.define("CorreosADL", {
        id_correo: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        sede: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        area: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        unidad: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        empresa: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        habilitado: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        observaciones: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    }, {
        tableName: 'correos_adl',
        timestamps: true
    });

    return CorreosADL;
};
