<?php

interface RepositorioPedido{
    /**
     * Adiciona um pedido à mesa
     * 
     * @param Pedido $pedido
     * @return bool
     * @throws RepositorioException
     */
    public function adicionar(Pedido $pedido): bool;
}