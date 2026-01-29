require('dotenv').config({ path: './api-inventario-informatica/.env' });
const db = require("./api-inventario-informatica/models");
const { Inventario } = db;
const sequelize = require("./api-inventario-informatica/db/SequelizeConfig");

async function checkOperativoValues() {
    try {
        const counts = await Inventario.findAll({
            attributes: ['operativo', [sequelize.fn('COUNT', sequelize.col('operativo')), 'count']],
            group: ['operativo']
        });

        console.log("Distinct 'operativo' values:");
        counts.forEach(c => {
            console.log(`Value: '${c.operativo}', Count: ${c.getDataValue('count')}`);
        });

        // Also check if there are nulls explicitly if not caught above
        const nullCount = await Inventario.count({ where: { operativo: null } });
        console.log(`Null count: ${nullCount}`);

    } catch (error) {
        console.error("Error:", error);
    }
}

checkOperativoValues();
