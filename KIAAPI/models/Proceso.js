const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Proceso = sequelize.define('proceso', {
  id_proceso: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
}, {
  schema: 'kia-db',
  freezeTableName: true,
  timestamps: false,
});

module.exports = Proceso;