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
                        categoryId: rows[0].id_categoria
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

function setNewWordForRoom(room, word) {
    const game = games[room];
    if (game) {
        game.currentWord = word;
        io.to(room).emit('new_word', { word }); // Avisa a todos los jugadores la nueva palabra
    }
}


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


// Función para asignar una nueva palabra al inicio de cada ronda
function assignNewWord(room) {
    // Supongamos que tienes una función que obtiene palabras por categoría
    getWordsByCategory(games[room].category).then(words => {
        const randomIndex = Math.floor(Math.random() * words.length);
        const selectedWord = words[randomIndex];

        // Guardar la palabra seleccionada en el estado del juego para referencia futura
        games[room].currentWord = selectedWord;

        // Envía la palabra seleccionada a todos los jugadores excepto al dibujante
        games[room].players.forEach(player => {
            if (!player.isDrawing) {
                io.to(player.id).emit('new_word', { word: selectedWord });
            }
        });

        // Envía una palabra oculta o un mensaje al dibujante
        const drawer = games[room].players.find(p => p.isDrawing);
        if (drawer) {
            io.to(drawer.id).emit('new_word', { word: "*******" }); // Puede enviar la palabra real si desea
        }
    }).catch(error => {
        console.error('Error fetching words for category:', error);
    });
}


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
async function nextTurn(room) {
    const game = games[room];
    if (!game || game.players.length === 0) return;

    game.currentTurn = (game.currentTurn + 1) % game.players.length;
    game.players.forEach((player, index) => {
        player.isDrawing = (index === game.currentTurn);
    });

    try {
        const words = await getWordsByCategory(game.categoryId);
        if (words.length > 0) {
            const randomWord = words[Math.floor(Math.random() * words.length)];
            game.currentWord = randomWord;

            game.players.forEach(player => {
                io.to(player.id).emit('new_word', { word: player.isDrawing ? randomWord : "*******" });
            });
        } else {
            console.error('No words available for category:', game.categoryId);
        }
    } catch (error) {
        console.error('Failed to assign new word:', error);
    }

    updatePlayers(room);
    startTimer(room);
}




const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});