const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('sistema', 'postgres', 'banco123', {
  host: 'localhost',
  dialect: 'postgres'
});

module.exports = sequelize;