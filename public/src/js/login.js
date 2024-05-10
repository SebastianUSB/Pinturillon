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

//GET Palabras
function cargarPalabras() {
    const selects = [
        document.getElementById('seleccionPalabra'),
        document.getElementById('seleccionPalabraEditar'),
        document.getElementById('seleccionPalabraCategoria'),
        document.getElementById('seleccionPalabraDesvincular')
    ];

    // Limpiar los selects existentes
    selects.forEach(select => {
        while (select.firstChild) {
            select.removeChild(select.firstChild);
        }
        const defaultOption = document.createElement('option');
        defaultOption.textContent = select.id === 'seleccionPalabra' ? "Selecciona una palabra para Eliminar" :
                                    select.id === 'seleccionPalabraEditar' ? "Selecciona una palabra para Editarla" :
                                    select.id === 'seleccionPalabraCategoria' ? "Selecciona una palabra para Asociar" :
                                    "Selecciona una palabra para Desvincular";
        select.appendChild(defaultOption);
    });

    // Cargar palabras desde el servidor
    fetch('http://localhost:3000/getPalabras')
        .then(response => response.json())
        .then(data => {
            data.sort((a, b) => a.texto.localeCompare(b.texto));
            data.forEach(palabra => {
                const opcion = new Option(palabra.texto, palabra.id_palabra);
                selects.forEach(select => select.appendChild(opcion.cloneNode(true)));
            });
        })
        .catch(error => {
            console.error('Error al cargar las palabras:', error);
        });
}





//POST Palabras
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
                        return response.json().then(err => {
                            throw new Error(err.mensaje || 'Error desconocido');
                        });
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.mensaje) {
                        showBootstrapAlert(true, data.mensaje);
                        cargarPalabras();
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


//DELETE Palabra

document.addEventListener('DOMContentLoaded', function () {
    const botonEliminar = document.getElementById('Eliminar');
    const seleccionPalabra = document.getElementById('seleccionPalabra');

    botonEliminar.addEventListener('click', function() {
        const id = seleccionPalabra.value;

        if (!id) {
            showBootstrapAlert(false, 'Por favor, selecciona una palabra antes de intentar eliminar.');
            return;
        }

        eliminarPalabra(id);
    });
});

function eliminarPalabra(id) {
    fetch(`http://localhost:3000/deletePalabra/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('No se pudo eliminar la palabra');
        }
        return response.json();
    })
    .then(data => {
        showBootstrapAlert(true, data.mensaje);
        cargarPalabras(); 
    })
    .catch(error => {
        console.error('Error al eliminar la palabra:', error);
        showBootstrapAlert(false, error.message || 'Error al eliminar la palabra.');
    });
}



//Funcion de inicio de pagina

document.addEventListener('DOMContentLoaded', function() {
    cargarPalabras();
});

