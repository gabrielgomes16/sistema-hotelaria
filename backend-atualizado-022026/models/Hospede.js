const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Hospede = sequelize.define('Hospede', {
  id_hospede: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nome: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(100) },
  telefone: { type: DataTypes.STRING(20) },
  cpf: { type: DataTypes.STRING(14) }
}, { tableName: 'Hospede', timestamps: false });

module.exports = Hospede;
