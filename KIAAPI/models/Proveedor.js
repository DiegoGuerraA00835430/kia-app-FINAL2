module.exports = (sequelize, DataTypes) => {
const Proveedor = sequelize.define('Proveedor', {
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
  schema: 'kiadb',
  tableName: 'proveedores',
  freezeTableName: true,
  timestamps: false
});

Proveedor.associate = (models) => {
    Proveedor.hasMany(models.Manifiesto, {
      foreignKey: 'id_proveedor_transporte',
      as: 'transportes'
    });

    Proveedor.hasMany(models.Manifiesto, {
      foreignKey: 'id_proveedor_destino',
      as: 'destinos'
    });
  }
return Proveedor;
};
