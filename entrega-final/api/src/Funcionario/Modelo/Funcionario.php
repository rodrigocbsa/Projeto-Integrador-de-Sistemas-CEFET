<?php

class Funcionario{

    public function __construct(
        public int $id = 0,
        public string $nome = '',
        public string $cargo = '',
        public ?Login $login = null
        ){
    }
    
    public function validar(){
        $problemas = [];
        if(!in_array($this->cargo, array_column(Cargo::cases(), 'value'), true)){
            array_push($problemas,'Nível de acesso inexistente.');
        }
        return $problemas;
    }
}