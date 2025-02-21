<?php

class Movimentacao{
    public function __construct(
        public int $id,
        public string $dia,
        public string $hora,
        public int $quantidade,
        public string $motivo,
        public string $tipo
    ){}
}