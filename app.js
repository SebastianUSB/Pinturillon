const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const pool = require('./db');
const Routes = require('./Routes/routes');



const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const games = {};

const gameTimers = {};

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
        try {
            const { rows } = await pool.query('SELECT * FROM sala_de_juego WHERE id_sala = $1', [data.room]);
            if (rows.length > 0) {
                socket.join(data.room);
                console.log(`${data.username} se ha unido a la sala: ${data.room}`);

                // Inicializar juegos
                if (!games[data.room]) {
                    games[data.room] = {
                        players: [],
                        currentTurn: 0
                    };
                }

                // Añadir nuevo jugador
                const newPlayer = {
                    id: socket.id,
                    username: data.username,
                    isDrawing: games[data.room].players.length === 0
                };
                games[data.room].players.push(newPlayer);

                // Emitir al nuevo jugador si es el dibujante
                socket.emit('set_drawer', {isDrawer: newPlayer.isDrawing}); 

                // Actualizar la lista de jugadores en la sala
                updatePlayers(data.room);

                // Iniciar temporizador si es el primer jugador o si el temporizador no está corriendo
                if (!gameTimers[data.room]) {
                    startTimer(data.room);
                }

                // Confirmación de unión a la sala
                socket.emit('joined_room', {success: true, isDrawing: newPlayer.isDrawing});
                socket.to(data.room).emit('user_joined', `${data.username} se ha unido a la sala.`);
            } else {
                socket.emit('joined_room', {success: false, message: "La sala no existe"});
            }
        } catch (error) {
            console.error('Error al verificar la sala:', error);
            socket.emit('joined_room', {success: false, message: "Error al unirse a la sala"});
        }
    });

    socket.on('send_message', (data) => {
        io.to(data.room).emit('receive_message', {
            username: data.username,
            message: data.message
        });
    });

    socket.on('next_turn', () => {
        nextTurn(data.room);
    });

    socket.on('drawing', (data) => {
        socket.to(data.room).emit('drawing', data);
    });

    socket.on('disconnect', () => {
        console.log('Un usuario se ha desconectado');
        Object.keys(games).forEach(room => {
            games[room].players = games[room].players.filter(player => player.id !== socket.id);
            if (games[room].players.length === 0) {
                delete games[room];
            } else {
                updatePlayers(room);
            }
        });
    });
});


function startTimer(room) {
    let timeLeft = 60; // Tiempo en segundos para cada turno
    if (gameTimers[room]) {
        clearInterval(gameTimers[room]); // Limpia el intervalo anterior si existe
    }
    gameTimers[room] = setInterval(() => {
        timeLeft--;
        io.to(room).emit('timer_update', { timeLeft });
        if (timeLeft <= 0) {
            clearInterval(gameTimers[room]);
            nextTurn(room); // Llama a cambiar turno cuando el tiempo termina
        }
    }, 1000);
}



function updatePlayers(room) {
    const playerInfo = games[room].players.map(player => ({
        username: player.username,
        isDrawing: player.isDrawing
    }));
    io.to(room).emit('update_players', playerInfo);
}

// Al cambiar los turnos
function nextTurn(room) {
    const game = games[room];
    if (!game) return;

    game.currentTurn = (game.currentTurn + 1) % game.players.length;
    game.players.forEach((player, index) => {
        player.isDrawing = (index === game.currentTurn);
    });

    game.players.forEach(player => {
        io.to(player.id).emit('set_drawer', {isDrawer: player.isDrawing});
    });

    updatePlayers(room);
    startTimer(room); // Reinicia el temporizador en el servidor para el nuevo turno
}


const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});