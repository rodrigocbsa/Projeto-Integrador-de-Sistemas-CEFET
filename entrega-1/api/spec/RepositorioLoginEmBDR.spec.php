<?php

describe('RepositorioLoginEmBDR', function() {

    $this->pdo = ConexaoTests::pdo();
    $this->repoLogin = null;

    beforeAll( function() {
        $this->pdo->exec( file_get_contents( './scripts/dados-teste.sql' ) );
        $this->repoLogin = new RepositorioLoginEmBDR($this->pdo);
    } );


    describe('consulta', function() {
        it('DADO QUE a login tenha sido chamada QUANDO o usuario for existente ENTAO deverao ser retornados o nome o usuario e o acesso', function() {
            $login = new stdClass();
            $login->senha = 'teste';
            $login->usuario = 'teste';
            $resultado = $this->repoLogin->login($login);
            expect($resultado)->toBeAn('array');
            expect($resultado['nome'])->toBe('John Doe Corin Test');
            expect($resultado['usuario'])->toBe('teste');
            expect($resultado['acesso'])->toBe('teste');
        });

        it('DADO QUE a login tenha sido chamada QUANDO o usuario for inexistente ENTAO devera ser retornado false', function() {
            $login = new stdClass();
            $login->senha = 'teste';
            $login->usuario = 'teste falso';
            $resultado = $this->repoLogin->login($login);
            expect($resultado)->toBe(false);
        });


        it('DADO QUE sal tenha sido chamada QUANDO o usuario for existente ENTAO deverao ser retornados o sal e a pimenta da senha do usuario', function() {
            $login = new stdClass();
            $login->usuario = 'teste';
            $resultado = $this->repoLogin->sal($login->usuario);
            expect($resultado)->toBeAn('array');
            expect($resultado['sal'])->toBe('teste');
            expect($resultado['pimenta'])->toBe('teste');
        });
    });
});