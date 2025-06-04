
module.exports = (sequelize, DataTypes) => {
const Proceso = sequelize.define('Proceso', {
  id_proceso: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
}, {
  schema: 'kiadb',
  tableName: 'proceso',
  freezeTableName: true,
  timestamps: false,
});
return Proceso;
};