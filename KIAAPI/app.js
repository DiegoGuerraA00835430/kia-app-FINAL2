require("dotenv").config(); // Busca en la misma carpeta
const express = require('express');
const app = express();
const cors = require('cors')
const port = process.env.PORT || 4002;
const sequelize = require('./config/database');
const usuarioRoutes = require('./routes/usuarioRoutes');
const authRoutes = require('./routes/authRoutes');
const elementoRoutes = require('./routes/elementoRoutes');
const manifestoRoutes = require('./routes/manifestoRoutes');
const datosInicialesRoutes = require('./routes/datosInicialesUnityRoutes');
const proveedorRoutes = require('./routes/proveedorRoutes');
const documentoRoutes = require("./routes/documentoRoutes");

app.use(cors({
   origin: 'http://localhost:3000',
  credentials: true
}
));



// Middleware para JSON
app.use(express.json());

// Rutas
app.use('/api', authRoutes);
app.use('/api', elementoRoutes);
app.use('/api', manifestoRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/proveedores', proveedorRoutes);
app.use('/api/datos-iniciales', datosInicialesRoutes);
app.use("/api", documentoRoutes);



// Conexión y servidor
sequelize.sync()
  .then(() => {
    console.log('Conexión a base de datos exitosa');
    app.listen(port, () => {
      console.log('Servidor corriendo');
    });
  })
  .catch(error => console.error('Error al conectar:', error));