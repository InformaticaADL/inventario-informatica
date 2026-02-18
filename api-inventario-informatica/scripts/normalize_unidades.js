const db = require('../models');
const { Inventario } = db;
const { Op } = require("sequelize");

async function normalizeUnidades() {
    try {
        console.log("Starting normalization...");

        // Fetch all items
        const items = await Inventario.findAll();
        let updateCount = 0;

        for (const item of items) {
            if (item.unidad) {
                const original = item.unidad;
                const normalized = original.trim().toUpperCase();

                if (original !== normalized) {
                    // Update if different
                    await item.update({ unidad: normalized });
                    console.log(`Updated ID ${item.id_inventario}: "${original}" -> "${normalized}"`);
                    updateCount++;
                }
            }
        }

        console.log(`Normalization complete. Updated ${updateCount} records.`);

    } catch (error) {
        console.error("Error during normalization:", error);
    }
}

normalizeUnidades();
