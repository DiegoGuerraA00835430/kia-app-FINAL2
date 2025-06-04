
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
return MaterialType;
};