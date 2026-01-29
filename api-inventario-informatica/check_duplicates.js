const db = require('./models');

const checkDuplicates = async () => {
    try {
        await db.sequelize.authenticate();
        console.log('Database connected.');

        const totalRecords = await db.Inventario.count();
        console.log(`Total records: ${totalRecords}`);

        // Check for duplicate names
        const duplicates = await db.Inventario.findAll({
            attributes: ['nombre_equipo', [db.sequelize.fn('COUNT', db.sequelize.col('id_inventario')), 'count']],
            group: ['nombre_equipo'],
            having: db.sequelize.literal('COUNT(id_inventario) > 1'),
            order: [[db.sequelize.literal('count'), 'DESC']]
        });

        if (duplicates.length > 0) {
            console.log('Found duplicates by nombre_equipo:');
            duplicates.forEach(d => {
                console.log(`${d.nombre_equipo}: ${d.getDataValue('count')}`);
            });
        } else {
            console.log('No duplicates found by nombre_equipo.');
        }

        // Check for duplicate Serial Numbers (if relevant)
        const duplicateSeries = await db.Inventario.findAll({
            attributes: ['serie', [db.sequelize.fn('COUNT', db.sequelize.col('id_inventario')), 'count']],
            where: {
                serie: { [db.Sequelize.Op.ne]: null } // Exclude nulls
            },
            group: ['serie'],
            having: db.sequelize.literal('COUNT(id_inventario) > 1'),
            order: [[db.sequelize.literal('count'), 'DESC']]
        });

        if (duplicateSeries.length > 0) {
            console.log('Found duplicates by serie:');
            duplicateSeries.forEach(d => {
                // Filter out generic placeholders if needed, seeing a lot of "N/A" or "-" common in legacy data
                if (d.serie && d.serie.length > 2) {
                    console.log(`${d.serie}: ${d.getDataValue('count')}`);
                }
            });
        } else {
            console.log('No duplicates found by serie.');
        }

    } catch (error) {
        console.error('Error checking duplicates:', error);
    } finally {
        await db.sequelize.close();
    }
};

checkDuplicates();
