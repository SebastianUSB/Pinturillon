// Elementos del DOM y configuración inicial
let canvas = document.getElementById('drawingCanvas');
let ctx = canvas.getContext('2d');
let optionsBtn = document.querySelector(".btn-outline-light");
let modal = document.getElementById("optionsModal");
let closeModal = document.querySelector(".close");
let bgColorPicker = document.getElementById("bgColorPicker");
let brushColorPicker = document.getElementById("brushColorPicker");
let brushSizePicker = document.getElementById("brushSizePicker");
let clearCanvasBtn = document.getElementById("clearCanvas");
let chatBtn = document.querySelectorAll(".btn-outline-light")[1]; 
let chatContainer = document.getElementById("chatContainer");
let closeChat = document.querySelector(".close-chat");
let sendMessageBtn = document.getElementById("sendMessage");
let chatMessages = document.getElementById("chatMessages");
let chatInput = document.getElementById("chatInput");
let scoreBtn = document.querySelectorAll(".btn-outline-light")[2]; 
let scoreBoard = document.getElementById("scoreBoard");
let closeScore = document.querySelector(".close-score");
let scoreList = document.getElementById("scoreList");
let timerElement = document.getElementById("timer");
let alertPlaceholder = document.getElementById('alert-placeholder');

// Variables para controlar el estado de dibujo
let isDrawing = false;
let isDrawer = false; // Indica si el usuario actual es el dibujante

// Configuración de Socket.IO
const socket = io();
const room = sessionStorage.getItem('room');
const username = sessionStorage.getItem('username');

// Eventos de interacción UI
chatBtn.onclick = () => chatContainer.style.display = "block";
closeChat.onclick = () => chatContainer.style.display = "none";
scoreBtn.onclick = () => scoreBoard.style.display = "block";
closeScore.onclick = () => scoreBoard.style.display = "none";
optionsBtn.onclick = () => modal.style.display = "block";
closeModal.onclick = () => modal.style.display = "none";

// Control de los estilos de dibujo
bgColorPicker.oninput = () => canvas.style.backgroundColor = bgColorPicker.value;
brushColorPicker.oninput = () => ctx.strokeStyle = brushColorPicker.value;
brushSizePicker.oninput = () => ctx.lineWidth = brushSizePicker.value;
clearCanvasBtn.onclick = () => ctx.clearRect(0, 0, canvas.width, canvas.height);


/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////Funciones de dibujo/////////////////////////////////
function startPosition(e) {
  if (isDrawer) {
      isDrawing = true;
      ctx.beginPath(); // Comenzar un nuevo trazo
      ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop); // Comienza desde aquí
      draw(e);
  }
}

function finishedPosition() {
  if (isDrawer && isDrawing) {
      isDrawing = false;
      ctx.beginPath(); // Reinicia el camino para el próximo trazo
      socket.emit('end_draw', { room });
  }
}

function draw(e) {
  if (!isDrawing || !isDrawer) return;

  // Dibuja al nuevo punto
  ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
  ctx.stroke();

  // Mueve el contexto al nuevo punto para el siguiente trazo
  ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);

  // Emitir los datos para cada movimiento de mouse
  socket.emit('drawing', {
      room: room,
      x: e.clientX - canvas.offsetLeft,
      y: e.clientY - canvas.offsetTop,
      color: ctx.strokeStyle,
      size: ctx.lineWidth
  });
}

// Escuchar eventos de dibujo desde el servidor
socket.on('drawing', (data) => {
  if (!isDrawer) {
      ctx.strokeStyle = data.color;
      ctx.lineWidth = data.size;
      ctx.lineTo(data.x, data.y);
      ctx.stroke();
      ctx.moveTo(data.x, data.y); // Preparar para el siguiente punto recibido
  }
});

function drawFromServer(data) {
  ctx.beginPath();  // Comenzar un nuevo trazo
  ctx.moveTo(data.x, data.y);  // Mover al punto inicial
  ctx.strokeStyle = data.color;
  ctx.lineWidth = data.size;
  ctx.lineTo(data.x + 1, data.y + 1);  // Dibuja una línea pequeña para asegurar visibilidad
  ctx.stroke();
}


socket.on('end_draw', () => ctx.beginPath());

// Ajustar el tamaño del canvas cuando la ventana cambie de tamaño
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - document.querySelector('.navbar-custom').offsetHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();  // Ajustar al cargar

