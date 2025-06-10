const { Sequelize } = require('sequelize');
require('dotenv').config({ path: './.env' })

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  port: parseInt(process.env.DB_PORT, 10),
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: false
});

// Initialize database connection and create schema
const initDatabase = async () => {
  try {
    // First, try to connect
    await sequelize.authenticate();
    console.log('Database connection established.');

    // Then create schema if it doesn't exist
    await sequelize.query('CREATE SCHEMA IF NOT EXISTS kiadb;');
    console.log('Schema created or verified.');

    // Set search path
    await sequelize.query('SET search_path TO kiadb;');
    console.log('Search path set to kiadb.');

    return true;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return false;
  }
};

// Initialize the database
initDatabase();

// Add schema to model options
sequelize.options.define = {
  schema: 'kiadb'
};

module.exports = sequelize;




