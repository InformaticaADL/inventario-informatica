const sequelize = require('../db/SequelizeConfig');

async function addColumn() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // MSSQL Query to safely add column if it doesn't exist
        const query = `
      IF NOT EXISTS (
        SELECT * FROM sys.columns 
        WHERE object_id = OBJECT_ID(N'[dbo].[Inventario]') 
        AND name = 'licencia_windows'
      )
      BEGIN
        ALTER TABLE Inventario ADD licencia_windows VARCHAR(255);
      END
    `;

        console.log('Executing query...');
        await sequelize.query(query);
        console.log('Column licencia_windows checked/added successfully.');

    } catch (error) {
        console.error('Unable to add column:', error);
    } finally {
        // Close connection but give it a moment to finish pending queries just in case
        setTimeout(() => {
            sequelize.close();
            process.exit(0);
        }, 1000);
    }
}

addColumn();
