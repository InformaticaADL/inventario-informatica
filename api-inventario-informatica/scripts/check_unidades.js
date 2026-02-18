const db = require('../models');
const { Inventario } = db;
const { Op } = require("sequelize");

async function checkUnidades() {
    try {
        const items = await Inventario.findAll({
            attributes: ['unidad'],
            group: ['unidad'],
            order: [['unidad', 'ASC']]
        });

        console.log("Current Unique Units in Database:");
        items.forEach(item => {
            console.log(`"${item.unidad}"`);
        });

    } catch (error) {
        console.error("Error:", error);
    }
}

checkUnidades();
