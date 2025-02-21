<?php

class Pedido{
    public function __construct(
        public int $id,
        public float $total,
        public int $mesa,
        public array $itens,
        public string $pagamento
    ){}
}