const express = require('express');
const router = express.Router();
const pool = require('../db');

// Ruta para obtener todas las palabras
router.get('/getPalabras', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM palabra');
        // Transformar cada palabra para que la primera letra sea mayúscula
        const palabrasModificadas = resultado.rows.map(palabra => {
            return {
                ...palabra,
                texto: palabra.texto.charAt(0).toUpperCase() + palabra.texto.slice(1)
            };
        });
        res.json(palabrasModificadas);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error del servidor al obtener las palabras");
    }
});


// Ruta para agregar una nueva palabra
router.post('/postPalabras', async (req, res) => {
    try {
        // Convertir la palabra entrante a minúsculas
        const texto = req.body.texto.toLowerCase();

        // Verificar si la palabra ya existe en la base de datos
        const existe = await pool.query(
            'SELECT * FROM palabra WHERE texto = $1',
            [texto]
        );

        // Si la palabra ya existe, no insertar y enviar un mensaje
        if (existe.rows.length > 0) {
            return res.status(400).json({ mensaje: 'La palabra ya existe' });
        }

        // Insertar la nueva palabra si no existe
        const nuevaPalabra = await pool.query(
            'INSERT INTO palabra (texto) VALUES ($1) RETURNING *',
            [texto]
        );

        // Devolver un mensaje personalizado junto con la palabra insertada
        res.json({ palabra: nuevaPalabra.rows[0], mensaje: `La palabra '${texto}' se agregó correctamente` });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error del servidor al agregar la palabra");
    }
});

// Ruta para eliminar una palabra
router.delete('/deletePalabra/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deleteQuery = 'DELETE FROM palabra WHERE id_palabra = $1';
        const response = await pool.query(deleteQuery, [id]);

        if (response.rowCount === 0) {
            return res.status(404).json({ mensaje: "Palabra no encontrada" });
        }

        res.json({ mensaje: "Palabra eliminada correctamente" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error del servidor al eliminar la palabra");
    }
});

//ruta para Editar una palabra
router.put('/updatePalabra/:id', async (req, res) => {
    const { id } = req.params;
    const texto = req.body.texto.toLowerCase();

    if (!texto) {
        return res.status(400).json({ mensaje: "El texto de la palabra es necesario para actualizar" });
    }

    try {
        const updateQuery = 'UPDATE palabra SET texto = $1 WHERE id_palabra = $2 RETURNING *';
        const response = await pool.query(updateQuery, [texto, id]);

        if (response.rows.length === 0) {
            return res.status(404).json({ mensaje: "Palabra no encontrada para actualizar" });
        }

        res.json({ palabra: response.rows[0], mensaje: "Palabra actualizada correctamente" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error del servidor al actualizar la palabra");
    }
});



module.exports = router;
