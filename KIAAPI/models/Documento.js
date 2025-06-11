module.exports = (sequelize, DataTypes) => {
  const Documento = sequelize.define("Documento", {
    nombre_archivo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ruta_excel: {
      type: DataTypes.STRING
    },
    ruta_pdf: {
      type: DataTypes.STRING
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: "documentos",
    timestamps: false
  });

  return Documento;
};
