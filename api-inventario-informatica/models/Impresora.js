module.exports = (sequelize, DataTypes) => {
    const Impresora = sequelize.define("Impresora", {
        id_impresora: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nombre_impresora: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        marca: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        modelo: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        serie: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        codigo_adl: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        ip: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        sede: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        unidad: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        ubicacion: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        nombre_usuario: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        operativo: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        observaciones: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        revisado: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    }, {
        tableName: 'impresoras',
        timestamps: true
    });

    return Impresora;
};
