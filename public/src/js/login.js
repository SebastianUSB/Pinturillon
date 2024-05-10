//Abrir y cerrar ventanas (opciones)
document.getElementById('show1').addEventListener('click', function() {
    var container = document.getElementById('container1');
    if (container.style.display === 'block') {
        container.style.display = 'none'; // Si está visible, ocultarlo
    } else {
        container.style.display = 'block'; // Si está oculto, mostrarlo
    }
});
document.getElementById('show2').addEventListener('click', function() {
    var container = document.getElementById('container2');
    if (container.style.display === 'block') {
        container.style.display = 'none'; // Si está visible, ocultarlo
    } else {
        container.style.display = 'block'; // Si está oculto, mostrarlo
    }
});
document.getElementById('show3').addEventListener('click', function() {
    var container = document.getElementById('container3');
    if (container.style.display === 'block') {
        container.style.display = 'none'; // Si está visible, ocultarlo
    } else {
        container.style.display = 'block'; // Si está oculto, mostrarlo
    }
});
document.getElementById('show4').addEventListener('click', function() {
    var container = document.getElementById('container4');
    if (container.style.display === 'block') {
        container.style.display = 'none'; // Si está visible, ocultarlo
    } else {
        container.style.display = 'block'; // Si está oculto, mostrarlo
    }
});
document.getElementById('show5').addEventListener('click', function() {
    var container = document.getElementById('container5');
    if (container.style.display === 'block') {
        container.style.display = 'none'; // Si está visible, ocultarlo
    } else {
        container.style.display = 'block'; // Si está oculto, mostrarlo
    }
});
document.getElementById('show6').addEventListener('click', function() {
    var container = document.getElementById('container6');
    if (container.style.display === 'block') {
        container.style.display = 'none'; // Si está visible, ocultarlo
    } else {
        container.style.display = 'block'; // Si está oculto, mostrarlo
    }
});
document.getElementById('show7').addEventListener('click', function() {
    var container = document.getElementById('container7');
    if (container.style.display === 'block') {
        container.style.display = 'none'; // Si está visible, ocultarlo
    } else {
        container.style.display = 'block'; // Si está oculto, mostrarlo
    }
});
document.getElementById('show8').addEventListener('click', function() {
    var container = document.getElementById('container8');
    if (container.style.display === 'block') {
        container.style.display = 'none'; // Si está visible, ocultarlo
    } else {
        container.style.display = 'block'; // Si está oculto, mostrarlo
    }
});

// Abrir y cerrar ventana (Salas)

document.getElementById('sala1').addEventListener('click', function() {
    var container = document.getElementById('containers1');
    if (container.style.display === 'block') {
        container.style.display = 'none'; // Si está visible, ocultarlo
    } else {
        container.style.display = 'block'; // Si está oculto, mostrarlo
    }
});

document.getElementById('sala2').addEventListener('click', function() {
    var container = document.getElementById('containers2');
    if (container.style.display === 'block') {
        container.style.display = 'none'; // Si está visible, ocultarlo
    } else {
        container.style.display = 'block'; // Si está oculto, mostrarlo
    }
});


//Ventana emergente (Alerta)

function showBootstrapAlert(success, message) {
    var alertPlaceholder = document.getElementById('alert-placeholder');
    var wrapper = document.createElement('div');
    var alertType = success ? 'alert-success' : 'alert-danger';
    wrapper.innerHTML = '<div class="alert ' + alertType + ' alert-dismissible fade show" role="alert">' +
        message + '</div>';

    alertPlaceholder.appendChild(wrapper);

    // Hacer que la alerta se cierre automáticamente después de 5 segundos
    setTimeout(function() {
        $(wrapper).alert('close');
    }, 5000); // 5000 ms = 5 segundos
}

//Get Palabras
document.addEventListener('DOMContentLoaded', function() {
    // Obtener todos los elementos select relacionados con palabras
    const seleccionPalabraEliminar = document.getElementById('seleccionPalabra');
    const seleccionPalabraEditar = document.getElementById('seleccionPalabraEditar');
    const seleccionPalabraCategoria = document.getElementById('seleccionPalabraCategoria');
    const seleccionPalabraDesvincular = document.getElementById('seleccionPalabraDesvincular');

    // Función para cargar las palabras en los select
    function cargarPalabras() {
        fetch('http://localhost:3000/getPalabras') // Asegúrate de que la URL es correcta
            .then(response => response.json())
            .then(data => {
                // Ordenar alfabéticamente por el texto de la palabra
                data.sort((a, b) => a.texto.localeCompare(b.texto));
                
                data.forEach(palabra => {
                    // Crear una opción para cada select
                    const opcionEliminar = new Option(palabra.texto, palabra.id_palabra);
                    const opcionEditar = new Option(palabra.texto, palabra.id_palabra);
                    const opcionCategoria = new Option(palabra.texto, palabra.id_palabra);
                    const opcionDesvincular = new Option(palabra.texto, palabra.id_palabra);

                    // Añadir la opción en cada select
                    seleccionPalabraEliminar.appendChild(opcionEliminar);
                    seleccionPalabraEditar.appendChild(opcionEditar);
                    seleccionPalabraCategoria.appendChild(opcionCategoria);
                    seleccionPalabraDesvincular.appendChild(opcionDesvincular);
                });
            })
            .catch(error => {
                console.error('Error al cargar las palabras:', error);
            });
    }

    // Llamar a la función al cargar la página
    cargarPalabras();
});




//Post Palabras
document.addEventListener('DOMContentLoaded', function () {
    const enviarBtn = document.getElementById('Enviar1');
    if (enviarBtn) {
        enviarBtn.addEventListener('click', function() {
            const palabraInput = document.getElementById('agregarPalabra');
            const palabra = palabraInput.value.trim();

            if (palabra) {
                fetch('http://localhost:3000/postPalabras', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ texto: palabra })
                })
                .then(response => {
                    if (!response.ok) {
                        // Si el servidor responde con un código de error, manejar aquí
                        return response.json().then(err => {
                            throw new Error(err.mensaje || 'Error desconocido');
                        });
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.mensaje) {
                        showBootstrapAlert(true, data.mensaje);
                    }
                    palabraInput.value = ''; // Limpiar el input después de enviar
                })
                .catch(error => {
                    console.error('Error al agregar la palabra:', error);
                    showBootstrapAlert(false, error.message); // Mostrar el mensaje de error del servidor
                });
            } else {
                showBootstrapAlert(false, 'Por favor, escribe una palabra antes de enviar.');
            }
        });
    }
});





//Funcion de inicio de pagina

document.addEventListener('DOMContentLoaded', function() {

});

