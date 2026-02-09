<h1 class="nombre-pagina">Crear Nueva Cita</h1>
<p class="descripcion-pagina">Elige tus servicios y coloca tus datos:</p>

<?php
include_once __DIR__ . '/../templates/barra.php';
?>

<div id="app">
    <nav class="tabs">
        <button class="actual" type="button" data-paso="1">Servicios</button>
        <button type="button" data-paso="2">Información Cita</button>
        <button type="button" data-paso="3">Resumen</button>
    </nav>

    <div id="paso-1" class="seccion">
        <h2>Servicios</h2>
        <p class="text-center">Elige tus servicios a continuación</p>
        <div id="servicios" class="listado-servicios"></div>
    </div>
    <div id="paso-2" class="seccion">
        <h2>Tus Datos y Cita</h2>
        <p class="text-center">Coloca tus datos y fecha de cita</p>

        <form class="formulario">
            <div class="campo">
                <label for="nombre">Nombre</label>
                <input id="nombre" type="text" placeholder="Tu Nombre" value="<?php echo $nombre; ?>" disabled>
            </div>

            <div class="campo">
                <label for="fecha">Fecha</label>
                <input id="fecha" type="date" min="<?php echo date('Y-m-d', strtotime('+1 day'));
                                                    // min es la fecha minima que se va a mostrar
                                                    //Formato de fecha: Año: Y:2025 y:25
                                                    // Mes: M:Set m:09  n:9
                                                    // Día: D:Mon l:Monday d:08  j:8
                                                    // strtotime convierte un string a time. + 1 day permite que no se habilite la fecha de hoy, sino a partir de mañana
                                                    ?>">
            </div>



            <div class=" campo">
                <label for="hora">Hora</label>
                <input id="hora" type="time">
            </div>
            <input type="hidden" id="id" value="<?php echo $id; ?>">

        </form>

    </div>
    <div id="paso-3" class="seccion contenido-resumen">
        <h2>Resumen</h2>
        <p>Verifica que la información sea correcta</p>
    </div>
    <div class="paginacion">
        <button id="anterior" class="boton">&laquo; Anterior</button>
        <button id="siguiente" class="boton">Siguiente &raquo;</button>
    </div>
</div>
<?php
$script = "
    <script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>
    <script src='build/js/app.js'></script>
    ";
// El 1er script carga sweetalert, para enviar alertas.
?>