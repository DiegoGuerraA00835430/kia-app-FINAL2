const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Proveedor = sequelize.define('proveedor', {
    id_proveedor: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tipo_proveedor: {
        type: DataTypes.STRING,
        allowNull: false
    },
    autorizacion_semarnat: {
        type: DataTypes.STRING,
        allowNull: true
    },
    fecha_final_contrato: {
        type: DataTypes.DATE,
        allowNull: true
    },
    autorizacion_sct: {
      type: DataTypes.STRING,
      allowNull: true
    },
    responsable_tecnico: {
      type: DataTypes.STRING,
      allowNull: true
    },
}, {
  schema: 'kia-db',
  tableName: 'proveedores',
  freezeTableName: true,
  timestamps: false
});

Proveedor.associate = (models) => {
    Proveedor.hasMany(models.Manifesto, {
      foreignKey: 'id_proveedor_transporte',
      as: 'transportes'
    });

    Proveedor.hasMany(models.Manifesto, {
      foreignKey: 'id_proveedor_destino',
      as: 'destinos'
    });
  }

module.exports = Proveedor;