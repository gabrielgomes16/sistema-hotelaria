const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Manutencao = sequelize.define('Manutencao', {
  id_manutencao: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  id_quarto: { type: DataTypes.INTEGER, allowNull: false },
  problema: { type: DataTypes.STRING(50)},
  observacoes: { type: DataTypes.TEXT }
}, { tableName: 'Manutencao', timestamps: false });

module.exports = Manutencao;
