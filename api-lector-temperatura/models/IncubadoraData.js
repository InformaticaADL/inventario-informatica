const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const IncubadoraData = sequelize.define('IncubadoraData', {
    // ID único compuesto: Fecha + Hora + Observación (para evitar duplicados al subir archivos repetidos)
    id_registro: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    incubadora_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fecha: {
      type: DataTypes.DATEONLY, // Solo la fecha (2025-11-01)
      allowNull: false
    },
    hora_intervalo: {
      type: DataTypes.TIME(0), // La hora del intervalo (02:00:00)
      allowNull: false
    },
    // --- MÉTRICAS (Orden según tu lista) ---
    temp_minima: DataTypes.FLOAT,      // 180 -> 18.0
    temp_maxima: DataTypes.FLOAT,      // 182 -> 18.2

    // Nombres actualizados (antes humedad_...)
    temp_minima_2: DataTypes.FLOAT,    // 172 -> 17.2
    temp_maxima_2: DataTypes.FLOAT,    // 185 -> 18.5

    tiempo_puerta: DataTypes.INTEGER,  // 0
    tiempo_motor: DataTypes.FLOAT,     // -380 -> -9.3
    tiempo_red: DataTypes.INTEGER,     // 0
    tiempo_alarma: DataTypes.INTEGER,  // 7200 (Ojo: ¿Es posible que 7200 sea Tiempo Red?)

    observaciones: DataTypes.STRING,   // "08-11 11:30 vremolcoy"
    createdAt: DataTypes.DATE(0),
    updatedAt: DataTypes.DATE(0)
  }, {
    tableName: 'incubadora_historico',
    timestamps: true
  });

  return IncubadoraData;
};