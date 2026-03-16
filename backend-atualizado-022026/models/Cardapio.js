const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cardapio = sequelize.define('Cardapio', {
  id_cardapio: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nome: { type: DataTypes.STRING(100), allowNull: false },
  preco: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
}, { tableName: 'Cardapio', timestamps: false });

module.exports = Cardapio;
