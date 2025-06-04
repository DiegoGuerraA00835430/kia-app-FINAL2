module.exports = (sequelize, DataTypes) => {
  const ResiduoElemento = sequelize.define('residuo_elemento', {
    id_residuo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    id_elemento: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    }
  }, {
    schema: 'kiadb',
    tableName: 'residuo_elemento',
    timestamps: false
  });

  return ResiduoElemento;
};