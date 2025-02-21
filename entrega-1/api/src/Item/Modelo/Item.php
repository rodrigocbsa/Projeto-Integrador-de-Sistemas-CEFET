<?php

class Item{
    public function __construct(
        public int $id,
        public string $categoria,
        public string $descricao,
        public int $quantidade,
        public float $preco
    ) {}
}