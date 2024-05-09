const express = require('express');
const router = express.Router();
const pool = require('../db');

// Ruta para obtener todas las palabras
router.get('/', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM palabra');
        res.json(resultado.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error del servidor al obtener las palabras");
    }
});

// Ruta para agregar una nueva palabra
router.post('/', async (req, res) => {
    try {
        const { texto } = req.body;
        const nuevaPalabra = await pool.query(
            'INSERT INTO palabra (texto) VALUES ($1) RETURNING *',
            [texto]
        );
        res.json(nuevaPalabra.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error del servidor al agregar la palabra");
    }
});

module.exports = router;
