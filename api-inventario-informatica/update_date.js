const db = require('./models');

async function updateCode() {
    try {
        await db.sequelize.authenticate();
        console.log('Connection established.');
        
        const result = await db.CodigoADL.update(
            { fecha_creacion: new Date() },
            { where: { codigo_adl: 'NOT.185/ATV.PM' } }
        );
        
        console.log('Update result:', result);
        
    } catch (error) {
        console.error('Error updating row:', error);
    } finally {
        await db.sequelize.close();
    }
}

updateCode();
