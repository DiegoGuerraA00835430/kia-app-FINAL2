module.exports = (sequelize, DataTypes) => {
  const Manifiesto = sequelize.define('Manifiesto', {
    id_manifiesto: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fecha_emision: {
      type: DataTypes.DATE,
      defaultValue: null
    },
    id_residuo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_empleado: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_proveedor_destino: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_proveedor_transporte: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_manejo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_proceso: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_container_type: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    schema: 'kiadb',
    tableName: 'manifiesto',
    freezeTableName: true,
    timestamps: false
  });

  Manifiesto.associate = (models) => {
    Manifiesto.belongsTo(models.Residuo, {
      foreignKey: 'id_residuo',
      as: 'residuo'
    });

    Manifiesto.belongsTo(models.Empleado, {
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

    Manifiesto.belongsTo(models.Container, {
      foreignKey: 'id_container_type',
      as: 'container'
    });
  };

  return Manifiesto;
};
