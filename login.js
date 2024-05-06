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

function cargarPalabras() {
    fetch('php/getPalabra.php')
    .then(response => response.json())
    .then(data => {
        const select = document.getElementById('seleccionPalabra');
        const selectEditar = document.getElementById('seleccionPalabraEditar');
        const selectAsociarP = document.getElementById('seleccionPalabraCategoria');
        const selectDesvincularP = document.getElementById('seleccionPalabraDesvincular');
        select.innerHTML = '<option value="">Selecciona una palabra para Eliminar</option>';
        selectEditar.innerHTML = '<option value="">Selecciona una palabra para Editarla</option>';
        selectAsociarP.innerHTML= '<option value="">Selecciona una palabra para Asociar</option>';
        selectDesvincularP.innerHTML= '<option value="">Selecciona una palabra para Desvincular</option>';

        data.forEach(palabra => {
            let option = new Option(palabra.texto, palabra.id_palabra);
            let optionEditar = new Option(palabra.texto, palabra.id_palabra);
            let optionAsociarP = new Option(palabra.texto, palabra.id_palabra);
            let optionDesvincularP = new Option(palabra.texto, palabra.id_palabra);
            select.add(option);
            selectEditar.add(optionEditar);
            selectAsociarP.add(optionAsociarP);
            selectDesvincularP.add(optionDesvincularP);
            
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

//Agregar categoría

document.addEventListener('DOMContentLoaded', function(){
    document.getElementById('Enviar2').addEventListener('click', function(event){
        var form = document.getElementById('nuevaCategoriaForm');
        var formData = new FormData(form);
        fetch('php/agregarCategoria.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            showBootstrapAlert(data.success, data.message);
            if(data.success){
                cargarCategorias();
            }
        })
        .catch(error => console.error('Error:', error));
    });
});

//Traer categoría

function cargarCategorias() {
    fetch('php/getCategoria.php')
    .then(response => response.json())
    .then(data => {
        const selectEliminar = document.getElementById('seleccionCategoria');
        const selectEditar = document.getElementById('seleccionCategoriaEditar');
        const selectAsociarC = document.getElementById('seleccionCategoriaPalabra');
        const selectDesvincularC = document.getElementById('seleccionCategoriaDesvincular');
        selectEliminar.innerHTML = '<option value="">Selecciona una categoría para Eliminar</option>';
        selectEditar.innerHTML = '<option value="">Selecciona una categoría para Editarla</option>';
        selectAsociarC.innerHTML = '<option value="">Selecciona una categoría para Asociar</option>';
        selectDesvincularC.innerHTML = '<option value="">Selecciona una categoría para Desvincular</option>';

        data.forEach(categoria => {
            let optionEliminar = new Option(categoria.nombre, categoria.id_categoria);
            let optionEditar = new Option(categoria.nombre, categoria.id_categoria);
            let optionAsociarC = new Option(categoria.nombre, categoria.id_categoria);
            let optionDesvincularC = new Option(categoria.nombre, categoria.id_categoria);
            selectEliminar.add(optionEliminar);
            selectEditar.add(optionEditar);
            selectAsociarC.add(optionAsociarC);
            selectDesvincularC.add(optionDesvincularC);
        });
    })
    .catch(error => console.error('Error:', error));
}

//Borrar categoría

document.getElementById('Eliminar2').addEventListener('click', function() {
    const selectedCategoria = document.getElementById('seleccionCategoria');
    const id_categoria = selectedCategoria.value;

    if (id_categoria) {
        fetch('php/borrarCategoria.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: 'id_categoria=' + encodeURIComponent(id_categoria)
        })
        .then(response => response.json())
        .then(data => {
            showBootstrapAlert(data.success, data.message);
            if (data.success) {
                cargarCategorias();
            }
        })
        .catch(error => console.error('Error:', error));
    } else {
        showBootstrapAlert(false, "Por favor, seleccione una palabra para eliminar.");
    }
});

//Editar categoría

document.getElementById('Editar2').addEventListener('click', function() {
    const selected = document.getElementById('seleccionCategoriaEditar');
    const id_categoria = selected.value;
    const nueva_categoria = document.getElementById('EditarCategoria').value.trim();

    if (id_categoria && nueva_categoria) {
        fetch('php/editarCategoria.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'id_categoria=' + encodeURIComponent(id_categoria) + '&nueva_categoria=' + encodeURIComponent(nueva_categoria)
        })
        .then(response => response.json())
        .then(data => {
            showBootstrapAlert(data.success, data.message);
            if (data.success) {
                cargarCategorias();
            }
        })
        .catch(error => console.error('Error:', error));
    } else {
        showBootstrapAlert(false, "Por favor, seleccione una categoría y escriba un nuevo nombre para actualizar.");
    }
});

//Asociar Palabra a categoría

document.getElementById('Asociar').addEventListener('click', function() {
    var id_palabra = document.getElementById('seleccionPalabraCategoria').value;
    var id_categoria = document.getElementById('seleccionCategoriaPalabra').value;

    if (id_palabra && id_categoria) {
        fetch('php/Asociar.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: 'id_palabra=' + encodeURIComponent(id_palabra) + '&id_categoria=' + encodeURIComponent(id_categoria)
        })
        .then(response => response.json())
        .then(data => {
            showBootstrapAlert(data.success, data.message);
        })
        .catch(error => console.error('Error:', error));
    } else {
        showBootstrapAlert(false, "Por favor tanto una categoría como una palabra para asociar.");
    }
});

//Filtrado

document.getElementById('seleccionPalabraDesvincular').addEventListener('change', function() {
    var id_palabra = this.value;
    var selectCategoria = document.getElementById('seleccionCategoriaDesvincular');
    selectCategoria.innerHTML = '<option value="">Selecciona una categoría para Desvincular</option>';

    if (id_palabra) {
        fetch('php/getCategoriasPorPalabra.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: 'id_palabra=' + encodeURIComponent(id_palabra)
        })
        .then(response => response.json())
        .then(data => {
            data.forEach(categoria => {
                let option = new Option(categoria.nombre, categoria.id_categoria);
                selectCategoria.add(option);
            });
        })
        .catch(error => console.error('Error:', error));
    }
});

//Desvincular Palabra por categoría

document.getElementById('Desvincular').addEventListener('click', function() {
    const id_palabra = document.getElementById('seleccionPalabraDesvincular').value;
    const id_categoria = document.getElementById('seleccionCategoriaDesvincular').value;

    if (id_palabra && id_categoria) {
        fetch('php/desvincular.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: 'id_palabra=' + encodeURIComponent(id_palabra) + '&id_categoria=' + encodeURIComponent(id_categoria)
        })
        .then(response => response.json())
        .then(data => {
            showBootstrapAlert(data.success, data.message); 
            if (data.success) {
            }
        })
        .catch(error => console.error('Error:', error));
    } else {
        showBootstrapAlert(false, "Por favor, selecciona una palabra y una categoría para desvincular.");
    }
});

//Funcion de inicio de pagina

document.addEventListener('DOMContentLoaded', function() {
    cargarPalabras();
    cargarCategorias();
});