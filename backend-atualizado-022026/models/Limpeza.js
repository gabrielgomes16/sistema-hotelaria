const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Limpeza = sequelize.define('Limpeza', {
  id_limpeza: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  id_quarto: { type: DataTypes.INTEGER, allowNull: false },
  tipo: {type: DataTypes.STRING(50) },
  observacoes: { type: DataTypes.TEXT },
  status: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'aberto' }
}, { tableName: 'Limpeza', timestamps: false });

module.exports = Limpeza;