/////////////////////////////////////////////////////////////////////////////////
//////////////////////////Funcion para palabras//////////////////////////////////

socket.on('new_word', data => {
    const wordContainer = document.getElementById('randomWord');
    console.log(data.word)
    wordContainer.textContent = data.word; // Muestra la palabra recibida
});


//Tiempo
// Escuchar actualizaciones del temporizador desde el servidor
socket.on('timer_update', (data) => {
  const timerElement = document.getElementById('timer');
  timerElement.textContent = data.timeLeft;
});

socket.on('timer_end', () => {
  const timerElement = document.getElementById('timer');
  timerElement.textContent = '0';
});


/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////Socket io///////////////////////////////////////


//Unete a la sala
document.addEventListener('DOMContentLoaded', function() {
  const messageInput = document.getElementById('chatInput');
  const sendMessageButton = document.getElementById('sendMessage');

  // Unirse a la sala
  socket.emit('join_room', { username, room });

  // Evento: Usuario se ha unido
  socket.on('user_joined', function(message) {
      if (!isChatVisible()) {
          showBootstrapAlert(true, message);
      }
      appendMessage(message, 'system-message');
  });

  // Evento: Mensaje recibido
  socket.on('receive_message', function(data) {
      if (!isChatVisible()) {
          showBootstrapAlert(true, 'Nuevo mensaje de ' + data.username);
      }
      appendMessage(`${data.username}: ${data.message}`);
  });

  // En pinturillon.js
    socket.on('correct_guess', (data) => {
        const message = `${data.username} ha adivinado la palabra correctamente!`;
        appendMessage(message, 'correct-message');
        // Puedes también tomar acciones adicionales como preparar para el siguiente turno
    });


  // Escuchar si el usuario es el dibujante
  socket.on('set_drawer', (data) => {
    console.log("Set drawer: ", data.isDrawer);
    isDrawer = data.isDrawer;
    if (isDrawer) {
        //document.querySelector(".btn-outline-light").style.display = 'block'; // Mostrar opciones
        enableDrawing();
    } else {
        //document.querySelector(".btn-outline-light").style.display = 'none'; // Ocultar opciones
        disableDrawing();
    }
  });

  function enableDrawing() {
      canvas.addEventListener('mousedown', startPosition);
      canvas.addEventListener('mouseup', finishedPosition);
      canvas.addEventListener('mousemove', draw);
      canvas.style.pointerEvents = 'auto'; // Permite interacciones con el canvas
  }

  function disableDrawing() {
      canvas.removeEventListener('mousedown', startPosition);
      canvas.removeEventListener('mouseup', finishedPosition);
      canvas.removeEventListener('mousemove', draw);
      canvas.style.pointerEvents = 'none'; // Deshabilita interacciones con el canvas
  }

  // Evento para actualizar la lista de jugadores
  socket.on('update_players', function(players) {
    const scoreList = document.getElementById('scoreList');
    scoreList.innerHTML = '';  // Limpiar la lista actual

    players.forEach(player => {
        const listItem = document.createElement('li');
        console.log(player)
        console.log(player.score)
        listItem.textContent = `${player.username} - ${player.isDrawing ? 'Dibujando' : 'Adivinando'} - ${player.score}`;
        scoreList.appendChild(listItem);
    });

    if (!scoreBoard.style.display || scoreBoard.style.display === 'none') {
        scoreBoard.style.display = 'block';  // Mostrar la lista de jugadores si no está visible
    }
  });

  // Enviar mensaje
  sendMessageButton.addEventListener('click', function() {
      let message = messageInput.value.trim();
      if(message !== "") {
          socket.emit('send_message', {
              room: room,
              username: username,
              message: message
          });
          messageInput.value = '';
      }
  });
  

  function appendMessage(message, cssClass = '') {
      let messageElement = document.createElement('p');
      messageElement.textContent = message;
      if (cssClass) messageElement.classList.add(cssClass);
      chatMessages.appendChild(messageElement);
      chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function isChatVisible() {
      return document.getElementById('chatContainer').style.display !== 'none';
  }

  function showBootstrapAlert(success, message) {
      const wrapper = document.createElement('div');
      const alertType = success ? 'alert-success' : 'alert-danger';
      wrapper.innerHTML = `<div class="alert ${alertType} alert-dismissible fade show" role="alert">
          ${message}
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`;
  
      alertPlaceholder.appendChild(wrapper);
  
      setTimeout(function() {
          wrapper.remove();
      }, 5000);
  }
});
