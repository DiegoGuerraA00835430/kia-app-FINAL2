const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

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
  schema: 'kia-db',
  freezeTableName: true,
  timestamps: false
});

module.exports = Elemento;