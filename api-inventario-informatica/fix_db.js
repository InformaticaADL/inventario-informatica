const db = require('./models');

async function fix() {
    try {
        await db.sequelize.authenticate();
        console.log('Connection established.');
        
        // This will alter the table to add missing columns
        await db.CodigoADL.sync({ alter: true });
        console.log('Table mae_codigoadl updated successfully with missing columns.');
        
    } catch (error) {
        console.error('Error altering table:', error);
    } finally {
        await db.sequelize.close();
    }
}

fix();
