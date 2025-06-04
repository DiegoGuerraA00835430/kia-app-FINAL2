
module.exports = (sequelize, DataTypes) => {
const Empleado = sequelize.define('Empleado', {
  id_empleado: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cargo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contrasena: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fecha_registro: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  numero_empleado: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: {
        args: [8, 8],
        msg: 'El número de empleado debe tener exactamente 8 dígitos'
      },
      is: {
        args: /^\d{8}$/,
        msg: 'Solo se permiten números en el número de empleado'
      }
    }
  }
}, {
  schema: 'kiadb',
  tableName: 'empleado',
  freezeTableName: true,
  timestamps: false
});
return Empleado;
};