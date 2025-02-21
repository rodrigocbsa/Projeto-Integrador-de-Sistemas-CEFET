<?php

class RepositorioEstoqueEmBDR implements RepositorioEstoque
{
  public function __construct(
    private PDO $pdo
  ){}

  public function buscaEstoqueProduto(string $codigo): Estoque {
    try {
      $ps = $this->pdo->prepare('SELECT * FROM estoque e WHERE e.codigo_produto = :codigo');
      $ps->execute(['codigo' => $codigo]);
      $resultado = $ps->fetch(PDO::FETCH_ASSOC);

      if ($resultado === false) {
        throw new NaoEncontradoException('Produto não encontrado.');
      }

      $estoque = new Estoque(
        $resultado['id'],
        $resultado['estoque_minimo'],
        $resultado['estoque_atual'],
        $resultado['codigo_produto']
      );

      return $estoque;
    } catch (PDOException $ex) {
      throw new RepositorioException('Erro ao buscar dados do estoque pelo código do produto no banco de dados.', (int) $ex->getCode(), $ex);
    }
  }


  public function buscaProdutoPorCodigoInterno(string $codigo): Produto {
    try {
        $ps = $this->pdo->prepare('SELECT * FROM produto p WHERE p.codigo = :codigo');
        $ps->execute(['codigo' => $codigo]);
        $resultado = $ps->fetch(PDO::FETCH_ASSOC);

        if ($resultado === false) {
          throw new NaoEncontradoException('Produto não encontrado.');
        }

        $produto = new Produto(
          $resultado['nome'],
          $resultado['codigo'],
          $resultado['ean_13'],
          $resultado['vencimento'],
          $resultado['categoria'],
          $resultado['medida'],
          $resultado['recebimento'],
          $resultado['quantidade_recebimento']
        );

        return $produto;
    } catch (PDOException $ex) {
        throw new RepositorioException('Erro ao buscar o produto por código no banco de dados.', (int) $ex->getCode(), $ex);
    }
  }

  public function buscaProdutoPorCodigoBarras(string $ean): Produto {
    try {
      $ps = $this->pdo->prepare('SELECT * FROM produto p WHERE p.ean_13 = :ean');
      $ps->execute(['ean' => $ean]);
      $resultado = $ps->fetch(PDO::FETCH_ASSOC);

      if ($resultado === false) {
        throw new NaoEncontradoException('Produto não encontrado.');
      }

      $produto = new Produto(
        $resultado['nome'],
        $resultado['codigo'],
        $resultado['ean_13'],
        $resultado['vencimento'],
        $resultado['categoria'],
        $resultado['medida'],
        $resultado['recebimento'],
        $resultado['quantidade_recebimento']
      );

      return $produto;
  } catch (PDOException $ex) {
      throw new RepositorioException('Erro ao buscar o produto por código no banco de dados.', (int) $ex->getCode(), $ex);
  }
  }

  public function entrada(string $codigo, int $adicao): bool {
    try {

      $sql = 
      '
        UPDATE estoque SET estoque_atual = estoque_atual + :adicionado WHERE codigo_produto = :codigo_produto
      ';
      $ps = $this->pdo->prepare( $sql );
      $ps->execute( 
        [ 
          'adicionado' => $adicao,
          'codigo_produto' => $codigo
        ] 
      );

      return $ps->rowCount() > 0;

    } catch ( PDOException $ex ) {
      throw new RepositorioException( 'Erro ao adicionar ao estoque no banco de dados.', (int) $ex->getCode(), $ex );
    }
  }

  public function saidaExterno(string $codigo, int $remocao): bool {
    try {

      $sql = 
      '
        UPDATE estoque SET estoque_atual = estoque_atual - :removido WHERE codigo_produto = :codigo_produto;
        UPDATE dispensa SET total = total + (SELECT quantidade_recebimento FROM produto WHERE codigo = :codigo_produto) * :removido WHERE codigo_produto = :codigo_produto
      ';
      $ps = $this->pdo->prepare( $sql );
      $ps->execute( 
        [ 
          'removido' => $remocao,
          'codigo_produto' => $codigo
        ] 
      );

      return $ps->rowCount() > 0;

    } catch ( PDOException $ex ) {
      throw new RepositorioException( 'Erro ao adicionar ao estoque no banco de dados.', (int) $ex->getCode(), $ex );
    }
  }

