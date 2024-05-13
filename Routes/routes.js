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

// Ruta para obtener todas las categorías
router.get('/getCategorias', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM categoria');
        const categoriasModificadas = resultado.rows.map(categoria => {
            return {
                ...categoria,
                nombre: categoria.nombre.charAt(0).toUpperCase() + categoria.nombre.slice(1)
            };
        });
        res.json(categoriasModificadas);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error del servidor al obtener las categorías");
    }
});

// Ruta para agregar una nueva categoría
router.post('/postCategorias', async (req, res) => {
    try {
        const nombre = req.body.nombre.toLowerCase();

        const existe = await pool.query(
            'SELECT * FROM categoria WHERE nombre = $1',
            [nombre]
        );

        if (existe.rows.length > 0) {
            return res.status(400).json({ mensaje: 'La categoría ya existe' });
        }

        const nuevaCategoria = await pool.query(
            'INSERT INTO categoria (nombre) VALUES ($1) RETURNING *',
            [nombre]
        );

        res.json({ categoria: nuevaCategoria.rows[0], mensaje: `La categoría '${nombre}' se agregó correctamente` });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error del servidor al agregar la categoría");
    }
});

// Ruta para eliminar una categoría
router.delete('/deleteCategoria/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deleteQuery = 'DELETE FROM categoria WHERE id_categoria = $1';
        const response = await pool.query(deleteQuery, [id]);

        if (response.rowCount === 0) {
            return res.status(404).json({ mensaje: "Categoría no encontrada" });
        }

        res.json({ mensaje: "Categoría eliminada correctamente" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error del servidor al eliminar la categoría");
    }
});

// Ruta para actualizar una categoría
router.put('/updateCategoria/:id', async (req, res) => {
    const { id } = req.params;
    const nombre = req.body.nombre.toLowerCase();

    if (!nombre) {
        return res.status(400).json({ mensaje: "El nombre de la categoría es necesario para actualizar" });
    }

    try {
        const updateQuery = 'UPDATE categoria SET nombre = $1 WHERE id_categoria = $2 RETURNING *';
        const response = await pool.query(updateQuery, [nombre, id]);

        if (response.rows.length === 0) {
            return res.status(404).json({ mensaje: "Categoría no encontrada para actualizar" });
        }

        res.json({ categoria: response.rows[0], mensaje: "Categoría actualizada correctamente" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error del servidor al actualizar la categoría");
    }
});

// Ruta para asociar una palabra con una categoría
router.post('/asociarPalabraCategoria', async (req, res) => {
    const { id_palabra, id_categoria } = req.body;

    if (!id_palabra || !id_categoria) {
        return res.status(400).json({ mensaje: "Se requieren tanto el id de la palabra como el id de la categoría" });
    }

    try {
        // Verificar si la asociación ya existe
        const existente = await pool.query(
            'SELECT * FROM palabras_por_categoria WHERE id_palabra = $1 AND id_categoria = $2',
            [id_palabra, id_categoria]
        );

        if (existente.rows.length > 0) {
            return res.status(400).json({ mensaje: 'Esta palabra ya está asociada a esta categoría' });
        }

        // Crear la nueva asociación
        const nuevaAsociacion = await pool.query(
            'INSERT INTO palabras_por_categoria (id_palabra, id_categoria) VALUES ($1, $2) RETURNING *',
            [id_palabra, id_categoria]
        );

        res.json({ asociacion: nuevaAsociacion.rows[0], mensaje: "Asociación creada correctamente" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error del servidor al crear la asociación");
    }
});

// Ruta para desvincular una palabra de una categoría
router.delete('/desvincularPalabraCategoria', async (req, res) => {
    const { id_palabra, id_categoria } = req.body; // Asumimos que los IDs se envían en el cuerpo de la solicitud

    if (!id_palabra || !id_categoria) {
        return res.status(400).json({ mensaje: "Se requieren el ID de la palabra y el ID de la categoría para desvincular" });
    }

    try {
        // Eliminar la asociación específica
        const deleteQuery = 'DELETE FROM palabras_por_categoria WHERE id_palabra = $1 AND id_categoria = $2';
        const response = await pool.query(deleteQuery, [id_palabra, id_categoria]);

        if (response.rowCount === 0) {
            return res.status(404).json({ mensaje: "No se encontró la asociación especificada para eliminar" });
        }

        res.json({ mensaje: "Asociación eliminada correctamente" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error del servidor al desvincular la palabra de la categoría");
    }
});

// Ruta para obtener las categorías asociadas a una palabra específica
router.get('/getCategoriasPorPalabra/:id_palabra', async (req, res) => {
    const { id_palabra } = req.params;
    try {
        const query = `
            SELECT c.id_categoria, c.nombre
            FROM categoria c
            JOIN palabras_por_categoria pc ON c.id_categoria = pc.id_categoria
            WHERE pc.id_palabra = $1
        `;
        const resultado = await pool.query(query, [id_palabra]);
        res.json(resultado.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error del servidor al obtener las categorías para la palabra especificada");
    }
});

// Ruta para crear una nueva sala de juego
router.post('/crearSala', async (req, res) => {
    const { nombre, id_categoria } = req.body;
    const estado = "Activo";

    if (!nombre || !id_categoria) {
        return res.status(400).json({ mensaje: "Todos los campos son necesarios (nombre, id_categoria)" });
    }

    try {
        const nuevaSala = await pool.query(
            'INSERT INTO sala_de_juego (nombre, id_categoria, estado) VALUES ($1, $2, $3) RETURNING *',
            [nombre, id_categoria, estado]
        );

        res.json({ sala: nuevaSala.rows[0], mensaje: "Sala creada correctamente con estado 'Activo'" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error del servidor al crear la sala");
    }
});

// Ruta para obtener todas las salas de juego
router.get('/getSalas', async (req, res) => {
    try {
        const query = `
            SELECT s.id_sala, s.nombre, c.nombre as nombre_categoria, s.estado
            FROM sala_de_juego s
            JOIN categoria c ON s.id_categoria = c.id_categoria
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error del servidor al obtener las salas");
    }
});


// Ruta para eliminar una sala de juego por ID
router.delete('/eliminarSala/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Realiza la eliminación en la base de datos
        const deleteQuery = 'DELETE FROM sala_de_juego WHERE id_sala = $1';
        const result = await pool.query(deleteQuery, [id]);

        if (result.rowCount === 0) {
            // No se encontró la sala o no se pudo eliminar
            return res.status(404).json({ mensaje: "Sala no encontrada o ya eliminada" });
        }

        // Si la eliminación fue exitosa, envía una respuesta positiva
        res.json({ mensaje: "Sala eliminada correctamente" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error del servidor al eliminar la sala");
    }
});

module.exports = router;
