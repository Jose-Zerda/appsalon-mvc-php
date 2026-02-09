<?php

namespace Controllers;

use Model\AdminCita;
use MVC\Router;

class AdminController
{
    public static function index(Router $router)
    {
        isSession();

        isAdmin();



        $fecha = $_GET['fecha'] ?? date('Y-m-d'); //Toma la fecha del GET, caso contrario (??) toma la fecha del servidor

        $fechas = explode('-', $fecha); //Separa la var fecha (string) por el caracter:- y lo convierte en un array de 3 posiciones.

        if (!checkdate($fechas[1], $fechas[2], $fechas[0])) {
            header('Location: /404'); //Revisa la fecha: [1] mes, [2] día y [0] año. Si no pasa ésta validación lo envía a página de error 404
        }

        //Consultar la BD
        $consulta = "SELECT citas.id, citas.hora, CONCAT( usuarios.nombre, ' ', usuarios.apellido) as cliente, ";
        $consulta .= " usuarios.email, usuarios.telefono, servicios.nombre as servicio, servicios.precio  ";
        $consulta .= " FROM citas  ";
        $consulta .= " LEFT OUTER JOIN usuarios ";
        $consulta .= " ON citas.usuarioId=usuarios.id  ";
        $consulta .= " LEFT OUTER JOIN citasServicios ";
        $consulta .= " ON citasServicios.citaId=citas.id ";
        $consulta .= " LEFT OUTER JOIN servicios ";
        $consulta .= " ON servicios.id=citasServicios.servicioId ";
        $consulta .= " WHERE fecha =  '{$fecha}' ";

        $citas = AdminCita::SQL($consulta);

        $router->render('admin/index', [
            'nombre' => $_SESSION['nombre'],
            'citas' => $citas,
            'fecha' => $fecha
        ]);
    }
}
