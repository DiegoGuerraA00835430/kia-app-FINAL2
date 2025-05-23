
const Manifesto = require('../models/Manifesto');
const residuo = require('../models/Residuo');
const Usuario = require('../models/Usuario');
const Proveedor = require('../models/Proveedor');
const Manejo = require('../models/Manejo');
const Proceso = require('../models/Proceso');

exports.crearManifiesto = async (req, res) => {
    try {
        const{
            id_residuo,
            id_empleado,
            id_proveedor_destino,
            id_proveedor_transporte,
            id_manejo,
            id_proceso,
            fecha_emision
        } = req.body;
        console.log(req.body);

        const residuo = await Residuo.findByPk(id_residuo);
        if (!residuo) {
            return res.status(400).json({ error: 'Residuo invalido' });
        }

        const empleado = await Empleado.findByPk(id_empleado);
        if (!empleado) {
            return res.status(400).json({ error: 'Empleado invalido' });
        }

        const proveedorDestino = await Proveedor.findByPk(id_proveedor_destino);
        if (!proveedorDestino) {
            return res.status(400).json({ error: 'Proveedor de destino invalido' });
        }

        const proveedorTransporte = await Proveedor.findByPk(id_proveedor_transporte);
        if (!proveedorTransporte) {
            return res.status(400).json({ error: 'Proveedor de transporte invalido' });
        }

        const manejo = await Manejo.findByPk(id_manejo);
        if (!manejo) {
            return res.status(400).json({ error: 'Manejo invalido' });
        }

        const proceso = await Proceso.findByPk(id_proceso);
        if (!proceso) {
            return res.status(400).json({ error: 'Proceso invalido' });
        }

        const nuevoManifiesto = await Manifiesto.create({
            id_residuo,
            id_empleado,
            id_proveedor_destino,
            id_proveedor_transporte,
            id_manejo,
            id_proceso,
            fecha_emision
        });

        res.status(201).json(nuevoManifiesto);
    } catch (error) {
        console.error('Error al crear el manifiesto:', error);
        res.status(500).json({ error: 'Error al crear el manifiesto' });
    }

};

