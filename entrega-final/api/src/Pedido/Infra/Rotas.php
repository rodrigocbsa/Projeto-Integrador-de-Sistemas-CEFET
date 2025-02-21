<?php

set_exception_handler('TratadoraDeExcecoes::handler');

function criarControladoraPedido( PDO $pdo ) {
    return new ControladoraPedido(
        new RepositorioPedidoEmBDR( $pdo )
    );
}

$app->post( '/pedidos', $middlewareIsGerente, function( $req, $res ) use ( $pdo ) 
{
    $dados = (array) $req->body();
    $controller = criarControladoraPedido($pdo);
    $success = $controller->postPedido($dados);//
    if ( $success ) {
        $res->json(['success' => true, 'message' => 'Pedido cadastrado com sucesso.']);
    } else {
        $res->json(['success' => false, 'message' => 'Erro ao cadastrar o pedido.']);
    }
} );