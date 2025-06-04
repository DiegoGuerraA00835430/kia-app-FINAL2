module.exports = (sequelize, DataTypes) => {
  const Residuo = sequelize.define('Residuo', {
    id_residuo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_material_type: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cantidad: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    fecha_generacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    schema: 'kiadb',
    tableName: 'residuos',
    freezeTableName: true,
    timestamps: false,
  });

  Residuo.associate = (models) => {
    Residuo.belongsTo(models.Material_type, {
      foreignKey: 'id_material_type',
      as: 'materialType',
    });

    Residuo.belongsToMany(models.Elemento, {
      through: models.residuo_elemento,
      as: 'elementos',
      foreignKey: 'id_residuo',
      otherKey: 'id_elemento'
    });
  };

  return Residuo;
};
