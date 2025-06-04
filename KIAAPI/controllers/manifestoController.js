
const Manifesto = require('../models/Manifesto');
const Residuo = require('../models/Residuo');
const Usuario = require('../models/Usuario');
const Proveedor = require('../models/Proveedor');
const Manejo = require('../models/Manejo');
const Proceso = require('../models/Proceso');
const Container = require('../models/Container');

exports.crearManifiesto = async (req, res) => {
    try {
        const{
            id_residuo,
            id_empleado,
            id_proveedor_destino,
            id_proveedor_transporte,
            id_manejo,
            id_proceso,
            id_container_type,
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

        const container = await Container.findByPk(id_container_type);
        if (!container) {
            return res.status(400).json({ error: 'Container invalido' });
        }

        const nuevoManifiesto = await Manifiesto.create({
            id_residuo,
            id_empleado,
            id_proveedor_destino,
            id_proveedor_transporte,
            id_manejo,
            id_proceso,
            id_container_type,
            fecha_emision
        });
        console.log('Manifiesto creado:', nuevoManifiesto);
    } catch (error) {
        console.error('Error al crear el manifiesto:', error);
        res.status(500).json({ error: 'Error al crear el manifiesto' });
    }

    const manifiestoCompleto = await Manifesto.findByPk(nuevoManifiesto.id, {
      include: [
        {
          model: Residuo,
          as: 'residuo',
          attributes: ['nombre_residuo', 'fecha_ingreso', 'cantidad'],
          include: [
          {
            model: Elemento,
            as: 'elementos',
            attributes: ['elemento']
          }
      ]
        },
        {
          model: Usuario,
          as: 'empleado',
          attributes: ['nombre']
        },
        {
          model: Proveedor,
          as: 'destinos',
          attributes: ['nombre','autorizacion_semarnat',]
        },
        {
          model: Proveedor,
          as: 'transportes',
          attributes: ['nombre','autorizacion_semarnat','autorizacion_sct']
        },
        {
          model: Manejo,
          as: 'manejo',
          attributes: ['tipo_manejo']
        },
        {
          model: Proceso,
          as: 'proceso',
          attributes: ['nombre_proceso']
        },
        {
          model: Container,
          as: 'container',
          attributes: ['nombre']
        }
      ]
    });

    return res.status(201).json({
      mensaje: 'Manifiesto creado correctamente',
      manifiesto: manifiestoCompleto
    });
    
}

// Actualizar el residuo asociado al manifiesto
    exports.cambiarResiduoManifiesto = async (req, res) => {
      const { id_manifiesto } = req.params;
      const { id_residuo_nuevo } = req.body;

      try {
        const manifiesto = await Manifesto.findByPk(id_manifiesto);
        if (!manifiesto) {
          return res.status(404).json({ error: 'Manifiesto no encontrado' });
        }

        await manifiesto.update({ id_residuo: id_residuo_nuevo });
        res.status(200).json({ message: 'Residuo del manifiesto actualizado', manifiesto });
      } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el manifiesto', details: error.message });
      }
};
