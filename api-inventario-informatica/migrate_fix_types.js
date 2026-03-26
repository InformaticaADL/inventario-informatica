const sequelize = require('./db/SequelizeConfig');

async function migrate() {
    try {
        console.log('Iniciando migración M2M Programas-Secciones (Version 2.1)...');

        // 1. Eliminar tabla si existe (para asegurar consistencia de tipos)
        console.log('Limpiando tabla anterior si existe...');
        await sequelize.query(`
            IF OBJECT_ID('[mae_programa_seccion]', 'U') IS NOT NULL 
            DROP TABLE [mae_programa_seccion]
        `);

        // 2. Crear tabla con tipos EXPLÍCITOS
        console.log('Creando tabla mae_programa_seccion con tipos correctos (NUMERIC)...');
        await sequelize.query(`
            CREATE TABLE mae_programa_seccion (
                id_programa INT NOT NULL,
                id_seccion NUMERIC(10,0) NOT NULL,
                PRIMARY KEY (id_programa, id_seccion),
                CONSTRAINT FK_ProgSec_Prog FOREIGN KEY (id_programa) REFERENCES mae_programa(id_programa) ON DELETE CASCADE,
                CONSTRAINT FK_ProgSec_Sec FOREIGN KEY (id_seccion) REFERENCES mae_seccion(id_seccion) ON DELETE CASCADE
            )
        `);

        console.log('Migración completada con éxito.');
        process.exit(0);
    } catch (error) {
        console.error('Error crítico en la migración:', error);
        process.exit(1);
    }
}

migrate();
