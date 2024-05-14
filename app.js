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
                        currentTurn: 0,
                        categoryId: rows[0].id_categoria,
                        guesses: [],
                        turnCount: 0,
                        maxTurns: 3 
                    };
                }

                // Añadir nuevo jugador
                const newPlayer = {
                    id: socket.id,
                    username: data.username,
                    isDrawing: games[data.room].players.length === 0,
                    score: 0
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

    //Evento de enviar mensaje y verificacion de palabra
    socket.on('send_message', (data) => {
        const game = games[data.room];
        if (game && data.message.trim().toLowerCase() === game.currentWord.toLowerCase()) {
            if (!game.guesses.includes(data.username)) {
                const points = calculatePoints(game.timeLeft, game.guesses.length);
                game.guesses.push(data.username);
    
                const player = game.players.find(p => p.username === data.username);
                if (player) {
                    player.score += points;
                }
    
                io.to(data.room).emit('correct_guess', {
                    username: data.username,
                    points,
                    score: player ? player.score : 0
                });
    
                if (game.guesses.length === game.players.length - 1) {
                    nextTurn(data.room);
                }
            }
        } else {
            io.to(data.room).emit('receive_message', {
                username: data.username,
                message: data.message
            });
        }
    });
    
    //Funcion para calcular la puntuación
    function calculatePoints(timeLeft, numGuesses) {
        if (typeof timeLeft !== 'number' || typeof numGuesses !== 'number') {
            console.error('Invalid inputs to calculatePoints:', timeLeft, numGuesses);
            return 0;
        }
        return 10 + timeLeft - numGuesses * 2;
    }

    //Evento: Siguiente turno
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

// Trae las palabras segun la categoria de la sala
async function getWordsByCategory(categoryId) {
    try {
        const query = `
            SELECT p.texto
            FROM palabra p
            INNER JOIN palabras_por_categoria ppc ON p.id_palabra = ppc.id_palabra
            WHERE ppc.id_categoria = $1;
        `;
        const { rows } = await pool.query(query, [categoryId]);
        return rows.map(row => row.texto);
    } catch (error) {
        console.error('Error fetching words from category:', error);
        throw error;
    }
}

// Temporizador
function startTimer(room) {
    let timeLeft = 60;
    if (gameTimers[room]) {
        clearInterval(gameTimers[room]);
    }
    gameTimers[room] = setInterval(() => {
        timeLeft--;
        games[room].timeLeft = timeLeft; // Guarda el tiempo restante en el estado del juego
        io.to(room).emit('timer_update', { timeLeft });
        if (timeLeft <= 0) {
            clearInterval(gameTimers[room]);
            nextTurn(room); // Cambiar turno cuando el tiempo termina
        }
    }, 1000);
}

// Actualizar los jugadores
function updatePlayers(room) {
    const playerInfo = games[room].players.map(player => ({
        username: player.username,
        isDrawing: player.isDrawing,
        score: player.score || 0
    }));
    io.to(room).emit('update_players', playerInfo);
}

// Función para asignar una nueva palabra al inicio de cada ronda y reiniciar las adivinanzas
async function nextTurn(room) {
    const game = games[room];
    if (!game || game.players.length === 0) return;

    game.currentTurn = (game.currentTurn + 1) % game.players.length;
    game.guesses = []; // Reiniciar las adivinanzas para la nueva ronda
    game.turnCount++; // Incrementa el contador de turnos

    if (game.turnCount > game.maxTurns) {
        // Notifica a todos en la sala que la partida ha terminado
        io.to(room).emit('game_over', {message: "La partida ha terminado."});
        console.log(`Partida en la sala ${room} ha terminado después de ${game.maxTurns} turnos.`);

        // Reiniciar la configuración de la sala o cerrar la sala
        delete games[room]; 
        return;
    }

    try {
        const words = await getWordsByCategory(game.categoryId);
        if (words.length > 0) {
            const randomWord = words[Math.floor(Math.random() * words.length)];
            game.currentWord = randomWord;

            game.players.forEach(player => {
                player.isDrawing = (player.id === game.players[game.currentTurn].id);
                io.to(player.id).emit('new_word', { word: player.isDrawing ? "*******" : randomWord });
            });
            console.log(`Nuevo turno en sala ${room}, palabra: ${randomWord}`);
        } else {
            console.error('No words available for category:', game.categoryId);
        }
    } catch (error) {
        console.error('Failed to assign new word:', error);
    }

    updatePlayers(room);
    startTimer(room); // Reiniciar el temporizador para el nuevo turno
}

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});