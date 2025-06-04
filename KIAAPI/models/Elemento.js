module.exports = (sequelize, DataTypes) => {
  const Elemento = sequelize.define('Elemento', {
    id_elemento: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    elemento: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [1, 2],
          msg: 'El elemento debe tener entre 1 y 2 letras'
        },
        is: {
          args: [/^[a-zA-Z]{1,2}$/],
          msg: 'El elemento solo puede contener letras (A-Z)'
        }
      }
    },
    fecha_cambio: {
      type: DataTypes.DATE,
      allowNull: false,
    }
  }, {
    schema: 'kiadb',
    tableName: 'elemento',
    freezeTableName: true,
    timestamps: false
  });

  Elemento.associate = (models) => {
    Elemento.belongsToMany(models.Residuo, {
      through: models.residuo_elemento,
      as: 'residuos',
      foreignKey: 'id_elemento',
      otherKey: 'id_residuo'
    });
  };

  return Elemento;
};
