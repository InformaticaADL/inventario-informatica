const db = require('../models');
const fs = require('fs');

const inspectSchema = async () => {
    try {
        await db.sequelize.authenticate();
        console.log('Database connected.');

        const [results, metadata] = await db.sequelize.query(`
            SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = 'inventario'
        `);

        fs.writeFileSync('schema.txt', JSON.stringify(results, null, 2));
        console.log('Schema dumped to schema.txt');

    } catch (error) {
        console.error('Inspection failed:', error);
    } finally {
        await db.sequelize.close();
    }
};

inspectSchema();
