'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // 1. Rename humedad_minima -> temp_minima_2
        await queryInterface.sequelize.query(
            "EXEC sp_rename 'incubadora_historico.humedad_minima', 'temp_minima_2', 'COLUMN';"
        );

        // 2. Rename humedad_maxima -> temp_maxima_2
        await queryInterface.sequelize.query(
            "EXEC sp_rename 'incubadora_historico.humedad_maxima', 'temp_maxima_2', 'COLUMN';"
        );
    },

    async down(queryInterface, Sequelize) {
        // Revert names
        await queryInterface.sequelize.query(
            "EXEC sp_rename 'incubadora_historico.temp_minima_2', 'humedad_minima', 'COLUMN';"
        );
        await queryInterface.sequelize.query(
            "EXEC sp_rename 'incubadora_historico.temp_maxima_2', 'humedad_maxima', 'COLUMN';"
        );
    }
};
