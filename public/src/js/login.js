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

//GET Salas
function cargarSalas() {
    const seleccionSala = document.getElementById('seleccionSala');

    fetch('http://localhost:3000/getSalas')
        .then(response => response.json())
        .then(salas => {
            seleccionSala.length = 1;

            salas.forEach(sala => {
                const option = new Option(sala.nombre, sala.id_sala);
                seleccionSala.add(option);
            });
        })
        .catch(error => {
            console.error('Error al cargar las salas:', error);
            showBootstrapAlert(false, 'Error al cargar las salas.');
        });
}

function cargarSalasEnTabla() {
    console.log("Cargando salas desde el servidor...");
    fetch('http://localhost:3000/getSalas')
    .then(response => {
        if (!response.ok) {
            throw new Error('Problema al recibir datos del servidor');
        }
        return response.json();
    })
    .then(salas => {
        console.log("Salas recibidas:", salas);
        const tablaSalas = document.getElementById('tablaSalas');
        if (!salas.length) {
            console.log("No hay salas para mostrar.");
            return;
        }

        $('#tablaSalas').bootstrapTable('load', salas);
    })
    .catch(error => {
        console.error('Error al cargar las salas:', error);
        showBootstrapAlert(false, 'Error al cargar las salas.');
    });
}

//GET Categorías
function cargarCategorias() {
    const selects = [
        document.getElementById('seleccionCategoria'),
        document.getElementById('seleccionCategoriaEditar'),
        document.getElementById('seleccionCategoriaPalabra'),
        document.getElementById('seleccionCategoriaDesvincular'),
        document.getElementById('seleccionCategoriaJuego')
    ];

    // Limpiar los selects existentes
    selects.forEach(select => {
        while (select.firstChild) {
            select.removeChild(select.firstChild);
        }
        const defaultOption = document.createElement('option');
        defaultOption.textContent = select.id === 'seleccionCategoria' ? "Selecciona una categoria para Eliminar" :
                                    select.id === 'seleccionCategoriaEditar' ? "Selecciona una categoria para Editarla" :
                                    select.id === 'seleccionCategoriaPalabra' ? "Selecciona una categoria para Asociar" :
                                    select.id === 'seleccionCategoriaDesvincular' ? "Selecciona una categoria para Desvincular":
                                    "Selecciona una categoria";
        select.appendChild(defaultOption);
    });

    // Cargar categorías desde el servidor
    fetch('http://localhost:3000/getCategorias')
        .then(response => response.json())
        .then(data => {
            data.sort((a, b) => a.nombre.localeCompare(b.nombre));
            data.forEach(categoria => {
                const opcion = new Option(categoria.nombre, categoria.id_categoria);
                selects.forEach(select => select.appendChild(opcion.cloneNode(true)));
            });
        })
        .catch(error => {
            console.error('Error al cargar las categorías:', error);
        });
}

//Filtro para mostrar las categorias de x palabras
document.addEventListener('DOMContentLoaded', function () {
    const seleccionPalabraDesvincular = document.getElementById('seleccionPalabraDesvincular');
    const seleccionCategoriaDesvincular = document.getElementById('seleccionCategoriaDesvincular');

    seleccionPalabraDesvincular.addEventListener('change', function() {
        const id_palabra = this.value;
        if (!id_palabra) {
            seleccionCategoriaDesvincular.innerHTML = '<option value="">Selecciona una categoria para Desvincular</option>';
            return;
        }

        fetch(`http://localhost:3000/getCategoriasPorPalabra/${id_palabra}`)
            .then(response => response.json())
            .then(data => {
                seleccionCategoriaDesvincular.innerHTML = '<option value="">Selecciona una categoria para Desvincular</option>';
                data.forEach(categoria => {
                    const opcion = new Option(categoria.nombre, categoria.id_categoria);
                    seleccionCategoriaDesvincular.appendChild(opcion);
                });
            })
            .catch(error => {
                console.error('Error al cargar las categorías:', error);
                showBootstrapAlert(false, 'Error al cargar las categorías.');
            });
    });
});




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

//POST Categorias
document.addEventListener('DOMContentLoaded', function () {
    const enviarBtnCategoria = document.getElementById('Enviar2');
    const categoriaInput = document.getElementById('agregarCategoria');

    enviarBtnCategoria.addEventListener('click', function() {
        const categoria = categoriaInput.value.trim();

        if (categoria) {
            fetch('http://localhost:3000/postCategorias', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nombre: categoria })
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
                    cargarCategorias();  // Asumiendo que tienes una función similar para recargar las categorías
                }
                categoriaInput.value = ''; // Limpiar el input después de enviar
            })
            .catch(error => {
                console.error('Error al agregar la categoría:', error);
                showBootstrapAlert(false, error.message); // Mostrar el mensaje de error del servidor
            });
        } else {
            showBootstrapAlert(false, 'Por favor, escribe una categoría antes de enviar.');
        }
    });
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

