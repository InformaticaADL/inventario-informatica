const sequelize = require('./db/SequelizeConfig');

async function alterTable() {
    try {
        await sequelize.query("ALTER TABLE impresoras ADD valor_neto VARCHAR(255) NULL");
        console.log("Column valor_neto added successfully.");
    } catch (e) {
        console.error("Error adding column:", e.message);
    }
    process.exit(0);
}

alterTable();
