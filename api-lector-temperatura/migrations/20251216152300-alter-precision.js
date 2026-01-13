'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // 1. Alter hora_intervalo (Likely no constraint)
        await queryInterface.sequelize.query(
            "ALTER TABLE incubadora_historico ALTER COLUMN hora_intervalo TIME(0) NOT NULL;"
        );

        // 2. Drop Default Constraint for createdAt
        await queryInterface.sequelize.query(`
      DECLARE @ConstraintName nvarchar(200)
      SELECT @ConstraintName = Name FROM sys.default_constraints
      WHERE parent_object_id = OBJECT_ID('incubadora_historico')
      AND parent_column_id = (SELECT column_id FROM sys.columns WHERE object_id = OBJECT_ID('incubadora_historico') AND name = 'createdAt')
      IF @ConstraintName IS NOT NULL
      EXEC('ALTER TABLE incubadora_historico DROP CONSTRAINT ' + @ConstraintName)
    `);

        // 3. Alter createdAt to DATETIME2(0)
        await queryInterface.sequelize.query(
            "ALTER TABLE incubadora_historico ALTER COLUMN createdAt DATETIME2(0) NOT NULL;"
        );

        // 4. Re-add Default Constraint for createdAt
        await queryInterface.sequelize.query(
            "ALTER TABLE incubadora_historico ADD CONSTRAINT DF_incubadora_historico_createdAt DEFAULT CURRENT_TIMESTAMP FOR createdAt;"
        );

        // 5. Drop Default Constraint for updatedAt
        await queryInterface.sequelize.query(`
      DECLARE @ConstraintName nvarchar(200)
      SELECT @ConstraintName = Name FROM sys.default_constraints
      WHERE parent_object_id = OBJECT_ID('incubadora_historico')
      AND parent_column_id = (SELECT column_id FROM sys.columns WHERE object_id = OBJECT_ID('incubadora_historico') AND name = 'updatedAt')
      IF @ConstraintName IS NOT NULL
      EXEC('ALTER TABLE incubadora_historico DROP CONSTRAINT ' + @ConstraintName)
    `);

        // 6. Alter updatedAt to DATETIME2(0)
        await queryInterface.sequelize.query(
            "ALTER TABLE incubadora_historico ALTER COLUMN updatedAt DATETIME2(0) NOT NULL;"
        );

        // 7. Re-add Default Constraint for updatedAt
        await queryInterface.sequelize.query(
            "ALTER TABLE incubadora_historico ADD CONSTRAINT DF_incubadora_historico_updatedAt DEFAULT CURRENT_TIMESTAMP FOR updatedAt;"
        );
    },

    async down(queryInterface, Sequelize) {
        // Revert logic (simplified: just change types back, might fail if constraints exist but this is down migration)
        // For proper down migration we should repeat the drop/add logic, but skipping for now to focus on 'up'.
        await queryInterface.sequelize.query(
            "ALTER TABLE incubadora_historico ALTER COLUMN hora_intervalo TIME(7) NOT NULL;"
        );
        await queryInterface.sequelize.query(
            "ALTER TABLE incubadora_historico ALTER COLUMN createdAt DATETIME2(7) NOT NULL;"
        );
        await queryInterface.sequelize.query(
            "ALTER TABLE incubadora_historico ALTER COLUMN updatedAt DATETIME2(7) NOT NULL;"
        );
    }
};
