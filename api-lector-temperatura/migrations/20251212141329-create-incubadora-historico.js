'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('incubadora_historico', {
      // ID compuesto: Fecha + Hora + Observación
      id_registro: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },
      fecha: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      hora_intervalo: {
        type: Sequelize.TIME,
        allowNull: false
      },
      // --- MÉTRICAS ---
      temp_minima: {
        type: Sequelize.FLOAT
      },
      temp_maxima: {
        type: Sequelize.FLOAT
      },
      humedad_minima: {
        type: Sequelize.FLOAT
      },
      humedad_maxima: {
        type: Sequelize.FLOAT
      },
      tiempo_puerta: {
        type: Sequelize.INTEGER
      },
      tiempo_motor: {
        type: Sequelize.INTEGER
      },
      tiempo_red: {
        type: Sequelize.INTEGER
      },
      tiempo_alarma: {
        type: Sequelize.INTEGER
      },
      observaciones: {
        type: Sequelize.STRING
      },
      // Timestamps requeridos por Sequelize (timestamps: true)
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('incubadora_historico');
  }
};