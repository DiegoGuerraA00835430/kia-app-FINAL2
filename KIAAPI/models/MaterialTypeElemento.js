module.exports = (sequelize, DataTypes) => {
  const MaterialTypeElemento = sequelize.define('MaterialTypeElemento', {
    id_material_type: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    id_elemento: {
      type: DataTypes.INTEGER,
      primaryKey: true
    }
  }, {
    schema: 'kiadb',
    tableName: 'material_type_elemento',
    freezeTableName: true,
    timestamps: false
  });

  return MaterialTypeElemento;
};
