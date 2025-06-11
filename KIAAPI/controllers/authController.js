const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Empleado } = require('../models');  // ✅ modelo correcto

const JWT_SECRET = process.env.JWT_SECRET || 'secreto123';

// Login
exports.login = async (req, res) => {
    const { numero_empleado, contrasena } = req.body;
    console.log('Login intento:', { numero_empleado, contrasena });

    const usuario = await Empleado.findOne({ where: { numero_empleado } });

    if (!usuario) return res.status(401).send('Usuario no encontrado');

    const esValido = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!esValido) return res.status(401).send('Contraseña incorrecta');

    const token = jwt.sign({ 
        id: usuario.id_empleado, 
        numero_empleado: usuario.numero_empleado,
        cargo: usuario.cargo
    }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
};

// Crear Usuario
exports.crearUsuario = async (req, res) => {
    const { nombre, cargo, numero_empleado, contrasena } = req.body;
    console.log(req.body);

    try {
        if (!nombre || !numero_empleado || !contrasena) {
            return res.status(400).send('Faltan campos requeridos');
        }

        // Cambiado Usuario -> Empleado aquí
        const existe = await Empleado.findOne({ where: { numero_empleado } });
        if (existe) {
            return res.status(400).send('El numero de empleado ya está registrado');
        }

        const hashedPassword = await bcrypt.hash(contrasena, 10);

        // Cambiado Usuario -> Empleado aquí también
        const nuevoUsuario = await Empleado.create({
            nombre,
            cargo: cargo || 'Auditor',
            contrasena: hashedPassword,
            numero_empleado
        });

        const token = jwt.sign({ 
            id: nuevoUsuario.id_empleado, 
            numero_empleado: nuevoUsuario.numero_empleado,
            cargo: nuevoUsuario.cargo
        }, JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ 
            mensaje: 'Usuario creado correctamente', 
            usuario: {
                id: nuevoUsuario.id_empleado, 
                nombre: nuevoUsuario.nombre, 
                numero_empleado: nuevoUsuario.numero_empleado
            }, 
            token: token 
        });

    } catch (error) {
        console.error('Error al crear el usuario:', error);
        res.status(500).send('Error al crear el usuario');
    }
};

// Ruta protegida (perfil)
exports.perfil = async (req, res) => {
    res.json({ mensaje: 'Ruta protegida', usuario: req.usuario });
};
