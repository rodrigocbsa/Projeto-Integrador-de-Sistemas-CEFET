<?php

interface RepositorioDashboard
{
  /**
   * Busca dados referentes ao total de reservas feitas, pedidos realizados e receita total
   * 
   * @return array
   * @throws RepositorioException
   */
  public function consultarExtras(): array;
}
