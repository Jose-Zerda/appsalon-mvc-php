<?php

namespace Controllers;

use Model\Cita;
use Model\CitaServicio;
use Model\Servicio;

class APIController
{
    public static function index()
    {
        $servicios = Servicio::all(); // Trae todos los registros de la tabla Servicio

        echo json_encode($servicios); // Convierte el array $servicios a json (objeto en JavaScript) que es lo mismo que un array asociativo.
    }
    public static function guardar()
    {
        // Almacena la Cita y devuelve el Id
        $cita = new Cita($_POST);
        $resultado = $cita->guardar();

        $id = $resultado['id'];

        // Almacena los Servicios con el ID de la Cita

        $idServicios = explode(",", $_POST['servicios']); // Separa (explode) el string que viene en servicios y que está separado por comas y lo transforma en array ($idServicios). Toma 2 parametros: 1ro el separador (",") y 2do el string a separar ($_POST['servicios'])

        foreach ($idServicios as $idServicio) {
            $args = [
                'citaId' => $id,
                'servicioId' => $idServicio
            ];
            $citaServicio = new CitaServicio($args);
            $citaServicio->guardar();
        }

        echo json_encode(['resultado' => $resultado]);
    }

    public static function eliminar()
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $id = $_POST['id'];

            $cita = Cita::find($id);
            $cita->eliminar();

            header('Location:' . $_SERVER['HTTP_REFERER']); //Redirecciona hacia la misma página de la que viene
        }
    }
}
