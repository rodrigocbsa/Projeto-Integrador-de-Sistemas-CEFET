<?php

set_exception_handler('TratadoraDeExcecoes::handler');

function criarControladoraMesa(PDO $pdo): ControladoraMesa {
    return new ControladoraMesa(
        new RepositorioMesaEmBDR( $pdo ),
        new GestorDatas()
    );
}


$app->get( '/mesas', $middlewareIsLogged, function( $req, $res ) use ( $pdo ) 
{
    $controller = criarControladoraMesa($pdo);
    $content = $controller->getMesasDisponiveis( $_GET['dia'], $_GET['hora'] );
    $res->json( $content );
});