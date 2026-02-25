module.exports = (sequelize, DataTypes) => {
    const ClavesWifi = sequelize.define("ClavesWifi", {
        id_clave: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        sede: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        password_wifi: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        ip: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        usuario_admin: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        password_admin: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    }, {
        tableName: 'claves_wifi',
        timestamps: true
    });

    return ClavesWifi;
};
