module.exports = (sequelize, DataTypes) => {
  const ManifiestoTemp = sequelize.define("ManifiestoTemp", {
    nombre: { type: DataTypes.STRING, allowNull: false },
    cantidad: { type: DataTypes.STRING, allowNull: false },
    contenedor: { type: DataTypes.STRING, allowNull: false },
    peso: DataTypes.STRING,
    codigo: DataTypes.STRING
  }, {
    tableName: "manifiesto_temp",
    timestamps: true
  });

  return ManifiestoTemp;
};