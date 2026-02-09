let paso = 1;
const pasoInicial = 1;
const pasoFinal = 3;

const cita = { // Objeto con los datos de la cita. Se van a obtener al seleccionar los servicios, la fecha y la hora.
    id: '',
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

document.addEventListener('DOMContentLoaded', function () {
    iniciarApp();
});

function iniciarApp() {
    mostrarSeccion(); // Muestra y oculta las secciones.

    tabs(); // Cambia la sección cuando se presionan los tabs

    botonesPaginador(); // Agrega o quita los botones del paginador.

    paginaSiguiente();

    paginaAnterior();

    consultarAPI(); // Consulta la API en el backend de PHP

    idCliente();

    nombreCliente();//Añade el nombre del cliente al objeto cita

    seleccionarFecha();//Añade la fecha en el objeto cita

    seleccionarHora();//Añade la hora en el objeto cita

    mostrarResumen();//Muestra el resumen de la cita

}

function mostrarSeccion() {
    // Ocultar la sección que tenga la clase de mostrar
    const seccionAnterior = document.querySelector('.mostrar');
    if (seccionAnterior) {
        seccionAnterior.classList.remove('mostrar');
    }
    // Seleccionar la sección con el paso...
    const pasoSelector = `#paso-${paso}`;
    const seccion = document.querySelector(pasoSelector);
    seccion.classList.add('mostrar');
    // Quita la clase de actual al tab anterior
    const tabAnterior = document.querySelector('.actual');
    if (tabAnterior) {
        tabAnterior.classList.remove('actual');
    }
    // Resalta el tab actual
    const tab = document.querySelector(`[data-paso="${paso}"]`);
    tab.classList.add('actual');
}

function tabs() {
    const botones = document.querySelectorAll('.tabs button');

    botones.forEach(boton => { // Itera sobre cada uno de los tabs
        boton.addEventListener('click', function (e) {
            //console.log(parseInt(e.target.dataset.paso)); Muestra sobre cual tab se hizo click. parseInt lo convierte en entero.
            paso = parseInt(e.target.dataset.paso);

            mostrarSeccion();

            botonesPaginador();
        });
    })
}
// Función que valida la paginación (ocultar o mostrar el paginador)
function botonesPaginador() {
    const paginaAnterior = document.querySelector('#anterior');
    const paginaSiguiente = document.querySelector('#siguiente');

    if (paso === 1) {
        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    } else if (paso === 3) {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.add('ocultar');

        mostrarResumen();
    } else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }
    mostrarSeccion();
}

function paginaAnterior() {
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', function () {
        if (paso <= pasoInicial) return;
        paso--;

        botonesPaginador();
    })
}

function paginaSiguiente() {
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', function () {
        if (paso >= pasoFinal) return;
        paso++;

        botonesPaginador();
    })
}

async function consultarAPI() { // Función asincrónica. Permite ejecutar simultaneamente otra funciones. Mejora la performance.

    try { // Intenta ejecutar el siguiente código. Si no se puede (catch), muestra el error.
        const url = '/api/servicios'; // Consulta la BD, a traves de la API
        // Funciona si el proyecto queda el backend y los archivos JS en el mismo dominio. Si no es así conviene usar lo siguiente:
        // Se reemplaza por un template string: const url = `${location.origin}/api/servicios`;

        const resultado = await fetch(url); // await detiene la ejecución de las lineas sgtes de código hasta que se complete. Consulta la API con fetch

        const servicios = await resultado.json(); // Obtiene los resultados como json.

        mostrarServicios(servicios);

    } catch (error) {
        console.log(error);
    }
}
function mostrarServicios(servicios) {
    servicios.forEach(servicio => { // Itera sobre cada servicio.
        const { id, nombre, precio } = servicio; //Aplica un destructuring (descompone una estructura(array, objetos)extrayendo sus valores y asignandolos a variables individuales, en una sola operación)a servicio. Extrae el valor y crea una variable.

        // Crea los elementos de HTML con sus respectivos valores.
        const nombreServicio = document.createElement('P'); //Crea un elemento parrafo en HTML. El elemento debe estar en MAYUSCULAS (ej: P, DIV, etc)
        nombreServicio.classList.add('nombre-servicio'); //Agrega una clase (nombre-servicio) para darle estilo en CSS.
        nombreServicio.textContent = nombre; // Muestra el nombre (textContent) de cada servicio

        // Idem para el precio de cada servicio
        const precioServicio = document.createElement('P');
        precioServicio.classList.add('precio-servicio');
        precioServicio.textContent = `$ ${precio}`;//Template string para mostrar el signo $ antes del precio.

        // Crea un contenedor div para cada servicio
        const servicioDiv = document.createElement('DIV');
        servicioDiv.classList.add('servicio');// Le adiciona una clase (servicio) para darle estilo en CSS.

        servicioDiv.dataset.idServicio = id; // Crea un atributo personalizado para cada elemento (id)

        // Pasar un dato de una funcion a otra
        servicioDiv.onclick = function () { //Funcion (callback)que se ejecuta al hacer click en el div
            seleccionarServicio(servicio);// Pasa el servicio en el que se hizo click.
        }

        servicioDiv.appendChild(nombreServicio);//Muestra en pantalla cada elemento (cada servicio)
        servicioDiv.appendChild(precioServicio);

        document.querySelector('#servicios').appendChild(servicioDiv);//Inyecta el codigo generado en el div que tiene el id de servicios en index.php de cita de views
        // Al ir iterando sobre el array servicios, va a mostrar todos los servicios.
    });
}
function seleccionarServicio(servicio) {
    const { id } = servicio; // Extrae el id
    const { servicios } = cita; // Extrae el array de servicios del objeto cita declarado al inicio.

    // Identifica el elemento al que se le da click (data-id-servicio)
    const divServicio = document.querySelector(`[data-id-servicio="${id}"]`);

    // Comprobar si un servicio ya fue agregado
    if (servicios.some(agregado => agregado.id === id)) {
        //some itera sobre todo el array (servicios) y retorna True o False en caso de que un elemento ya exista

        // Eliminarlo si ya existe
        cita.servicios = servicios.filter(agregado => agregado.id !== id);//filter permite eliminar un elemento basado en cierta condicion
        divServicio.classList.remove('seleccionado');// Remueve la clase seleccionado al hacer click en un servicio ya seleccionado
    } else {
        // Al darle click al servicio, lo agrega si no existe
        cita.servicios = [...servicios, servicio]; // (... spread operator) Toma una copia del array de servicios(...servicios) y agrega el nuevo servicio al final(servicio). Similar a APPEND.
        divServicio.classList.add('seleccionado');//Le agrega la clase 'seleccionado' a divServicio para resaltarlo mediante CSS
    }
}
// Asigna el id del cliente al array cita
function idCliente() {
    cita.id = document.querySelector('#id').value;
}

