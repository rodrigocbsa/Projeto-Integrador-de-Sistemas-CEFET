<?php

class RepositorioMesaEmBDR implements RepositorioMesa
{

  public function __construct(
    private PDO $pdo
  ){}

  public function busca(int $id): Mesa|null {
    try {

      $ps = $this->pdo->prepare( 'SELECT id, numero FROM mesa WHERE id = :id' );
      $ps->setFetchMode( PDO::FETCH_CLASS | PDO::FETCH_PROPS_LATE, Mesa::class );
      $ps->execute( [ 'id' => $id ] );
      $objeto = $ps->fetch();
      return $objeto === false ? null : $objeto;
      
    } catch ( PDOException $ex ) {
      throw new RepositorioException( 'Erro ao consultar a mesa.', (int) $ex->getCode(), $ex );
    }
  }


  public function mesasDisponiveis(string $data, string $hora): array{

    try {
      $ps = $this->pdo->prepare(
        'SELECT m.id, m.numero FROM mesa m 
          WHERE NOT EXISTS (
             SELECT 1 
             FROM reserva r 
             WHERE 
                 r.mesa = m.id 
                 AND r.dia = :dia 
                 AND r.reserva_concluida = 0 
                 AND (
                    :hora >= r.hora 
                    AND :hora < ADDTIME(r.hora, "02:00:00")
                 )
          )
          OR EXISTS (
             SELECT 1 
             FROM reserva rr 
             WHERE 
                 rr.mesa = m.id 
                 AND rr.dia = :dia 
                 AND rr.reserva_cancelada = 1
                 AND (
                    :hora >= rr.hora 
                    AND :hora <= ADDTIME(rr.hora, "02:00:00")
                 ))'
      );
      
      $ps->setFetchMode( PDO::FETCH_CLASS | PDO::FETCH_PROPS_LATE, Mesa::class );
      $ps->execute( [ 'dia' => $data, 'hora' => $hora ] );
      return $ps->fetchAll();

    } catch (PDOException $ex) {

      throw new RepositorioException( 'Erro ao consultar as mesas disponíveis.', (int) $ex->getCode(), $ex );
    
    }
  }
}