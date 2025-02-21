<?php

interface RepositorioEstoque
{
  /**
   * Retorna o histórico completo de movimentações do estoque
   * 
   * @return array
   * @throws RepositorioException
   */
  public function historico(): array;

  /**
   * Busca um produto pelo código interno dele
   * 
   * @return Produto
   * @throws RepositorioException
   */
  public function buscaProdutoPorCodigoInterno(string $codigo): Produto;

  /**
   * Busca um produto pelo código de barras dele
   * 
   * @return Produto
   * @throws RepositorioException
   */
  public function buscaProdutoPorCodigoBarras(string $codigo): Produto;

  /**
   * Busca dados do estoque de um produto pelo código interno dele
   * 
   * @return Produto
   * @throws RepositorioException
   */
  public function buscaEstoqueProduto(string $codigo): Estoque;

  /**
   * Registra uma movimentação de entrada no estoque
   * 
   * @return bool
   * @throws RepositorioException
   */
  public function entrada(string $codigo, int $adicao): bool;

  /**
   * Registra uma movimentação de saída no estoque para um produto não-vendável (interno)
   * 
   * @return bool
   * @throws RepositorioException
   */
  public function saidaInterno(string $codigo, int $remocao): bool;

  /**
   * Registra uma movimentação de saída no estoque para um produto vendável (externo)
   * 
   * @return bool
   * @throws RepositorioException
   */
  public function saidaExterno(string $codigo, int $remocao): bool;

  /**
   * Registra uma movimentação de entrada ou saída do estoque com o motivo e retorna o id
   * 
   * @return int
   * @throws RepositorioException
   */
  public function registraMovimentacao(string $quantidade, string $motivo, string $tipoMovimentacao): int;

  /**
   * Registra os produtos de uma movimentação de entrada ou saída do estoque
   * 
   * @return bool
   * @throws RepositorioException
   */
  public function registraProdutoMovimentacao(int $idMovimentacao, int $totalAnterior, int $totalPosterior, string $produto): bool;

  /**
   * Busca dados do estoque de um produto que está abaixo do estoque mínimo
   * 
   * @return array
   * @throws RepositorioException
   */
  public function buscaProdutosAbaixoEstoqueMinimo(): array;
}