//DELETE categoria
document.addEventListener('DOMContentLoaded', function () {
    const botonEliminarCategoria = document.getElementById('Eliminar2');
    const seleccionCategoria = document.getElementById('seleccionCategoria');

    botonEliminarCategoria.addEventListener('click', function() {
        const id = seleccionCategoria.value;

        if (!id) {
            showBootstrapAlert(false, 'Por favor, selecciona una categoría antes de intentar eliminar.');
            return;
        }

        eliminarCategoria(id);
    });
});

function eliminarCategoria(id) {
    fetch(`http://localhost:3000/deleteCategoria/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('No se pudo eliminar la categoría');
        }
        return response.json();
    })
    .then(data => {
        showBootstrapAlert(true, data.mensaje);
        cargarCategorias();  // Asumiendo que tienes una función similar para recargar las categorías
    })
    .catch(error => {
        console.error('Error al eliminar la categoría:', error);
        showBootstrapAlert(false, error.message || 'Error al eliminar la categoría.');
    });
}


//PUT palabra
document.addEventListener('DOMContentLoaded', function () {
    const botonEditar = document.getElementById('Editar');
    const seleccionPalabraEditar = document.getElementById('seleccionPalabraEditar');
    const inputEditarPalabra = document.getElementById('EditarPalabra');

    botonEditar.addEventListener('click', function() {
        const id = seleccionPalabraEditar.value;
        const nuevoTexto = inputEditarPalabra.value.trim();

        if (!id) {
            showBootstrapAlert(false, 'Por favor, selecciona una palabra antes de intentar editar.');
            return;
        }

        if (!nuevoTexto) {
            showBootstrapAlert(false, 'Por favor, escribe el nuevo texto para la palabra.');
            return;
        }

        actualizarPalabra(id, nuevoTexto);
    });
});

function actualizarPalabra(id, texto) {
    fetch(`http://localhost:3000/updatePalabra/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ texto: texto })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('No se pudo actualizar la palabra');
            
        }
        return response.json();
    })
    .then(data => {
        showBootstrapAlert(true, data.mensaje);
        cargarPalabras();
    })
    .catch(error => {
        console.error('Error al actualizar la palabra:', error);
        console.log(error.message);
        showBootstrapAlert(false, error.message || 'Error al actualizar la palabra.');
    });
}

//PUT Categoria
document.addEventListener('DOMContentLoaded', function () {
    const botonEditarCategoria = document.getElementById('Editar2');
    const seleccionCategoriaEditar = document.getElementById('seleccionCategoriaEditar');
    const inputEditarCategoria = document.getElementById('EditarCategoria');

    botonEditarCategoria.addEventListener('click', function() {
        const id = seleccionCategoriaEditar.value;
        const nuevoNombre = inputEditarCategoria.value.trim();

        if (!id) {
            showBootstrapAlert(false, 'Por favor, selecciona una categoría antes de intentar editar.');
            return;
        }

        if (!nuevoNombre) {
            showBootstrapAlert(false, 'Por favor, escribe el nuevo nombre para la categoría.');
            return;
        }

        actualizarCategoria(id, nuevoNombre);
    });
});

