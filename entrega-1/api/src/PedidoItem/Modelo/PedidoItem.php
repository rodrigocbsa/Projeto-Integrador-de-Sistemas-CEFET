<?php

class PedidoItem{
    public function __construct(
        public int $quantidade = 0,
        public int $pedido = 0,
        public int $item = 0
    ) {}
}