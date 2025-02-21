<?php

const NOME_MIN = 2;
const NOME_MAX = 100;
const NOME_MSG = 'O nome deve ter entre ' . NOME_MIN . ' e ' . NOME_MAX . ' caracteres.';

const TELEFONE_MIN = 9;
const TELEFONE_MAX = 15;
const TELEFONE_MSG = 'O telefone deve ter entre ' . TELEFONE_MIN . ' e ' . TELEFONE_MAX . ' dígitos.';


class Reserva {

    public function __construct(
        public int $id,
        public string $nome_cliente,
        public string $telefone,
        public string $dia,
        public string $hora,
        public int $reserva_cancelada,
        public int $reserva_concluida,
        public Mesa $mesa,
        public Funcionario $funcionario
    ) {}

    /**
     * Função para validar os dados de uma reserva. Retorna um array de problemas.
     * 
     * @return array<int,string>
     */
    public function validar(): array {
        $problemas = [];

        $this->validaNomeCliente($problemas);
        $this->validaTelefone($problemas);

        return $problemas;
    }

    // Funções Auxiliares
    private function validaNomeCliente(&$problemas): void {
        $tamanho = mb_strlen($this->nome_cliente);
        if ($tamanho < NOME_MIN || $tamanho > NOME_MAX) {
            $problemas[] = NOME_MSG;
        }
    }

    private function validaTelefone(&$problemas): void {
        $tamanho = mb_strlen($this->telefone);
        if($tamanho < TELEFONE_MIN || $tamanho > TELEFONE_MAX){
            $problemas[] = TELEFONE_MSG;
        }
        if(!preg_match('/^\d+$/', $this->telefone)){
            $problemas[] = "O telefone deve conter apenas números.";
        }
    }
}
