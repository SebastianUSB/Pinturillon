const canvas = document.getElementById('canvas');
const body = document.querySelector('body');
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

var theColor="";
var lineW=5;
let prevX=null;
let prevY=null;
let draw= false;

body.style.backgroundColor =" #FFFFFF";
var theInput = document.getElementById("favcolor");

theInput.addEventListener("input",function(){
    theColor=theInput.value;
    body.style.backgroundColor=theColor;
},false);

const ctx= canvas.getContext("2d");
ctx.lineWidth = lineW;
document.getElementById("ageInputId").oninput=function(){
    draw=null;
    lineW= document.getElementById("ageInputId").value;
    ctx.lineWidth=lineW;
};

let clrs =document.querySelectorAll(".clr");
clrs= Array.from(clrs);
clrs.forEach(clr =>{
    clr.addEventListener("click",()=>{
            ctx.strokeStyle= clr.dataset.clr;
    });
});

let clearBtn= document.querySelector(".clear");
clearBtn.addEventListener("click", ()=>{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

canvas.addEventListener("mousedown", (e) => {
    draw = true;
    prevX = e.offsetX;
    prevY = e.offsetY;
});

canvas.addEventListener("mouseup", () => {
    draw = false;
});

canvas.addEventListener("mousemove", (e) => {
    if (!draw) return;

    let currentX = e.offsetX;
    let currentY = e.offsetY;

    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();

    prevX = currentX;
    prevY = currentY;
});

// Función para abrir el chat
function openChat() {
    document.getElementById("chatPopup").style.display = "block";
}

// Función para cerrar el chat
function closeChat() {
    document.getElementById("chatPopup").style.display = "none";
}

// Evento para abrir el chat al hacer clic en la pestaña
document.getElementById("chatTab").addEventListener("click", openChat);

// Evento para cerrar el chat al hacer clic en el botón de cerrar
document.getElementById("closeChat").addEventListener("click", closeChat);
