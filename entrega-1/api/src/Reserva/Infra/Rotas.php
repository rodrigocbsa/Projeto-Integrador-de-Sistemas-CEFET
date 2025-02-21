<?php

set_exception_handler('TratadoraDeExcecoes::handler');

function criarControladoraReserva( PDO $pdo ) {
    return new ControladoraReserva(
        new RepositorioReservaEmBDR( $pdo ),
        new RepositorioMesaEmBDR( $pdo ),
        new RepositorioFuncionarioEmBDR( $pdo ),
        new GestorDatas()
    );
}


$app->get( '/reservas', $middlewareIsLogged, function( $req, $res ) use ( $pdo ) 
{

    $data_inicio = $_GET['data_inicio'] ?? null;
    $data_fim = $_GET['data_fim'] ?? null;

    if( $data_inicio && $data_fim ){

        $controller = criarControladoraReserva($pdo);
        $content = $controller->getReservasPorPeriodo( $data_inicio, $data_fim );
        $res->json( $content );

    }else{

        $controller = criarControladoraReserva($pdo);
        $content = $controller->getReservas();
        $res->json( $content );
        
    }
} );

$app->get('/reserva/:id', $middlewareIsLogged, function( $req, $res ) use ( $pdo )
{
    $controller = criarControladoraReserva($pdo);
    $content = $controller->getReservaPorId( $req->params('id') );
    $res->json( $content );
});

$app->put('/reserva/:id', $middlewareIsLogged, function( $req, $res ) use ( $pdo )
{
    $controller = criarControladoraReserva($pdo);
    $content = $controller->putCancelarReserva( $req->params('id') );
    if ( $content ) {
        $res->json(['success' => true, 'message' => 'Reserva cancelada com sucesso.']);
    } else {
        $res->json(['success' => false, 'message' => 'Erro ao cancelar a reserva.']);
    }
} );

$app->put('/reserva/concluir/:id', $middlewareIsAdmin, function( $req, $res ) use ( $pdo )
{
    $controller = criarControladoraReserva($pdo);
    $content = $controller->putConcluirReserva( $req->params('id') );
    if ( $content ) {
        $res->json(['success' => true, 'message' => 'Reserva concluída com sucesso.']);
    } else {
        $res->json(['success' => false, 'message' => 'Erro ao concluir a reserva.']);
    }
} );

$app->post( '/reservas', $middlewareIsLogged, function( $req, $res ) use ( $pdo ) 
{
    $dados = (array) $req->body();
    $controller = criarControladoraReserva($pdo);
    $success = $controller->postReserva($dados);
    if ( $success ) {
        $res->json(['success' => true, 'message' => 'Reserva cadastrada com sucesso.']);
    } else {
        $res->json(['success' => false, 'message' => 'Erro ao cadastrar a reserva.']);
    }
} );