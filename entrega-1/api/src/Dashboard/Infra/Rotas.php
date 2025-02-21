<?php

set_exception_handler('TratadoraDeExcecoes::handler');

function criarControladoraDashboard( PDO $pdo ) {
    return new ControladoraDashboard(
        new RepositorioDashboardEmBDR( $pdo )
    );
}

$app->get( '/dashboard/extras', $middlewareIsLogged, function( $req, $res ) use ( $pdo ) 
{
    $content = [];

    $controller = criarControladoraDashboard($pdo);

    $content = $controller->getExtras();

    $res->json( $content );

} );