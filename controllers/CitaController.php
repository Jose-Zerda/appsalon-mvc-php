<?php

namespace Controllers;

use MVC\Router;

class CitaController
{
    public static function index(Router $router)
    {
        // if (!isset($_SESSION)) {
        //session_start();
        // }
        // // Verificar si la clave 'nombre' existe en $_SESSION
        // $nombre = isset($_SESSION['nombre']) ? $_SESSION['nombre'] : null;
        isSession();
        //session_start();

        isAuth();

        $router->render('cita/index', [
            'nombre' => $_SESSION['nombre'],
            'id' => $_SESSION['id']
        ]);
    }
}