function actualizarCategoria(id, nombre) {
    fetch(`http://localhost:3000/updateCategoria/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre: nombre })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('No se pudo actualizar la categoría');
        }
        return response.json();
    })
    .then(data => {
        showBootstrapAlert(true, data.mensaje);
        cargarCategorias();  // Asegúrate de tener esta función para recargar la lista de categorías
    })
    .catch(error => {
        console.error('Error al actualizar la categoría:', error);
        showBootstrapAlert(false, error.message || 'Error al actualizar la categoría.');
    });
}

//Asociar Palabra a una categoria
document.addEventListener('DOMContentLoaded', function () {
    const botonAsociar = document.getElementById('Asociar');
    const seleccionPalabra = document.getElementById('seleccionPalabraCategoria');
    const seleccionCategoria = document.getElementById('seleccionCategoriaPalabra');

    botonAsociar.addEventListener('click', function() {
        const id_palabra = seleccionPalabra.value;
        const id_categoria = seleccionCategoria.value;

        if (!id_palabra || !id_categoria) {
            showBootstrapAlert(false, 'Por favor, selecciona tanto una palabra como una categoría antes de intentar asociar.');
            return;
        }

        asociarPalabraCategoria(id_palabra, id_categoria);
    });
});

function asociarPalabraCategoria(id_palabra, id_categoria) {
    fetch('http://localhost:3000/asociarPalabraCategoria', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id_palabra: id_palabra, id_categoria: id_categoria })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => {
                throw new Error(data.mensaje || 'Error desconocido');
            });
        }
        return response.json();
    })
    .then(data => {
        if (data.mensaje.includes('ya está asociada')) {
            showBootstrapAlert(false, data.mensaje);
        } else {
            showBootstrapAlert(true, data.mensaje);
        }
    })
    .catch(error => {
        console.error('Error al asociar la palabra con la categoría:', error);
        showBootstrapAlert(false, error.message || 'Error al realizar la asociación.');
    });
}

//Desvincular Palabra Categoria
document.addEventListener('DOMContentLoaded', function () {
    const botonDesvincular = document.getElementById('Desvincular');
    const seleccionPalabraDesvincular = document.getElementById('seleccionPalabraDesvincular');
    const seleccionCategoriaDesvincular = document.getElementById('seleccionCategoriaDesvincular');

    botonDesvincular.addEventListener('click', function() {
        const id_palabra = seleccionPalabraDesvincular.value;
        const id_categoria = seleccionCategoriaDesvincular.value;

        if (!id_palabra || !id_categoria) {
            showBootstrapAlert(false, 'Por favor, selecciona tanto una palabra como una categoría antes de intentar desvincular.');
            return;
        }

        desvincularPalabraCategoria(id_palabra, id_categoria);
    });
});

function desvincularPalabraCategoria(id_palabra, id_categoria) {
    fetch('http://localhost:3000/desvincularPalabraCategoria', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id_palabra: id_palabra, id_categoria: id_categoria })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.mensaje || 'No se pudo desvincular la asociación');
            });
        }
        return response.json();
    })
    .then(data => {
        showBootstrapAlert(true, data.mensaje);
    })
    .catch(error => {
        console.error('Error al desvincular la palabra de la categoría:', error);
        showBootstrapAlert(false, error.message || 'Error al desvincular la palabra de la categoría.');
    });
}

//Crear Sala de Juego
document.addEventListener('DOMContentLoaded', function () {
    const botonCrear = document.getElementById('Crear');
    const seleccionCategoriaJuego = document.getElementById('seleccionCategoriaJuego');
    const inputNombreSala = document.getElementById('nombreSala');

    botonCrear.addEventListener('click', function() {
        const id_categoria = seleccionCategoriaJuego.value;
        const nombre = inputNombreSala.value.trim();

        if (!id_categoria) {
            showBootstrapAlert(false, 'Por favor, selecciona una categoría.');
            return;
        }

        if (!nombre) {
            showBootstrapAlert(false, 'Por favor, escribe un nombre para la sala.');
            return;
        }

        crearSala(nombre, id_categoria);
    });
});

function crearSala(nombre, id_categoria) {
    fetch('http://localhost:3000/crearSala', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre: nombre, id_categoria: id_categoria })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => {
                throw new Error(data.mensaje || 'Error al crear la sala');
            });
        }
        return response.json();
    })
    .then(data => {
        showBootstrapAlert(true, data.mensaje);
        cargarSalas();
        cargarSalasEnTabla();
    })
    .catch(error => {
        console.error('Error al crear la sala:', error);
        showBootstrapAlert(false, error.message || 'Error al crear la sala');
    });
}

//Eliminar Sala
document.getElementById('Eliminar3').addEventListener('click', function() {
    const idSala = document.getElementById('seleccionSala').value;

    if (!idSala) {
        showBootstrapAlert(false, 'Por favor, selecciona una sala para eliminar.');
        return;
    }

    fetch(`http://localhost:3000/eliminarSala/${idSala}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        showBootstrapAlert(true, data.mensaje);
        cargarSalas();
        cargarSalasEnTabla();
    })
    .catch(error => {
        console.error('Error al eliminar la sala:', error);
        showBootstrapAlert(false, 'Error al eliminar la sala: ' + error.message);
    });
});

//Unirse a un sala

document.addEventListener('DOMContentLoaded', function(){
    const socket = io();

    const form = document.getElementById('loginForm');
    const roomInput = document.getElementById('room');
    const usernameInput = document.getElementById('username');
    const avatarImg = document.getElementById('selectedAvatar');

    // Manejar la recepción de la respuesta una vez y no cada vez que se envía el formulario
    socket.on('joined_room', function(data){
        if(data.success){
            sessionStorage.setItem('username', usernameInput.value.trim());
            sessionStorage.setItem('room', roomInput.value.trim());
            window.location.href = '/Pinturillon.html?room=' + roomInput.value.trim();
        } else {
            showBootstrapAlert(false, data.message);
        }
    });

    form.addEventListener('submit', function(e){
        e.preventDefault(); 

        const room = roomInput.value.trim();
        const username = usernameInput.value.trim();
        const avatar = avatarImg.src;

        if(!room || !username){
            showBootstrapAlert(false, 'Por favor, completa todos los campos');
            return; // Asegúrate de salir de la función si hay campos inválidos.
        }

        // Emitir evento para unirme a la sala
        socket.emit('join_room', {room, username, avatar});
    });
});


//Funcion de inicio de pagina

document.addEventListener('DOMContentLoaded', function() {
    cargarPalabras();
    cargarCategorias();
    cargarSalas();
    cargarSalasEnTabla();
});

window.onload = function() {
    sessionStorage.clear();
    console.log('Session storage cleared!');
  };