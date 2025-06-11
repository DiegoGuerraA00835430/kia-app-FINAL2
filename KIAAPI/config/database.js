const { Sequelize } = require('sequelize');
require('dotenv').config({ path: '../.env' })


const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  port: parseInt(process.env.DB_PORT, 10),
 dialectOptions: {
  searchPath: 'kiadb',
    ssl: {
      require: true,        // Requiere SSL
      rejectUnauthorized: false // No valida el certificado (útil en ambientes de prueba)
    }
  },
  define: {
    schema: 'kiadb'
  },
  logging: false
});

module.exports = sequelize;