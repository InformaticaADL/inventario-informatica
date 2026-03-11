const sequelizeInstance = require('./db/SequelizeConfig');

const addTipoColumn = async () => {
    try {
        await sequelizeInstance.query(`
            ALTER TABLE impresoras 
            ADD tipo VARCHAR(50) DEFAULT 'Impresora';
        `);
        console.log("Columna 'tipo' agregada correctamente a la tabla 'impresoras'.");
        process.exit(0);
    } catch (error) {
        // If it already exists, SQL Server will throw an error, we catch it
        if (error.message.includes("already has a")) {
            console.log("La columna 'tipo' ya existe.");
            process.exit(0);
        } else {
            console.error("Error al alterar la tabla:", error.message);
            process.exit(1);
        }
    }
};

addTipoColumn();
