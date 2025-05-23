const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Manifiesto = sequelize.define('manifiesto', {
  id_manifesto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fecha_emision: {
    type : DataTypes.DATE,
    defaultValue: null
  },

}, {
  schema: 'kia-db',
  freezeTableName: true,
  timestamps: false
});

Manifiesto.associate = (models) => {
    Manifiesto.belongsTo(models.Residuo, {
        foreignKey: 'id_residuo',
        as: 'residuo'
    });

    Manifiesto.belongsTo(models.Usuario, {
        foreignKey: 'id_empleado',
        as: 'empleado'
    });

    Manifiesto.belongsTo(models.Proveedor, {
        foreignKey: 'id_proveedor_destino',
        as: 'proveedorDestino'
    });

    Manifiesto.belongsTo(models.Proveedor, {
        foreignKey: 'id_proveedor_transporte',
        as: 'proveedorTransporte'
    });

    Manifiesto.belongsTo(models.Manejo, {
        foreignKey: 'id_manejo',
        as: 'manejo'
    });

    Manifiesto.belongsTo(models.Proceso, {
        foreignKey: 'id_proceso',
        as: 'proceso'
    });
}

module.exports = Manifiesto;