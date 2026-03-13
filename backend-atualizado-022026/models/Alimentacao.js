const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Alimentacao = sequelize.define('Alimentacao', {
  id_alimentacao: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  id_quarto: { type: DataTypes.INTEGER, allowNull: false },
  quantidade: { type: DataTypes.STRING(10), allowNull: false }, 
  prato: {type: DataTypes.STRING(50)},
  preco: { type: DataTypes.DECIMAL(10, 2) },
  observacoes: { type: DataTypes.TEXT }
}, { tableName: 'Alimentacao', timestamps: false });

module.exports = Alimentacao;