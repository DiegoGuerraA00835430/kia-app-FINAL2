const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Residuo = sequelize.define('residuo', {
    id_residuo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_material_type: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    cantidad: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    fecha_generacion: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    schema: 'kia-db',
    tableName: 'residuos',
    freezeTableName: true,
    timestamps: false,
});

Residuo.associate = (models) => {
    Residuo.belongsTo(models.Elemento, {
        foreignKey: 'id_elemento',
        as: 'elemento',
    });

    Residuo.belongsTo(models.Material_type, {
        foreignKey: 'id_material_type',
        as: 'materialType',
    });
}

Residuo.belongsToMany(Elemento, {
  through: 'residuo_elemento',
  as: 'elementos',
  foreignKey: 'id_residuo',
  otherKey: 'id_elemento'
});

module.exports = Residuo;