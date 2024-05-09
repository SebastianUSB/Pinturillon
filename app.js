const express = require('express');
const app = express();
const pool = require('./db');
const palabrasRoutes = require('./routes/palabras');

app.use(express.json());

app.use(express.static('public'));
app.use('/palabras', palabrasRoutes);

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error al conectarse a la base de datos:', err);
    } else {
        console.log('Conexión exitosa a la base de datos:', res.rows[0]);
    }
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
