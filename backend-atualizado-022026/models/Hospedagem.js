const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Hospedagem = sequelize.define('Hospedagem', {
  id_hospedagem: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  id_hospede: { type: DataTypes.INTEGER, allowNull: false },
  id_quarto: { type: DataTypes.INTEGER, allowNull: false },
  dataEntrada: { type: DataTypes.DATEONLY, allowNull: false },
  dataSaida: { type: DataTypes.DATEONLY },
  diarias: { type: DataTypes.INTEGER },
  valorTotal: { type: DataTypes.DECIMAL(10, 2) },
  observacoes: { type: DataTypes.TEXT },
  status: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'aberta' }
}, { tableName: 'Hospedagem', timestamps: false });

module.exports = Hospedagem;
