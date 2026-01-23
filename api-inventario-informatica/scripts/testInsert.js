const db = require('../models');

const testInsert = async () => {
    try {
        await db.sequelize.authenticate();
        console.log('Database connected.');

        const record = await db.Inventario.create({
            estado: 'TEST_SINGLE',
            operativo: 'YES',
            createdAt: new Date(),
            updatedAt: new Date()
        });

        console.log('Single record created:', record.id_inventario);

    } catch (error) {
        console.error('Test insert failed:', error);
    } finally {
        await db.sequelize.close();
    }
};

testInsert();
