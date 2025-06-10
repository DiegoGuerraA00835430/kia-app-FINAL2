module.exports = (sequelize, DataTypes) => {
  const Documento = sequelize.define("Documento", {
    numero: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ruta_excel: DataTypes.STRING,
    ruta_pdf: DataTypes.STRING
  }, {
    tableName: "documentos",
    timestamps: true
  });

  Documento.associate = (models) => {
    Documento.hasMany(models.ManifiestoFila, {
      foreignKey: "documento_id",
      as: "filas"
    });
  };

  return Documento;
};
