<?php

describe('RepositorioMesaEmBDR', function() {

    $this->pdo = ConexaoTests::pdo();
    $this->repoMesa = null;
    $this->repoReserva = null;

    beforeAll( function() {
        $this->pdo->exec( file_get_contents( './scripts/dados-teste.sql' ) );
        $this->repoMesa = new RepositorioMesaEmBDR($this->pdo);
        $this->repoReserva = new RepositorioReservaEmBDR($this->pdo);
    } );
    
    describe('consulta', function() {
        it('DADO QUE a funcao mesasDisponiveis tenha sido chamada QUANDO nao houver mesas em uso no dia e hora ENTAO deverao ser retornadas', function() {
            $resultado = $this->repoMesa->mesasDisponiveis('2025-01-24','11:00');
            expect($resultado)->toBeAn('array');
            expect($resultado)->toHaveLength(10);
        });

        it('DADO QUE a funcao mesasDisponiveis tenha sido chamada QUANDO houver mesas em uso no dia e hora ENTAO essas nao deverao ser retornadas', function() {
            $mesa = new stdClass();
            $mesa->id = 10;
            $funcionario = new stdClass();
            $funcionario->id = 1;
            $reserva = new stdClass();
            $reserva->nome_cliente = 'Cliente Spec';
            $reserva->telefone = '22991013333';
            $reserva->dia = '2025-01-23';
            $reserva->hora = '11:00'; // mesa 10 em uso entre o horário das 11:00 e 13:00 no dia especificado
            $reserva->mesa = $mesa;
            $reserva->funcionario = $funcionario;
            $resultado = $this->repoReserva->adicionar($reserva);
            $resultado = $this->repoMesa->mesasDisponiveis('2025-01-23','12:00');
            expect($resultado)->toBeAn('array');
            expect($resultado)->toHaveLength(9);
        });

        it('DADO QUE a funcao busca tenha sido chamada QUANDO a mesa existir ENTAO devera ser retornada', function(): void {
            $resultado = $this->repoMesa->busca(10);
            expect( $resultado )->toBeAnInstanceOf('Mesa' );
        });

        it('DADO QUE a funcao busca tenha sido chamada QUANDO a mesa nao existir ENTAO devera ser retornado null', function(): void {
            $resultado = $this->repoMesa->busca(0);
            expect( $resultado )->toBeNull();
        });
    });

    
});