<?php

class RepositorioDashboardEmBDR implements RepositorioDashboard
{

  public function __construct(
    private PDO $pdo
  ){}


  public function consultarExtras(): array {
    try {

      $array = [];

      $ps = $this->pdo->prepare( 'SELECT COUNT(id) as reservas_feitas FROM reserva WHERE reserva_concluida != 0 AND reserva_cancelada != 1' );
      $ps->setFetchMode( PDO::FETCH_CLASS | PDO::FETCH_PROPS_LATE, Funcionario::class );
      $ps->execute( );
      $reservas_feitas = $ps->fetch();

      $ps = $this->pdo->prepare( 'SELECT COUNT(id) as pedidos_realizados FROM pedido' );
      $ps->setFetchMode( PDO::FETCH_CLASS | PDO::FETCH_PROPS_LATE, Funcionario::class );
      $ps->execute( );
      $pedidos_realizados = $ps->fetch();

      $ps = $this->pdo->prepare( 'SELECT SUM(total) as receita_total FROM pedido' );
      $ps->setFetchMode( PDO::FETCH_CLASS | PDO::FETCH_PROPS_LATE, Funcionario::class );
      $ps->execute( );
      $receita_total = $ps->fetch();

      array_push($array,$reservas_feitas,$pedidos_realizados,$receita_total);


      return $array;

    } catch ( PDOException $ex ) {
      throw new RepositorioException( 'Erro ao consultar o funcionário.', (int) $ex->getCode(), $ex );
    }
  }
}