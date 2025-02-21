<?php

describe('RepositorioGerenteEmBDR', function() {

    $this->pdo = ConexaoTests::pdo();
    $this->repo = null;

    beforeAll( function() {
        $this->pdo->exec( file_get_contents( './scripts/dados-teste.sql' ) );
        $this->repo = new RepositorioGerenteEmBDR($this->pdo);
    } );


    describe('consulta', function() {
        it('DADO QUE a funcao consultaVendasPorFuncionario tenha sido chamada QUANDO houver pedidos associados a um funcionario num intervalo fornecido ENTAO devera ser retornado um array associativo com o total de vendas por funcionario', function(): void {
            $resultado = $this->repo->consultaVendasPorFuncionario('2025-01-01','2025-01-20');
            expect($resultado)->toBeAn('array');
            expect($resultado)->toHaveLength(1); // existe apenas um funcionário em dados-teste.sql
            expect($resultado[0]['total_func'])->toBe(700.00);
        });

        it('DADO QUE a funcao consultaVendasPorCategoria tenha sido chamada QUANDO houver categorias com itens vendidos ENTAO devera ser retornado um array associativo com o total vendido por categoria de item', function() {
            $resultado = $this->repo->consultaVendasPorCategoria('2025-01-01','2025-01-20');
            expect($resultado)->toBeAn('array');
            expect($resultado)->toHaveLength(2); // existe apenas duas categorias em dados-teste.sql
            expect($resultado[0]['total_categ'])->toBe(50.00);
            expect($resultado[1]['total_categ'])->toBe(650.00);
        });

        it('DADO QUE a funcao consultaTotalVendas tenha sido chamada QUANDO houver vendas em determinados dias no intervalo fornecido ENTAO devera ser retornado um array associativo com o total vendido por dia', function() {
            $resultado = $this->repo->consultaTotalVendas('2025-01-01','2025-01-20');
            expect($resultado)->toBeAn('array');
            expect($resultado)->toHaveLength(3); // existe apenas duas categorias em dados-teste.sql
            expect($resultado[0]['total_dia'])->toBe(   100.00);
            expect($resultado[1]['total_dia'])->toBe(200.00);
            expect($resultado[2]['total_dia'])->toBe(400.00);
        });
    });
});