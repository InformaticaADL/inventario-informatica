'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('incubadora_historico', 'incubadora_id', {
            type: Sequelize.STRING,
            allowNull: true // Allow null initially for existing records, or false if empty
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('incubadora_historico', 'incubadora_id');
    }
};
