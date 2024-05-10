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


module.exports = router;
