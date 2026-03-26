const sequelize = require('./db/SequelizeConfig');

async function checkDetails() {
    try {
        console.log('Checking numeric precision/scale for mae_seccion.id_seccion...');
        
        const [details] = await sequelize.query(`
            SELECT COLUMN_NAME, DATA_TYPE, NUMERIC_PRECISION, NUMERIC_SCALE
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_NAME = 'mae_seccion' AND COLUMN_NAME = 'id_seccion'
        `);
        console.log('Details:', details[0]);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkDetails();
