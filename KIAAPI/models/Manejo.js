const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Manejo = sequelize.define('manejo', {
  id_manejo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  manejo: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
}, {
  schema: 'kia-db',
  freezeTableName: true,
  timestamps: false,
});

module.exports = Manejo;