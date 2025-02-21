<?php

class Produto{

    public function __construct(
        public string $nome,
        public string $codigo,
        public string|null $ean_13,
        public string|null $vencimento,
        public string $categoria,
        public string $medida,
        public string $recebimento,
        public int $quantidade_recebimento
    ){}

}