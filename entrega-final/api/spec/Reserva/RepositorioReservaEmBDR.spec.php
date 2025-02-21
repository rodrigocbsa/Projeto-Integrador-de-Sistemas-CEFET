<?php

describe('RepositorioReservaEmBDR', function() {

    $this->pdo = ConexaoTests::pdo();
    $this->repo = null;

    beforeAll( function() {
        $this->pdo->exec( file_get_contents( './scripts/dados-teste.sql' ) );
        $this->repo = new RepositorioReservaEmBDR($this->pdo);
    } );


    describe('consulta', function() {
        it('DADO QUE a funcao todos tenha sido chamada QUANDO houver reservas no banco de dados ENTAO devera ser retornado um array com reservas', function(): void {
            $resultado = $this->repo->todos();
            expect( $resultado )->toBeAn( 'array' );
            expect( $resultado )->not->toHaveLength( 0 );
        });

        it('DADO QUE a funcao consultar tenha sido chamada QUANDO houver reservas no periodo informado ENTAO devera ser retornada a quantidade de reservas em cada dia com reserva', function() {
            $resultado = $this->repo->consultar('2025-01-01','2025-01-20');
            expect($resultado)->toBeAn('array');
            expect($resultado)->toHaveLength(3);
            expect($resultado[0]['quantidade'])->toBe(1);
            expect($resultado[1]['quantidade'])->toBe(1);
            expect($resultado[2]['quantidade'])->toBe(2);
        });

        it('DADO QUE a funcao busca tenha sido chamada QUANDO a reserva existir ENTAO devera ser retornada', function(): void {
            $resultado = $this->repo->busca(7);
            expect( $resultado )->toBeAnInstanceOf('Reserva' );
        });
    });

    describe('cancelamento', function() {
        it('DADO QUE a funcao cancelar tenha sido chamada QUANDO a reserva existir e nao tiver sido cancelada ENTAO devera retornar true', function(): void {
            $resultado = $this->repo->cancelar(1);
            expect( $resultado )->toBe(true);
        });
    
        it('DADO QUE a funcao cancelar tenha sido chamada QUANDO a reserva nao existir ENTAO devera retornar false', function(): void {
            $resultado = $this->repo->cancelar(0);
            expect( $resultado )->toBe(false);
        });
    });

    describe('conclusao', function() {
        it('DADO QUE a funcao concluir tenha sido chamada QUANDO a reserva existir e nao tiver sido concluida ENTAO devera retornar true', function(): void {
            $resultado = $this->repo->concluir(3);
            expect( $resultado )->toBe(true);
        });
    
        it('DADO QUE a funcao concluir tenha sido chamada QUANDO a reserva nao existir ENTAO devera retornar false', function(): void {
            $resultado = $this->repo->concluir(0);
            expect( $resultado )->toBe(false);
        });
    });
    
    describe('cadastramento', function() {
        it('DADO QUE a funcao adicionar tenha sido chamada QUANDO a reserva for valida ENTAO devera retornar true', function() {
            $mesa = new stdClass();
            $mesa->id = 10;
            $funcionario = new stdClass();
            $funcionario->id = 1;
            $reserva = new stdClass();
            $reserva->nome_cliente = 'Cliente Spec';
            $reserva->telefone = '22991013333';
            $reserva->dia = '2025-01-24';
            $reserva->hora = '14:26';
            $reserva->mesa = $mesa;
            $reserva->funcionario = $funcionario;
            $resultado = $this->repo->adicionar($reserva);
            expect($resultado)->toBe(true);
        });
    });
});