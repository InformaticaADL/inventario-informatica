const db = require('../models');

const verifyRaw = async () => {
    try {
        await db.sequelize.authenticate();
        console.log('Database connected.');

        // Try raw insert
        try {
            await db.sequelize.query("INSERT INTO inventario (estado) VALUES ('TEST_RECORD')");
            console.log('Inserted raw record.');
        } catch (e) {
            console.error('Raw insert failed:', e);
        }

        const [results, metadata] = await db.sequelize.query("SELECT * FROM inventario");
        console.log(`Raw count: ${results.length}`);

        if (results.length > 0) {
            console.log('Sample raw:', results[0]);
        }

    } catch (error) {
        console.error('Verification failed:', error);
    } finally {
        await db.sequelize.close();
    }
};

verifyRaw();
