<?php

class RepositorioFuncionarioEmBDR implements RepositorioFuncionario
{

  public function __construct(
    private PDO $pdo
  ){}


  public function busca(int $id): Funcionario|null {
    try {

      $ps = $this->pdo->prepare( 'SELECT id, nome FROM funcionario WHERE id = :id' );
      $ps->setFetchMode( PDO::FETCH_CLASS | PDO::FETCH_PROPS_LATE, Funcionario::class );
      $ps->execute( [ 'id' => $id ] );
      $objeto = $ps->fetch();
      return $objeto === false ? null : $objeto;

    } catch ( PDOException $ex ) {
      throw new RepositorioException( 'Erro ao consultar o funcionário.', (int) $ex->getCode(), $ex );
    }
  }
}