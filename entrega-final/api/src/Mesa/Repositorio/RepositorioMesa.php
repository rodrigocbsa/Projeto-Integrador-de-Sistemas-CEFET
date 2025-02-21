<?php

interface RepositorioMesa{

  /**
   * Busca uma Mesa pelo id
   * 
   * @return Mesa|null
   * @throws RepositorioException
   */
  public function busca(int $id): Mesa|null;

  /**
  * Busca mesas disponíveis no dia e na hora indicados
  *
  * @return array<Mesa>
  * @throws RepositorioException
  */
  public function mesasDisponiveis(string $dia, string $hora): array;
}
