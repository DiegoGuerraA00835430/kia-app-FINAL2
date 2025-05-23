const { Sequelize } = require('sequelize');
require('dotenv').config({ path: '../.env' })


const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  port: process.env.DB_PORT,
 dialectOptions: {
    ssl: {
      require: true,        // Requiere SSL
      rejectUnauthorized: false // No valida el certificado (útil en ambientes de prueba)
    }
  },
  logging: false
});

module.exports = sequelize;




