<?php
class Estoque{
    public function __construct(
        public int $id,
        public int $estoque_minimo,
        public int $estoque_atual,
        public string $codigo_produto
    ) {}
}