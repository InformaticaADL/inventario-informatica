module.exports = (sequelize, DataTypes) => {
    const Empresa = sequelize.define(
        "mae_empresa",
        {
            id_empresa: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            rut_empresa: {
                type: DataTypes.STRING(30),
                allowNull: true,
            },
            nombre_empresa: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            direccion_empresa: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            email_empresa: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            fono_empresa: {
                type: DataTypes.STRING(30),
                allowNull: true,
            },
            contacto_empresa: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            email_contacto: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            fono_contacto: {
                type: DataTypes.STRING(30),
                allowNull: true,
            },
            convenio: {
                type: DataTypes.STRING(1),
                allowNull: true,
            },
            n_muestras_minimo: {
                type: DataTypes.DECIMAL(10, 0),
                allowNull: true,
            },
            id_empresaservicio: {
                type: DataTypes.DECIMAL(10, 0),
                allowNull: true,
            },
            habilitado: {
                type: DataTypes.STRING(1),
                allowNull: true,
            },
            ld: {
                type: DataTypes.STRING(1),
                allowNull: true,
            },
            color: {
                type: DataTypes.STRING(1),
                allowNull: true,
            },
            nombre_fantasia: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            rlegal_nombre: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            rlegal_rut: {
                type: DataTypes.STRING(30),
                allowNull: true,
            },
            rlegal_direccion: {
                type: DataTypes.STRING(200),
                allowNull: true,
            },
            realiza_screening: {
                type: DataTypes.STRING(1),
                allowNull: true,
            },
        },
        {
            tableName: "mae_empresa",
            freezeTableName: true,
            timestamps: false,
        }
    );

    // --- Función para definir asociaciones ---
    Empresa.associate = (models) => {
        // Asociaciones eliminadas por refactorización
    };
    return Empresa;
}

