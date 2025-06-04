
module.exports = (sequelize, DataTypes) => {
const Manejo = sequelize.define('Manejo', {
  id_manejo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  manejo: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
}, {
  schema: 'kiadb',
  tableName: 'manejo',
  freezeTableName: true,
  timestamps: false,
});
return Manejo;
};