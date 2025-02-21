<?php

describe('RepositorioFuncionarioEmBDR', function() {

    $this->pdo = ConexaoTests::pdo();
    $this->repoMesa = null;
    $this->repoReserva = null;

    beforeAll( function() {
        $this->pdo->exec( file_get_contents( './scripts/dados-teste.sql' ) );
        $this->repoMesa = new RepositorioFuncionarioEmBDR($this->pdo);
    } );
    
    describe('consulta', function() {

        it('DADO QUE a funcao busca tenha sido chamada QUANDO o funcionario existir ENTAO devera ser retornado', function(): void {
            $resultado = $this->repoMesa->busca(1);
            expect( $resultado )->toBeAnInstanceOf('Funcionario' );
        });

        it('DADO QUE a funcao busca tenha sido chamada QUANDO o funcionario existir ENTAO devera ser retornado null', function(): void {
            $resultado = $this->repoMesa->busca(0);
            expect( $resultado )->toBeNull();
        });
    });

    
});