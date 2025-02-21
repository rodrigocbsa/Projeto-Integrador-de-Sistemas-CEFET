<?php

class ProdutoMovimentado{
    public function __construct(
        public int $total_anterior,
        public int $total_posterior,
        public string $codigo_produto,
        public int $movimentacao
    ){}
}