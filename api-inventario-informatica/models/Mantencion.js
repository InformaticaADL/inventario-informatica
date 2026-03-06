module.exports = (sequelize, DataTypes) => {
    const Mantencion = sequelize.define("Mantencion", {
        id_mantencion: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        estado: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        sede: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        area: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        seccion: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        fecha_mantencion: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        nombre_usuario: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        nombre_equipo: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        tipo_equipo: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        codigo_interno: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        ip: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        realizada_por: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        recepcion_nombre: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        recepcion_fecha: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        detalle_mantencion: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    }, {
        tableName: 'mantenciones',
        timestamps: true
    });

    return Mantencion;
};
