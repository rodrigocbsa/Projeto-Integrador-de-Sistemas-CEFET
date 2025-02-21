<?php

interface RepositorioReserva
{
  /**
   * Retorna todas as reservas do banco de dados com instâncias completas de Reserva
   * 
   * @return array<Reserva>
   * @throws RepositorioException
   */
  public function todos(): array;
  
  /**
   * Cadastra uma Reserva
   * 
   * @return bool
   * @throws RepositorioException
   */
  public function adicionar(Reserva $reserva): bool;

  /**
   * Cancela uma Reserva pelo id
   * 
   * @return bool
   * @throws RepositorioException
   */
  public function cancelar(int $id): bool;

  /**
   * Conclui uma Reserva pelo id
   * 
   * @return bool
   * @throws RepositorioException
   */
  public function concluir(int $id): bool;

  /**
   * Retorna quantidade de reservas por data num dado período
   * 
   * @return array<string,int> 
   * @throws RepositorioException
   */
  public function consultar(string $data_inicio, string $data_fim): array;

  /**
   * Busca uma reserva pelo id
   * 
   * @return Reserva
   * @throws RepositorioException
   */
  public function busca(int $id): Reserva;
}
