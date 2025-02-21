<?php

set_exception_handler('TratadoraDeExcecoes::handler');

function criarControladoraEstoque( PDO $pdo ) {
    return new ControladoraEstoque( new RepositorioEstoqueEmBDR($pdo), new ValidadorEstoque() );
}

$app->get('/produto/codigo', $middlewareIsGerenteouEstoquista, function( $req, $res ) use ( $pdo )
{
    $codigo = htmlspecialchars($_GET['codigo'] ?? '');
    $controladora = criarControladoraEstoque($pdo);
    $content = $controladora->getProdutoPorCodigo( $codigo );
    if($content){
        $res->json( $content );
    }
    else{
        http_response_code(400);
        $res->json('Código interno inválido.');
    }
});

$app->get('/produto/ean', $middlewareIsGerenteouEstoquista, function( $req, $res ) use ( $pdo )
{
    $ean = htmlspecialchars($_GET['ean'] ?? '');
    $controladora = criarControladoraEstoque($pdo);
    $content = $controladora->getProdutoPorEan( $ean );
    if($content){
        $res->json( $content );
    }
    else{
        http_response_code(400);
        $res->json('Código de barras inválido.');
    }
});

$app->post( '/estoque/entrada', $middlewareIsGerenteouEstoquista, function( $req, $res ) use ( $pdo ) 
{
    $dados = (array) $req->body();
    $controladora = criarControladoraEstoque($pdo);
    $success = $controladora->postEntrada($dados);
    if ( $success === true ) {
        $res->json(['success' => true, 'message' => 'Entrada no estoque realizada com sucesso.']);
    } else {
        $res->json(['success' => false, 'message' => $success]); // Retorna o array de problemas string
    }
} );

$app->post( '/estoque/saida', $middlewareIsGerenteouEstoquista, function( $req, $res ) use ( $pdo ) 
{
    $dados = (array) $req->body();
    $controladora = criarControladoraEstoque($pdo);
    $success = $controladora->postSaida($dados);
    if ( $success === true ) {
        $res->json(['success' => true, 'message' => 'Saída no estoque realizada com sucesso.']);
    } else {
        $res->json(['success' => false, 'message' => $success]); // Retorna o array de problemas string
    }
} );

$app->get('/estoque/historico', $middlewareIsGerenteouEstoquista, function( $req, $res ) use ( $pdo )
{
    $controladora = criarControladoraEstoque($pdo);
    $content = $controladora->getHistorico( );
    $res->json( $content );
});

$app->get('/estoque/produto/codigo', $middlewareIsGerenteouEstoquista, function( $req, $res ) use ( $pdo )
{
    $codigo = htmlspecialchars($_GET['codigo'] ?? '');
    $controladora = criarControladoraEstoque($pdo);
    $content = $controladora->getEstoqueProduto( $codigo );
    if($content){
        $res->json( $content );
    }
    else{
        http_response_code(400);
        $res->json('Código interno inválido.');
    }
});

$app->get('/estoque/produtos/reposicao', $middlewareIsGerenteouEstoquista, function( $req, $res ) use ( $pdo )
{
    $controladora = criarControladoraEstoque($pdo);
    $content = $controladora->getEstoqueProdutosReposicao( );
    $res->json( $content );
});
 