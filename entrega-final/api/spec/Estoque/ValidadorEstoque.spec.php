<?php

describe( 'ValidadorEstoque', function() {
    $this->pdo = ConexaoTests::pdo();
    $this->validador = null;

    beforeAll( function() {
        $this->pdo->exec( file_get_contents( './scripts/dados-teste.sql' ) );
        $this->validador = new ValidadorEstoque();
    });

    describe('validarCodigos', function() {

        it('DADO QUE a funcao que verifica um codigo interno ou ean tenha sido chamada QUANDO o codigo interno for valido ENTAO o array de problemas devera estar vazio', function() {
            $problemas = [];
            $this->validador->validarCodigos('000001',$problemas);
            expect($problemas)->toHaveLength(0);
        });

        it('DADO QUE a funcao que verifica um codigo interno ou ean tenha sido chamada QUANDO o codigo interno for mais que 6 caracteres numericos ENTAO o array de problemas devera conter um elemento', function() {
            $problemas = [];
            $this->validador->validarCodigos('0000011',$problemas);
            expect($problemas)->toHaveLength(1);
        });

        it('DADO QUE a funcao que verifica um codigo interno ou ean tenha sido chamada QUANDO o codigo interno for menor que 6 caracteres numericos ENTAO o array de problemas devera conter um elemento', function() {
            $problemas = [];
            $this->validador->validarCodigos('00001',$problemas);
            expect($problemas)->toHaveLength(1);
        });

        it('DADO QUE a funcao que verifica um codigo interno ou ean tenha sido chamada QUANDO o codigo interno tiver letra ENTAO o array de problemas devera conter um elemento', function() {
            $problemas = [];
            $this->validador->validarCodigos('00000a',$problemas);
            expect($problemas)->toHaveLength(1);
        });

        it('DADO QUE a funcao que verifica um codigo interno ou ean tenha sido chamada QUANDO o ean for valido ENTAO o array de problemas devera estar vazio', function() {
            $problemas = [];
            $this->validador->validarCodigos('1010101010104',$problemas);
            expect($problemas)->toHaveLength(0);
        });

        it('DADO QUE a funcao que verifica um codigo interno ou ean tenha sido chamada QUANDO o ean for invalido ENTAO o array de problemas devera conter um elemento', function() {
            $problemas = [];
            $this->validador->validarCodigos('1010101010109',$problemas);
            expect($problemas)->toHaveLength(1);
        });

    });


    describe('validarCategoria', function() {

        it('DADO QUE a funcao que verifica um codigo interno ou ean tenha sido chamada QUANDO a categoria for "interno" ENTAO o array de problemas devera estar vazio', function() {
            $problemas = [];
            $this->validador->validarCategoria('interno',$problemas);
            expect($problemas)->toHaveLength(0);
        });

        it('DADO QUE a funcao que verifica um codigo interno ou ean tenha sido chamada QUANDO a categoria for "externo" ENTAO o array de problemas devera estar vazio', function() {
            $problemas = [];
            $this->validador->validarCategoria('externo',$problemas);
            expect($problemas)->toHaveLength(0);
        });

        it('DADO QUE a funcao que verifica um codigo interno ou ean tenha sido chamada QUANDO a categoria for inexistente ENTAO o array de problemas devera conter um elemento', function() {
            $problemas = [];
            $this->validador->validarCategoria('inexistente',$problemas);
            expect($problemas)->toHaveLength(1);
        });

    });


    describe('validarMovimentacoes', function() {

        it('DADO QUE a funcao que verifica os totais a serem movimentados tenha sido chamada QUANDO o valor da movimentacao estiver entre 1 e 100 ENTAO o array de problemas devera estar vazio', function() {
            $problemas = [];
            $this->validador->validarMovimentacoes('50',$problemas);
            expect($problemas)->toHaveLength(0);
        });

        it('DADO QUE a funcao que verifica os totais a serem movimentados tenha sido chamada QUANDO o valor da movimentacao for 1 ENTAO o array de problemas devera estar vazio', function() {
            $problemas = [];
            $this->validador->validarMovimentacoes('1',$problemas);
            expect($problemas)->toHaveLength(0);
        });

        it('DADO QUE a funcao que verifica os totais a serem movimentados tenha sido chamada QUANDO o valor da movimentacao for 100 ENTAO o array de problemas devera estar vazio', function() {
            $problemas = [];
            $this->validador->validarMovimentacoes('100',$problemas);
            expect($problemas)->toHaveLength(0);
        });

        it('DADO QUE a funcao que verifica os totais a serem movimentados tenha sido chamada QUANDO o valor da movimentacao for menor que 1 ENTAO o array de problemas devera conter um elemento', function() {
            $problemas = [];
            $this->validador->validarMovimentacoes('0',$problemas);
            expect($problemas)->toHaveLength(1);
        });

        it('DADO QUE a funcao que verifica os totais a serem movimentados tenha sido chamada QUANDO o valor da movimentacao for maior que 100 ENTAO o array de problemas devera conter um elemento', function() {
            $problemas = [];
            $this->validador->validarMovimentacoes('101',$problemas);
            expect($problemas)->toHaveLength(1);
        });

        it('DADO QUE a funcao que verifica os totais a serem movimentados tenha sido chamada QUANDO o valor da movimentacao nao for um numero ENTAO o array de problemas devera conter um elemento', function() {
            $problemas = [];
            $this->validador->validarMovimentacoes('a',$problemas);
            expect($problemas)->toHaveLength(1);
        });

    });

    describe('validarMotivo', function() {

        it('DADO QUE a funcao que verifica o motivo da movimentacao tenha sido chamada QUANDO o motivo estiver entre 5 e 50 caracteres ENTAO o array de problemas devera estar vazio', function() {
            $problemas = [];
            $this->validador->validarMotivo('Lorem ipsum dolor sit amet.',$problemas);
            expect($problemas)->toHaveLength(0);
        });

        it('DADO QUE a funcao que verifica o motivo da movimentacao tenha sido chamada QUANDO o motivo tiver mais de 50 caracteres ENTAO o array de problemas devera conter um elemento', function() {
            $problemas = [];
            $this->validador->validarMotivo('Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quo minus cupiditate veniam eligendi error odio alias doloremque animi, officiis soluta quibusdam nesciunt quod aut corporis harum inventore exercitationem at voluptatibus',$problemas);
            expect($problemas)->toHaveLength(1);
        });

        it('DADO QUE a funcao que verifica o motivo da movimentacao tenha sido chamada QUANDO o motivo tiver menos de 5 caracteres ENTAO o array de problemas devera conter um elemento', function() {
            $problemas = [];
            $this->validador->validarMotivo('amet',$problemas);
            expect($problemas)->toHaveLength(1);
        });

    });

    describe('validarQuantidade', function() {
        
        it('DADO QUE a funcao que verifica a quantidade de produtos movimentados tenha sido chamada QUANDO a quantidade de produtos movimentados for maior que zero ENTAO o array de problemas devera estar vazio', function() {
            $problemas = [];
            $this->validador->validarQuantidade('1',$problemas);
            expect($problemas)->toHaveLength(0);
        });

        it('DADO QUE a funcao que verifica a quantidade de produtos movimentados tenha sido chamada QUANDO a quantidade de produtos movimentados menor ou igual a zero ENTAO o array de problemas devera ter um elemento', function() {
            $problemas = [];
            $this->validador->validarQuantidade('0',$problemas);
            expect($problemas)->toHaveLength(1);
        });

        it('DADO QUE a funcao que verifica a quantidade de produtos movimentados tenha sido chamada QUANDO a quantidade de produtos movimentados nao for um numero ENTAO o array de problemas devera conter um elemento', function() {
            $problemas = [];
            $this->validador->validarQuantidade('a',$problemas);
            expect($problemas)->toHaveLength(1);
        });

    });

});