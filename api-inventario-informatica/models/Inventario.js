module.exports = (sequelize, DataTypes) => {
    const Inventario = sequelize.define("Inventario", {
        id_inventario: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        estado: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        operativo: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        proveedor: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        n_factura: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        fecha_factura: {
            type: DataTypes.STRING, // Using STRING to avoid strict date parsing issues initially, or DATEONLY if cleaned
            allowNull: true,
        },
        valor_neto: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        frecuencia_mantencion: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        fecha_adquisicion: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        fecha_recepcion: {
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
        nombre_responsable: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        nombre_equipo: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        nombre_usuario: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        ip: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        tipo_equipo: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        ubicacion: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        anydesk: {
            type: DataTypes.STRING,
            allowNull: true,
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
        sistema_operativo: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        licencia_windows: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        office: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        ram: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        procesador: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        disco_duro: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        correo: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        id_teamviewer: {
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
        tableName: 'inventario',
        timestamps: true
    });

    return Inventario;
};
