require("dotenv").config({ path: '../.env' });
const express = require('express');
const app = express();
const cors = require('cors')
const port = process.env.PORT || 4003;
const sequelize = require('./config/database');
const usuarioRoutes = require('./routes/usuarioRoutes');
const authRoutes = require('./routes/authRoutes');
const elementoRoutes = require('./routes/elementoRoutes');
const manifestoRoutes = require('./routes/manifestoRoutes');


app.use(cors({
   origin: 'http://localhost:3000',
  credentials: true
}
));
// Middleware para JSON
app.use(express.json());

// Rutas
app.use('/api', usuarioRoutes);
app.use('/api', authRoutes);
app.use('/api', elementoRoutes);
app.use('/api', manifestoRoutes);


// Conexión y servidor
sequelize.sync()
  .then(() => {
    console.log('Conexión a base de datos exitosa');
    app.listen(port, () => {
      console.log('Servidor corriendo');
    });
  })
  .catch(error => console.error('Error al conectar:', error));




