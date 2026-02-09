<?php

namespace Model;

class Servicio extends ActiveRecord
{
    // BD la configuración
    protected static $tabla = 'servicios';
    protected static $columnasDB = ['id', 'nombre', 'precio'];

    public $id;
    public $nombre;
    public $precio;

    public function __construct($args = [])
    {
        $this->id = $args['id'] ?? null;
        $this->nombre = $args['nombre'] ?? '';
        $this->precio = $args['precio'] ?? '';
    }

    public function validar()
    {
        if (!$this->nombre) {
            self::$alertas['error'][] = 'El nombre del Servicio es obligatorio';
        }
        if (!$this->precio) {
            self::$alertas['error'][] = 'El Precio del Servicio es obligatorio';
        }
        if (!is_numeric($this->precio)) { // Revisa que el precio sea un número
            self::$alertas['error'][] = 'El precio NO es válido';
        }
        return self::$alertas;
    }
}
