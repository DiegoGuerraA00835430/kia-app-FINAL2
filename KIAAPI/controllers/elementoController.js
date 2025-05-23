const Elemento = require('../models/Elemento');


// Agregar un nuevo elemento a la tabla
exports.actualizarFechaCambio = async (req, res) => {
    const { id_elemento } = req.body;

    if (!id_elemento) {
        return res.status(400).json({ error: 'Falta el id_elemento' });
    }

    try {
        const [updatedRows] = await Elemento.update(
            { fecha_cambio: new Date() },
            { where: { id_elemento } }
        );

        if (updatedRows === 0) {
            return res.status(404).json({ error: 'Elemento no encontrado' });
        }

        res.json({ message: 'Fecha de cambio actualizada' });
    } catch (err) {
        res.status(500).json({ error: 'Error actualizando la fecha', details: err.message });
    }
}

