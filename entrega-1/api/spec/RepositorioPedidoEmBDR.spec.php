<?php

describe('RepositorioPedidoEmBDR', function() {

    $this->pdo = ConexaoTests::pdo();
    $this->repo = null;

    beforeAll( function() {
        $this->pdo->exec( file_get_contents( './scripts/dados-teste.sql' ) );
        $this->repo = new RepositorioPedidoEmBDR($this->pdo);
    } );
    
    describe('cadastramento', function() {
        it('DADO QUE a funcao adicionar tenha sido chamada QUANDO o pedido for valido ENTAO devera retornar true', function() {
            $item1 = new stdClass();
            $item1->categoria = 'Entrada';
            $item1->descricao = 'Arroz';
            $item1->quantidade = 1;
            $item1->preco = 20;

            $item2 = new stdClass();
            $item2->categoria = 'Entrada';
            $item2->descricao = 'Feijão';
            $item2->quantidade = 1;
            $item2->preco = 20;
            
            $itens = [];
            array_push($itens,$item1,$item2);
            
            $pedido = new stdClass();
            $pedido->total = 40;
            $pedido->mesa = 9;
            $pedido->itens = $itens;
            $pedido->pagamento = 'PIX';

            $resultado = $this->repo->adicionar($pedido);
            expect($resultado)->toBe(true);
        });

        it('DADO QUE a funcao adicionar tenha sido chamada QUANDO o pedido estiver faltando algum dado ENTAO devera lancar excecao RepositorioException', function() {
            $item1 = new stdClass();
            $item1->categoria = 'Entrada';
            $item1->descricao = 'Arroz';
            $item1->quantidade = 1;
            $item1->preco = 20;

            $item2 = new stdClass();
            $item2->categoria = 'Entrada';
            $item2->descricao = 'Feijão';
            $item2->quantidade = 1;
            $item2->preco = 20;
            
            $itens = [];
            array_push($itens,$item1,$item2);
            
            $pedido = new stdClass();
            $pedido->total = ''; // dado faltante
            $pedido->mesa = 9;
            $pedido->itens = $itens;
            $pedido->pagamento = 'PIX';

            try{
                $this->repo->adicionar($pedido);
            } catch(Exception $ex){
                expect($ex)->toBeAnInstanceOf(RepositorioException::class);
            }
        });

    });
});