  public function saidaInterno(string $codigo, int $remocao): bool {
    try {

      $sql = 
      '
        UPDATE estoque SET estoque_atual = estoque_atual - :removido WHERE codigo_produto = :codigo_produto;
        UPDATE dispensa SET total = total + :removido WHERE codigo_produto = :codigo_produto
      ';
      $ps = $this->pdo->prepare( $sql );
      $ps->execute( 
        [ 
          'removido' => $remocao,
          'codigo_produto' => $codigo
        ] 
      );

      return $ps->rowCount() > 0;

    } catch ( PDOException $ex ) {
      throw new RepositorioException( 'Erro ao adicionar ao estoque no banco de dados.', (int) $ex->getCode(), $ex );
    }
  }

  public function registraMovimentacao(string $quantidade, string $motivo, string $tipoMovimentacao): int{
    try {

      $sql = 'INSERT INTO movimentacao(quantidade,motivo,tipo) VALUES (:qtd,:m,:tm)';
      $ps = $this->pdo->prepare( $sql );
      $ps->execute( 
        [ 
          'qtd' => $quantidade,
          'm' => $motivo,
          'tm' => $tipoMovimentacao
        ] 
      );

      return $this->pdo->lastInsertId();

    } catch ( PDOException $ex ) {
      throw new RepositorioException( 'Erro ao registrar o motivo no banco de dados.', (int) $ex->getCode(), $ex );
    }
  }

  public function registraProdutoMovimentacao(int $idMovimentacao, int $totalAnterior, int $totalPosterior, string $produto): bool{
    try {

      $sql = 'INSERT INTO produto_movimentado VALUES (:ta,:tp,:p,:id)';
      $ps = $this->pdo->prepare( $sql );
      $ps->execute( 
        [ 
          'ta' => $totalAnterior,
          'tp' => $totalPosterior,
          'p' => $produto,
          'id' => $idMovimentacao
        ] 
      );

      return $ps->rowCount() > 0;

    } catch ( PDOException $ex ) {
      throw new RepositorioException( 'Erro ao registrar o produto movimentado no banco de dados.', (int) $ex->getCode(), $ex );
    }
  }

  public function historico(): array{
    try {
      $ps = $this->pdo->prepare('SELECT m.*,pm.*,p.* FROM movimentacao m JOIN produto_movimentado pm ON pm.movimentacao = m.id JOIN produto p ON p.codigo = pm.codigo_produto ORDER BY m.dia DESC, m.hora DESC');
      $ps->execute();
      $dados = $ps->fetchAll(PDO::FETCH_ASSOC);

      $movimentacoesProdutos = [];

      foreach($dados as $linha){

        $movimentacaoProduto = new stdClass();
        $movimentacaoProduto->movimentacao = new Movimentacao($linha['id'],$linha['dia'],$linha['hora'],$linha['quantidade'],$linha['motivo'],$linha['tipo']);
        $movimentacaoProduto->produto = new Produto($linha['nome'],$linha['codigo'],$linha['ean_13'] ?? '',$linha['vencimento'] ?? '',$linha['categoria'],$linha['medida'],$linha['recebimento'],$linha['quantidade_recebimento']);
        $movimentacaoProduto->produtoMovimentado = new ProdutoMovimentado($linha['total_anterior'],$linha['total_posterior'],$linha['codigo_produto'],$linha['movimentacao']);

        $movimentacoesProdutos []= $movimentacaoProduto;

      }

      return $movimentacoesProdutos;
    } catch (PDOException $ex) {
      throw new RepositorioException('Erro ao buscar dados do histórico do estoque no banco de dados.', (int) $ex->getCode(), $ex);
    }
  }

  public function buscaProdutosAbaixoEstoqueMinimo(): array {
    try {
      $ps = $this->pdo->prepare('SELECT p.nome,p.codigo FROM produto p JOIN estoque e ON e.codigo_produto = p.codigo WHERE e.estoque_atual < e.estoque_minimo');
      $ps->execute();
      return $ps->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $ex) {
      throw new RepositorioException('Erro ao buscar dados do estoque no banco de dados.', (int) $ex->getCode(), $ex);
    }
  }

}