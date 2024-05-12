let canvas = document.getElementById('drawingCanvas');
let ctx = canvas.getContext('2d');
let painting = false;
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
let timeLeft = 60; 

function updateTimer() {
    timerElement.textContent = timeLeft;
    timeLeft -= 1;

    if (timeLeft < 0) {
        clearInterval(timerInterval);
    }
}

let timerInterval = setInterval(updateTimer, 1000);

// Función para abrir el chat
chatBtn.onclick = function() {
    chatContainer.style.display = "block";
  };
  
  // Función para cerrar el chat
  closeChat.onclick = function() {
    chatContainer.style.display = "none";
  };
  


  // Datos de ejemplo para las puntuaciones
  let scores = [
      { name: "Luis", points: 45 },
      { name: "Jaime", points: 25 },
      { name: "Sergio", points: 20 },
      { name: "Samuel", points: 5 }
  ];
  
  // Función para abrir la lista de puntuaciones
  scoreBtn.onclick = function() {
    scoreBoard.style.display = "block";
    scoreList.innerHTML = "";
    scores.forEach(score => {
        let listItem = document.createElement("li");
        listItem.textContent = `${score.name} ${score.points}`;
        scoreList.appendChild(listItem);
    });
  };
  
  // Función para cerrar la lista de puntuaciones
  closeScore.onclick = function() {
    scoreBoard.style.display = "none";
  };

// Función para abrir la ventana emergente
optionsBtn.onclick = function() {
  modal.style.display = "block";
};

// Función para cerrar la ventana emergente
closeModal.onclick = function() {
  modal.style.display = "none";
};

// Cambiar el color de fondo
bgColorPicker.addEventListener("input", function() {
  canvas.style.backgroundColor = this.value;
});

// Cambiar el color del pincel
brushColorPicker.addEventListener("input", function() {
  ctx.strokeStyle = this.value;
});

// Cambiar el tamaño del pincel
brushSizePicker.addEventListener("input", function() {
  ctx.lineWidth = this.value;
});

// Limpiar el canvas
clearCanvasBtn.addEventListener("click", function() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});


function startPosition(e) {
  painting = true;
  draw(e);
}

function finishedPosition() {
  painting = false;
  ctx.beginPath();
}

function draw(e) {
  if (!painting) return;
  ctx.lineWidth = brushSizePicker.value;
  ctx.lineCap = 'round';
  ctx.strokeStyle = brushColorPicker.value;


  ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
}

canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', finishedPosition);
canvas.addEventListener('mousemove', draw);

// Funcion de ajuste de ventana
window.addEventListener('resize', resizeCanvas);

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - document.querySelector('.navbar-custom').offsetHeight;
}

function isChatVisible() {
  return document.getElementById('chatContainer').style.display !== 'none';
}

// Llamado de funcion que ajusta la ventana

resizeCanvas();

const username = sessionStorage.getItem('username');
const room = sessionStorage.getItem('room');

function obtenerCategoriaDeSala(idSala) {
  fetch(`http://localhost:3000/getSala/${idSala}`)
      .then(response => response.json())
      .then(sala => {
          if (sala && sala.id_categoria) {
              cargarPalabraAleatoriaPorCategoria(sala.id_categoria);
          } else {
              console.error('La sala no tiene una categoría asignada o no existe.');
          }
      })
      .catch(error => {
          console.error('Error al obtener la información de la sala:', error);
      });
}

function cargarPalabraAleatoriaPorCategoria(idCategoria) {
  fetch(`http://localhost:3000/getPalabrasPorCategoria/${idCategoria}`)
      .then(response => {
          if (!response.ok) {
              throw new Error('Error al obtener palabras');
          }
          return response.json();
      })
      .then(palabras => {
          if (palabras.length > 0) {
              mostrarPalabraAleatoria(palabras);
          } else {
              console.log("No hay palabras disponibles en esta categoría.");
          }
      })
      .catch(error => {
          console.error('Error al cargar las palabras por categoría:', error);
      });
}

function mostrarPalabraAleatoria(palabras) {
  const indiceAleatorio = Math.floor(Math.random() * palabras.length);
  const palabraAleatoria = palabras[indiceAleatorio].texto; // Asegúrate de que el campo 'texto' corresponda a tu base de datos.
  const divPalabra = document.getElementById('randomWord');
  divPalabra.textContent = palabraAleatoria; // Inserta la palabra aleatoria en el div.
}

document.addEventListener('DOMContentLoaded', function() {
  const room = sessionStorage.getItem('room');
  if (room) {
    obtenerCategoriaDeSala(room);
  } else {
      console.error('No se encontró el ID de la sala en sessionStorage.');
  }
});

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////Socket io///////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

//Unete a la sala
document.addEventListener('DOMContentLoaded', function() {
  const socket = io();

  const username = sessionStorage.getItem('username');
  const room = sessionStorage.getItem('room');

  // Verificar si los elementos del DOM están disponibles
  const chatMessages = document.getElementById('chatMessages');
  const messageInput = document.getElementById('chatInput');
  const sendMessageButton = document.getElementById('sendMessage');
  const alertPlaceholder = document.getElementById('alert-placeholder');

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




  