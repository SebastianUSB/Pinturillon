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

//Agregar palabra

document.addEventListener('DOMContentLoaded', function(){
    document.getElementById('Enviar1').addEventListener('click', function(event){
        var form = document.getElementById('nuevaPalabra');
        var formData = new FormData(form);
        fetch('php/agregarPalabra.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            showBootstrapAlert(data.success, data.message);
            if(data.success){
                cargarPalabras();
            }
        })
        .catch(error => console.error('Error:', error))
    });
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

//Traer palabra

document.addEventListener('DOMContentLoaded', function() {
    fetch('php/getPalabra.php')
    .then(response => response.json())
    .then(data => {
        const select = document.getElementById('seleccionPalabra');
        data.forEach(palabra => {
            let option = new Option(palabra.texto, palabra.id_palabra);
            select.add(option);
        });
    })
    .catch(error => console.error('Error:', error));
});

document.addEventListener('DOMContentLoaded', function() {
    fetch('php/getPalabra.php')
    .then(response => response.json())
    .then(data => {
        const select2 = document.getElementById('seleccionPalabraEditar');
        data.forEach(palabra => {
            let option = new Option(palabra.texto, palabra.id_palabra);
            select2.add(option);
        });
    })
    .catch(error => console.error('Error:', error));
});

function cargarPalabras() {
    fetch('php/getPalabra.php')
    .then(response => response.json())
    .then(data => {
        const select = document.getElementById('seleccionPalabra');
        const selectEditar = document.getElementById('seleccionPalabraEditar');
        select.innerHTML = '<option value="">Selecciona una palabra para Eliminar</option>';
        selectEditar.innerHTML = '<option value="">Selecciona una palabra para Editarla</option>';

        data.forEach(palabra => {
            let option = new Option(palabra.texto, palabra.id_palabra);
            let optionEditar = new Option(palabra.texto, palabra.id_palabra);
            select.add(option);
            selectEditar.add(optionEditar);
        });
    })
    .catch(error => console.error('Error:', error));
}

document.addEventListener('DOMContentLoaded', cargarPalabras);

//Eliminar palabra

document.getElementById('Eliminar').addEventListener('click', function() {
    const selected = document.getElementById('seleccionPalabra');
    const id_palabra = selected.value;
    if (id_palabra) {
        fetch('php/borrarPalabra.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'id_palabra=' + id_palabra
        })
        .then(response => response.json())
        .then(data => {
            showBootstrapAlert(data.success, data.message);
            if (data.success) {
                // Eliminar la opción del select
                cargarPalabras();
            }
        })
        .catch(error => console.error('Error:', error));
    } else {
        showBootstrapAlert(false, "Por favor, seleccione una palabra para eliminar.");
    }
});

//Editar palabra

document.getElementById('Editar').addEventListener('click', function() {
    const selected = document.getElementById('seleccionPalabraEditar');
    const id_palabra = selected.value;
    const nueva_palabra = document.getElementById('EditarPalabra').value.trim();

    if (id_palabra && nueva_palabra) {
        fetch('php/editarPalabra.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'id_palabra=' + encodeURIComponent(id_palabra) + '&nueva_palabra=' + encodeURIComponent(nueva_palabra)
        })
        .then(response => response.json())
        .then(data => {
            showBootstrapAlert(data.success, data.message);
            if (data.success) {
                // Actualizar la opción en el select
                cargarPalabras();
            }
        })
        .catch(error => console.error('Error:', error));
    } else {
        showBootstrapAlert(false, "Por favor, seleccione una palabra y escriba una nueva para actualizar.");
    }
});

