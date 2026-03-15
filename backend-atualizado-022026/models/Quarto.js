const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Quarto = sequelize.define('Quarto', {
  id_quarto: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  descricao: { type: DataTypes.STRING(255) },
  status: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'disponível',
    validate: {
      isIn: [['disponível', 'ocupado', 'manutenção']]
    }
  },
  numero: { type: DataTypes.STRING(10), allowNull: false },
  tipo: { type: DataTypes.STRING(50) },
  preco: { type: DataTypes.DECIMAL(10, 2) }
}, { tableName: 'Quarto', timestamps: false });

module.exports = Quarto;