//Asigna el nombre del cliente al array cita
function nombreCliente() {
    cita.nombre = document.querySelector('#nombre').value;//Asigna al elemento nombre del array cita el valor de nombre
}
function seleccionarFecha() {
    const inputFecha = document.querySelector('#fecha');
    inputFecha.addEventListener('input', function (e) {// Se pasa el evento (e)

        const dia = new Date(e.target.value).getUTCDay();// Instancia el objeto de fecha que el usuario seleccionó. getUTCDay() pasa los dias numerados: 0 domingo, 1 lunes, etc

        if ([6, 0].includes(dia)) {// [6, 0]Genera un array con los dias del fin de semana (sabado y domingo). includes es un array method que comprueba si un valor existe
            e.target.value = '';// Borra la fecha seleccionada si es fin de semana
            mostrarAlerta('Fines de semana CERRADO', 'error', '.formulario');// Muestra un alerta
        } else {
            cita.fecha = e.target.value;// Si no es fin de semana guarda el valor de la fecha en el objeto cita.
        }
    });
}
function seleccionarHora() {
    const inputHora = document.querySelector('#hora');// Selecciona el elemento hora
    inputHora.addEventListener('input', function (e) {// Se accede al evento (e)

        const horaCita = e.target.value;
        const hora = horaCita.split(":")[0];// split separa una cadena de texto con el separador ":" y lo convierte en array. El primer elemento [0] lo asigna a la var hora
        if (hora < 10 || hora > 18) {
            e.target.value = '';// Blanquea la hora No Válida ingresada
            mostrarAlerta('Hora No Valida', 'error', '.formulario');
        } else {
            cita.hora = e.target.value;// Guarda en el elemento hora del objeto cita, el valor ingresado
        }
    });
}
function mostrarAlerta(mensaje, tipo, elemento, desaparece = true) {// elemento es el lugar donde se lo va a colocar
    //Previene que se generen mas de 1 alerta
    const alertaPrevia = document.querySelector('.alerta');
    if (alertaPrevia) {
        alertaPrevia.remove();
    }

    //Scripting para crear la alerta
    const alerta = document.createElement('DIV');// Crea un elemento div para la alerta
    alerta.textContent = mensaje;// Le agrega el contenido del mensaje
    alerta.classList.add('alerta');// Le agrega una clase llamada alerta para darle estilo en CSS
    alerta.classList.add(tipo);// le agrega una clase para el tipo de alerta (error o exito)

    const referencia = document.querySelector(elemento);
    referencia.appendChild(alerta);

    if (desaparece) {// Si desaparece es true
        //Remueve la alerta luego de 3 segundos
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}
function mostrarResumen() {
    const resumen = document.querySelector('.contenido-resumen');

    // Limpiar el div (contenido) de Resumen cada vez que se manda a llamar mostrarResumen()
    while (resumen.firstChild) {
        resumen.removeChild(resumen.firstChild);
    }

    // Comprueba si todos los datos están cargados
    if (Object.values(cita).includes('') || cita.servicios.length === 0) {// Object.values itera sobre todos los valores de un objeto. Devuelve esos valores. Si alguno de estos tiene un espacio en blanco (.includes('')) o si el array de servicios está vacío (cita.servicios.length === 0) muestra la alerta
        mostrarAlerta('Faltan datos de Servicio, Fecha u Hora', 'error', '.contenido-resumen', false); // false para que la alerta NO desaparezca
        return;
    }
    //Formatear el div de resumen
    const { nombre, fecha, hora, servicios } = cita;// Hace un destructuring extrayendo los datos de cita para evitar estar escribiendo: cita.nombre, cita.fecha, cita.hora, cita.servicios

    //Heading para Servicios en Resumen
    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de Servicios seleccionados';
    resumen.appendChild(headingServicios);

    //Iterando y mostrando los servicios seleccionados por el cliente
    servicios.forEach(servicio => {
        const { id, precio, nombre } = servicio; // Aplica destructuring a servicio
        const contenedorServicio = document.createElement('DIV');// Cada servicio se coloca en un div
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;// Crea un parrafo con el nombre del servicio

        const precioServicio = document.createElement('P');
        precioServicio.innerHTML = `<span>Precio:</span> $${precio}`;// Parrafo con el precio del servicio. Tiene innerHTML porque se agrega un span para darle formato con CSS

        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        resumen.appendChild(contenedorServicio);
    });

    //Heading del Cliente en Resumen
    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Resumen de la Cita';
    resumen.appendChild(headingCita);

    const nombreCliente = document.createElement('P');
    nombreCliente.innerHTML = `<span>Nombre del Cliente:</span> ${nombre}`;// Muestra en un parrafo ('P') Nombre del Cliente: y el contenido de nombre (${nombre})

    //Dar formato a la fecha
    const fechaObj = new Date(fecha);// Instancia la fecha.Crea un nuevo objeto (fechaObj) con la fecha ingresada (Date(fecha))
    const mes = fechaObj.getMonth();// Obtiene el mes en nro pero empieza con enero = 0
    const dia = fechaObj.getDate() + 2;// Obtiene el dia -1 porque al ser un objeto el dia 1 equivale a 0 y asi sucesivamente. El +2 es xq Date() se instancia 2 veces (new Date()) y hay un desfasaje de 1 dia cada vez que se lo instancia
    const year = fechaObj.getFullYear();// Obtiene el año completo: 2025

    const fechaUTC = new Date(Date.UTC(year, mes, dia));// Crea (instancía) la fecha con los valores de year, mes, dia

    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }//weekday:'long' dia de la semana largo, ej: Jueves - year:'numeric' ej:2025 - month:'long' ej: octubre - day:'numeric' ej: 16

    const fechaFormateada = fechaUTC.toLocaleDateString('es-AR', opciones);//toLocaleDateString devuelve una fecha ya formateada en un idioma especifico ('es-AR' español de Argentina) y con las opciones arriba declaradas

    // Todo el formateo anterior NO modifica el array original de fecha

    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha:</span> ${fechaFormateada}`;

    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora:</span> ${hora}`;

    //Boton para Crear una cita
    const botonReservar = document.createElement('BUTTON');
    botonReservar.classList.add('boton');
    botonReservar.textContent = 'Reservar Cita';
    botonReservar.onclick = reservarCita;// Al hacer click sobre el botón se ejecuta reservarCita

    resumen.appendChild(nombreCliente);
    resumen.appendChild(fechaCita);
    resumen.appendChild(horaCita);
    resumen.appendChild(botonReservar);
}
async function reservarCita() {

    const { nombre, fecha, hora, servicios, id } = cita; //Extrae nombre, fecha hora y servicios del objeto cita.

    const idServicios = servicios.map(servicio => servicio.id);

    const datos = new FormData();

    datos.append('fecha', fecha);
    datos.append('hora', hora);
    datos.append('servicios', idServicios);
    datos.append('usuarioId', id);

    //console.log([...datos]);

    try {
        // Petición hacia la api
        const url = '/api/citas'

        const respuesta = await fetch(url, {
            method: 'POST',
            body: datos //Es el cuerpo de la petición a enviar
        });

        const resultado = await respuesta.json();

        if (resultado.resultado) {
            //Carga una alerta seleccionada de sweetalert. 1ro se debe cargar el script al final del index.php de views/cita, luego se copia el contenido del tipo de alerta y se lo pega para utilizarlo(­↓)
            Swal.fire({
                icon: "success",
                title: "Cita Creada",
                text: "Tu cita fue agendada correctamente. Gracias por elegirnos!!",
                //footer: '<a href="#">Why do I have this issue?</a>'
                button: 'OK'
            }).then(() => {
                setTimeout(() => {

                }, 3000);
                window.location.reload();
            })
        }

    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error...",
            text: "Hubo un error al guardar la cita. Por favor inténtelo nuevamente"
        });
    }
    //console.log([...datos]);
}
