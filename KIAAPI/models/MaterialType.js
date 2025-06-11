module.exports = (sequelize, DataTypes) => {
  const MaterialType = sequelize.define('Material_type', {
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
    schema: 'kiadb',
    tableName: 'material_type',
    freezeTableName: true,
    timestamps: false,
  });

  MaterialType.associate = (models) => {
    MaterialType.belongsToMany(models.Elemento, {
      through: models.MaterialTypeElemento,
      as: 'elementos',
      foreignKey: 'id_material_type',
      otherKey: 'id_elemento'
    });
  };

  return MaterialType;
};
