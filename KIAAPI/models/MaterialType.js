const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const materialType = sequelize.define('material_type', {
  id_material_type: {
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
  tableName: 'material_type',
  freezeTableName: true,
  timestamps: false,
});

module.exports = materialType;