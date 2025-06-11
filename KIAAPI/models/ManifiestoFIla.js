module.exports = (sequelize, DataTypes) => {
  const ManifiestoFila = sequelize.define("ManifiestoFila", {
    documento_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nombre: DataTypes.STRING,
    cantidad: DataTypes.STRING,
    contenedor: DataTypes.STRING,
    peso: DataTypes.STRING,
    codigo: DataTypes.STRING
  }, {
    tableName: "manifiesto_filas",
    timestamps: true
  });

  ManifiestoFila.associate = (models) => {
    ManifiestoFila.belongsTo(models.Documento, {
      foreignKey: "documento_id",
      as: "documento"
    });
  };

  return ManifiestoFila;
};
