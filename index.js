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
let randomWordElement = document.getElementById("randomWord");
let words = []; // Lista de palabras

function loadRandomWords() {
  fetch('php/getRandomPalabra.php')
  .then(response => response.json())
  .then(data => {
      if (!data.error) {
          words = data;
          showRandomWord();  
      } else {
          console.error(data.error);
      }
  })
  .catch(error => console.error('Error:', error));
}

function showRandomWord() {
  if (words.length > 0) {
      let randomIndex = Math.floor(Math.random() * words.length);
      let randomWord = words[randomIndex];
      randomWordElement.textContent = randomWord;
  } else {
      randomWordElement.textContent = "Cargando palabras...";
      loadRandomWords(); 
  }
}

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
  
  // Función para enviar mensajes
  sendMessageBtn.onclick = function() {
    if (chatInput.value.trim() !== "") {
      let newMessage = document.createElement("p");
      newMessage.textContent = chatInput.value;
      chatMessages.appendChild(newMessage);
      chatInput.value = "";
    }
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

// Llamado de funcion que ajusta la ventana

resizeCanvas();

// Cargar palabras cuando la página se cargue

document.addEventListener('DOMContentLoaded', function() {
  loadRandomWords(); 
});


  