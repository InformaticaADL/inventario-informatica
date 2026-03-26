const sequelize = require('./db/SequelizeConfig');

async function migrate() {
    try {
        console.log('Iniciando migración M2M Programas-Secciones...');

        // 1. Crear tabla de unión
        console.log('Intentando crear tabla mae_programa_seccion...');
        try {
            await sequelize.query(`
                CREATE TABLE mae_programa_seccion (
                    id_programa INT NOT NULL,
                    id_seccion INT NOT NULL,
                    PRIMARY KEY (id_programa, id_seccion),
                    FOREIGN KEY (id_programa) REFERENCES mae_programa(id_programa),
                    FOREIGN KEY (id_seccion) REFERENCES mae_seccion(id_seccion)
                )
            `);
            console.log('Tabla creada.');
        } catch (e) {
            console.log('Nota: La tabla ya existe o hubo un problema al crearla:', e.message);
        }

        console.log('Migración completada.');
        process.exit(0);
    } catch (error) {
        console.error('Error crítico en la migración:', error);
        process.exit(1);
    }
}

migrate();
