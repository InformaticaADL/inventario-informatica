const sequelize = require('./db/SequelizeConfig');

async function checkTypes() {
    try {
        console.log('Checking column types for mae_seccion and mae_programa...');
        
        const [seccionCols] = await sequelize.query(`
            SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, IS_NULLABLE
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_NAME = 'mae_seccion' AND COLUMN_NAME = 'id_seccion'
        `);
        console.log('mae_seccion.id_seccion:', seccionCols[0]);

        const [programaCols] = await sequelize.query(`
            SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, IS_NULLABLE
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_NAME = 'mae_programa' AND COLUMN_NAME = 'id_programa'
        `);
        console.log('mae_programa.id_programa:', programaCols[0]);

        process.exit(0);
    } catch (error) {
        console.error('Error checking types:', error);
        process.exit(1);
    }
}

checkTypes();
