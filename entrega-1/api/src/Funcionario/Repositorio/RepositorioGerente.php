<?php

interface RepositorioGerente{

    /**
     * Retorna o funcionário (id) e o total vendido por funcionário num dado período.
     * @param string $dataInicial
     * @param string $dataFinal
     * @return array['funcionario' => int, 'total_func' => float]
     * @throws RepositorioException
     */
    public function consultaVendasPorFuncionario($dataInicial,$dataFinal): array;


    /**
     * Retorna o total vendido por categoria num dado período.
     * @param string $dataInicial
     * @param string $dataFinal
     * @return array['categoria' => string, 'total_categ' => float]
     * @throws RepositorioException
     */
    public function consultaVendasPorCategoria($dataInicial,$dataFinal): array;


    /**
     * Retorna o total vendido por dia num dado período.
     * @param string $dataInicial
     * @param string $dataFinal
     * @return array['dia' => string, 'total_dia' => float]
     * @throws RepositorioException
     */
    public function consultaTotalVendas($dataInicial,$dataFinal): array;

    /**
     * Cadastra um nome funcionário no banco de dados
     * @param Login $usuario
     * @param string $nome_funcionario
     * @return bool
     * @throws RepositorioException
     */
    public function cadastrarFuncionarioComLogin($usuario,$nome_funcionario): bool;
}