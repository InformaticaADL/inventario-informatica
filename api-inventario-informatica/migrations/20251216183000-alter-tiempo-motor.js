'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // Alter tiempo_motor to FLOAT
        await queryInterface.sequelize.query(
            "ALTER TABLE incubadora_historico ALTER COLUMN tiempo_motor FLOAT;"
        );
    },

    async down(queryInterface, Sequelize) {
        // Revert to INTEGER
        await queryInterface.sequelize.query(
            "ALTER TABLE incubadora_historico ALTER COLUMN tiempo_motor INTEGER;"
        );
    }
};
