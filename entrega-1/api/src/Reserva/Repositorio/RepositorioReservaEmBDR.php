<?php

class RepositorioReservaEmBDR implements RepositorioReserva
{

  public function __construct(
    private PDO $pdo
  ){}

  public function busca(int $id): Reserva {
    try {
      $ps = $this->pdo->prepare( 'SELECT * FROM reserva WHERE id = :id' );
      $ps->execute( [ 'id' => $id ] );
      $ps->setFetchMode(PDO::FETCH_ASSOC);
      $resultado = $ps->fetch();

      if ($resultado === false) {
          throw new RepositorioException('Reserva não encontrada.');
      }

      return new Reserva(
        $resultado['id'],
        $resultado['nome_cliente'],
        $resultado['telefone'],
        $resultado['dia'],
        $resultado['hora'],
        $resultado['reserva_cancelada'],
        $resultado['reserva_concluida'],
        new Mesa($resultado['mesa']),
        new Funcionario($resultado['funcionario'])
      );
    } catch ( PDOException $ex ) {
      throw new RepositorioException( 'Erro ao buscar a reserva no banco de dados.', (int) $ex->getCode(), $ex );
    }
  }

  public function todos(): array
  {
    try{
        $ps = $this->pdo->prepare('SELECT * FROM reserva ORDER BY dia ASC, hora ASC');
        $ps->execute();
        $dados = $ps->fetchAll(PDO::FETCH_ASSOC);

        $reservas = [];
        foreach ($dados as $linha) {
          
          $ps = $this->pdo->prepare('SELECT * FROM mesa WHERE id = :id');
          $ps->execute(['id' => $linha['mesa']]);
          $dados_mesa = $ps->fetch(PDO::FETCH_ASSOC);
          $mesa = new Mesa($dados_mesa['id'],$dados_mesa['numero']); // Mapeia o objeto Mesa

          $ps = $this->pdo->prepare('SELECT id,nome FROM funcionario WHERE id = :id');
          $ps->execute(['id' => $linha['funcionario']]);
          $dados_funcionario = $ps->fetch(PDO::FETCH_ASSOC);
          $funcionario = new Funcionario($dados_funcionario['id'],$dados_funcionario['nome']); // Mapeia o objeto Funcionario
          
          $reserva = new Reserva(
            $linha['id'],
            $linha['nome_cliente'],
            $linha['telefone'],
            $linha['dia'],
            $linha['hora'],
            $linha['reserva_cancelada'],
            $linha['reserva_concluida'],
            $mesa,
            $funcionario
          );  // Mapeia o objeto Reserva
          $reservas []= $reserva;
        }

        return $reservas;

    }catch(PDOException $ex){
      throw new RepositorioException('Erro ao buscar as reservas no banco de dados.', (int) $ex->getCode(), $ex );
    }
  }


  public function adicionar($reserva): bool {
    try {

      $sql = 'INSERT INTO reserva (nome_cliente,telefone,dia,hora,mesa,funcionario) 
                VALUES (:nome_cliente,:telefone,:dia,:hora,:mesa,:funcionario);
              INSERT INTO funcionario_reserva(funcionario,reserva) 
                VALUES (:funcionario,
                  (SELECT id FROM reserva WHERE dia = :dia AND hora = :hora AND mesa = :mesa AND funcionario = :funcionario))
      ';
      $ps = $this->pdo->prepare( $sql );
      $ps->execute( 
        [ 
          'nome_cliente' => $reserva->nome_cliente,
          'telefone' => $reserva->telefone,
          'dia' => $reserva->dia,
          'hora' => $reserva->hora,
          'mesa' => $reserva->mesa->id,
          'funcionario' => $reserva->funcionario->id 
        ] 
      );

      return $ps->rowCount() > 0;

    } catch ( PDOException $ex ) {
      throw new RepositorioException( 'Erro ao adicionar a reserva no banco de dados.', (int) $ex->getCode(), $ex );
    }
  }

  public function cancelar(int $id): bool {
    try {
      $ps = $this->pdo->prepare( 'UPDATE reserva SET reserva_cancelada = 1 WHERE id = :id' );
      $ps->execute( [ 'id' => $id ] );
      return $ps->rowCount() > 0;
    } catch ( PDOException $ex ) {
      throw new RepositorioException( 'Erro ao cancelar a reserva no banco de dados.', (int) $ex->getCode(), $ex );
    }
  }

  public function concluir(int $id): bool {
    try {
      $ps = $this->pdo->prepare( 'UPDATE reserva SET reserva_concluida = 1 WHERE id = :id' );
      $ps->execute( [ 'id' => $id ] );
      return $ps->rowCount() > 0;
    } catch ( PDOException $ex ) {
      throw new RepositorioException( 'Erro ao concluir a reserva no banco de dados.', (int) $ex->getCode(), $ex );
    }
  }

  public function consultar(string $data_inicio, string $data_fim): array {
    try{
      $ps = $this->pdo->prepare('SELECT dia, COUNT(*) AS quantidade FROM reserva WHERE dia BETWEEN :data_inicio AND :data_fim AND reserva_cancelada = 0 GROUP BY dia ORDER BY dia ASC');
      $ps->execute( [ 'data_inicio' => $data_inicio, 'data_fim' => $data_fim ] );
      return $ps->fetchAll( PDO::FETCH_ASSOC );
    } catch ( PDOException $ex ) {
      throw new RepositorioException( 'Erro ao buscar as reservas no período no banco de dados.', (int) $ex->getCode(), $ex );
    } 
  }
}