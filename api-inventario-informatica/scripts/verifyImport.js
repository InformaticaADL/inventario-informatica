const db = require('../models');

const verifyImport = async () => {
    try {
        await db.sequelize.authenticate();
        console.log('Database connected.');

        const count = await db.Inventario.count();
        console.log(`Total Inventario records: ${count}`);

    } catch (error) {
        console.error('Verification failed:', error);
    } finally {
        await db.sequelize.close();
    }
};

verifyImport();
