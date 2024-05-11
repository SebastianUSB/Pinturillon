const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const pool = require('./db');
const Routes = require('./Routes/routes');



const app = express();
const server = http.createServer(app);
const io = socketIo(server);

//Midlewares
app.use(express.json());
app.use(express.static('public'));
app.use('/', Routes);

//Conexion con la base de datos
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error al conectarse a la base de datos:', err);
    } else {
        console.log('Conexión exitosa a la base de datos:', res.rows[0]);
    }
});

//Manejo de eventos Socket.io
io.on('connection', (socket) => {
    console.log('Un usuario se ha conectado');

    socket.on('join_room', async (data) => {
        try{
            const { rows } = await pool.query('SELECT * FROM sala_de_juego WHERE id_sala = $1', [data.room]);
            if (rows.length > 0){
                socket.join(data.room);
                console.log(`${data.username} se ha unido a la sala: ${data.room}`);
                socket.to(data.room).emit('user_joined', `${data.username} se ha unido a la sala.`);
                socket.emit('joined_room', {success: true});
            }else{
                socket.emit('joined_room', {success: false, message: "La sala no existe"});
            }
        } catch (error){
            console.log('Error al verificar la sala:', error);
            socket.emit('joined_room', {success: false, message: "Error al unirse a la sala"});
        }
        
    });

    socket.on('send_message', (data) =>{
        io.to(data.room).emit('receive_message', {
            username: data.username,
            message: data.message
        })
    })

    socket.on('disconnect', () => {
        console.log('Un usuario se ha desconectado')
    })
})

const PORT = 3000;

server.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
