
module.exports = (sequelize, DataTypes) => {
const Container = sequelize.define('Container', {
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
  schema: 'kiadb',
  freezeTableName: true,
  tableName: 'container_type',
  timestamps: false,
});
  return Container;
};