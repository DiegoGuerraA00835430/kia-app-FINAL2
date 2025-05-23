const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Container = sequelize.define('container', {
  id_container_type: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
}, {
  schema: 'kia-db',
  freezeTableName: true,
  tableName: 'container_type',
  timestamps: false,
});

module.exports = Container;