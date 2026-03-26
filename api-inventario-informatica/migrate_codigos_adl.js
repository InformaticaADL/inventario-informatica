const db = require('./models');
const { Op } = require('sequelize');

async function migrate() {
    try {
        await db.sequelize.authenticate();
        console.log('Connection has been established successfully.');
        
        await db.sequelize.sync();
        
        const inventarios = await db.Inventario.findAll({
            attributes: [
                [db.sequelize.fn('DISTINCT', db.sequelize.col('codigo_adl')), 'codigo_adl']
            ],
            where: {
                codigo_adl: {
                    [Op.ne]: null,
                    [Op.ne]: ''
                }
            }
        });
        
        const codesToInsert = inventarios
            .map(inv => inv.codigo_adl?.trim())
            .filter(code => code && code.length > 0);
        
        const uniqueCodes = [...new Set(codesToInsert)];
        console.log(`Found ${uniqueCodes.length} unique ADL codes in Inventario.`);
        
        let inserted = 0;
        for (const codeStr of uniqueCodes) {
            const exists = await db.CodigoADL.findOne({ where: { codigo_adl: codeStr } });
            if (!exists) {
                const maxId = await db.CodigoADL.max('id_codigoadl');
                const nextId = (maxId || 0) + 1;
                
                await db.CodigoADL.create({
                    id_codigoadl: nextId,
                    codigo_adl: codeStr
                });
                console.log(`Inserted: ${codeStr}`);
                inserted++;
            }
        }
        
        console.log(`Migration completed successfully. Inserted ${inserted} new codes.`);
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await db.sequelize.close();
    }
}

migrate();
