<?php

class RepositorioGerenteEmBDR implements RepositorioGerente{

    public function __construct(
        private PDO $pdo
    ){}

    public function cadastrarFuncionarioComLogin($funcionario): bool{
        try {

            $sql = '

                INSERT INTO login(usuario,senha,sal,pimenta) VALUES (:usuario,:hash,:sal,:pimenta);

                INSERT INTO funcionario(nome,cargo,login) VALUES (:nome,:cargo,(SELECT id FROM login WHERE usuario = :usuario AND senha = :hash))
            ';
            $ps = $this->pdo->prepare( $sql );
            $ps->execute( 
              [ 
                'usuario' => $funcionario->login->usuario,
                'hash' => $funcionario->login->senha,
                'sal' => $funcionario->login->sal,
                'pimenta' => $funcionario->login->pimenta,
                'nome' => $funcionario->nome,
                'cargo' => $funcionario->cargo
              ] 
            );
      
            return $ps->rowCount() > 0;
      
        } catch ( PDOException $ex ) {
            throw new RepositorioException( 'Erro ao adicionar o funcionário com login no banco de dados.', (int) $ex->getCode(), $ex );
        }
    }

    public function consultaVendasPorFuncionario($dataInicial,$dataFinal): array{
        try{
            $ps = $this->pdo->prepare('
            
            SELECT f.nome,SUM(p.total) as total_func FROM funcionario f 
            JOIN reserva r 
            ON f.id = r.funcionario 
            JOIN pedido p 
            ON p.mesa = r.mesa 
            WHERE r.dia BETWEEN :data_inicio AND :data_fim 
            GROUP BY f.nome 
            ORDER BY total_func ASC
            
            ');
            $ps->execute(
                [
                    'data_inicio' => $dataInicial,
                    'data_fim' => $dataFinal
                ]
            );
            return $ps->fetchAll(PDO::FETCH_ASSOC);
        }catch(PDOException $ex){
          throw new RepositorioException('Erro ao consultar no banco de dados.', (int) $ex->getCode(), $ex );
        }
    }

    public function consultaVendasPorCategoria($dataInicial,$dataFinal): array{
        try{
            $ps = $this->pdo->prepare('

            SELECT i.categoria,SUM(i.preco * pi.quantidade) as total_categ FROM item i 
            JOIN pedido_item pi 
            ON i.id = pi.item 

            JOIN pedido p 
            ON pi.pedido = p.id 
            JOIN reserva r 
            ON p.mesa = r.mesa 
            WHERE r.dia BETWEEN :data_inicio AND :data_fim 

            GROUP BY i.categoria 
            ORDER BY total_categ ASC
            
            ');
            $ps->execute(
                [
                    'data_inicio' => $dataInicial,
                    'data_fim' => $dataFinal
                ]
            );
            return $ps->fetchAll(PDO::FETCH_ASSOC);
        }catch(PDOException $ex){
          throw new RepositorioException('Erro ao consultar no banco de dados.', (int) $ex->getCode(), $ex );
        }
    }


    public function consultaTotalVendas($dataInicial,$dataFinal): array{
        try{
            $ps = $this->pdo->prepare('

            SELECT r.dia,SUM(p.total) AS total_dia FROM pedido p 
            JOIN reserva r 
            ON r.mesa = p.mesa 
            WHERE r.dia BETWEEN :data_inicio AND :data_fim 
            GROUP BY r.dia 
            ORDER BY r.dia ASC
            
            ');
            $ps->execute(
                [
                    'data_inicio' => $dataInicial,
                    'data_fim' => $dataFinal
                ]
            );
            return $ps->fetchAll(PDO::FETCH_ASSOC);
        }catch(PDOException $ex){
          throw new RepositorioException('Erro ao consultar no banco de dados.', (int) $ex->getCode(), $ex );
        }
    }


    public function consultaTotalPorPagamento($dataInicial,$dataFinal): array{
        try{
            $ps = $this->pdo->prepare('

            SELECT p.pagamento,SUM(p.total) as total_pag FROM pedido p 
            JOIN reserva r 
            ON p.mesa = r.mesa 
            WHERE r.dia BETWEEN :data_inicial AND :data_final 
            GROUP BY p.pagamento 
            ORDER BY total_pag ASC;
            
            ');
            $ps->execute(
                [
                    'data_inicial' => $dataInicial,
                    'data_final' => $dataFinal
                ]
            );
            return $ps->fetchAll(PDO::FETCH_ASSOC);
        }catch(PDOException $ex){
          throw new RepositorioException('Erro ao consultar no banco de dados.', (int) $ex->getCode(), $ex );
        }
    }
}