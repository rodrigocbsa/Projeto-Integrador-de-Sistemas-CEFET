<?php

set_exception_handler('TratadoraDeExcecoes::handler');

function criarControladoraFuncionario( PDO $pdo ) {
    return new ControladoraFuncionario(
        new RepositorioGerenteEmBDR( $pdo ),
        new GestorDatas()
    );
}

function criarControladoraLogin( PDO $pdo ) {
    return new ControladoraLogin(
        new RepositorioLoginEmBDR( $pdo )
    );
}


$app->get( '/funcionario/gerente/relatorios/:id', $middlewareIsGerente, function( $req, $res ) use ( $pdo ) 
{
    $content = [];

    $data_inicio = htmlspecialchars( $_GET['data_inicio'] ?? '' );
    $data_fim = htmlspecialchars( $_GET['data_fim'] ?? '' );

    $controller = criarControladoraFuncionario($pdo);

    //file_put_contents('php://stderr', print_r($req->params('id')['id'], TRUE));

    switch($req->params('id')['id']){ //
        case 1: $content = $controller->getVendasPorFuncionario( $data_inicio, $data_fim );
        break;
        case 2: $content = $controller->getVendasPorCategoria( $data_inicio, $data_fim );
        break;
        case 3: $content = $controller->getTotalVendas( $data_inicio, $data_fim );
        break;
        case 4: $content = $controller->getTotalPorModalidadeDePagamento($data_inicio,$data_fim);
        default:break;
    }

    $res->json( $content );

} );


$app->post('/login', function( $req, $res ) use ($pdo) {
    
    $dados = (array) $req->body();

    $usuario = htmlspecialchars( $dados[ 'usuario' ] ?? '' );
    $senha = htmlspecialchars( $dados[ 'senha' ] ?? '' );


    $controladora = criarControladoraLogin($pdo);
    

    $resposta = $controladora->postLogin($usuario,$senha);

    if($resposta === false){
        $res->json(['success' => false, 'message' => 'Login inexistente.']);
    } else{
        $res->json($resposta);
    }

});

$app->get('/funcionario/logado', $middlewareIsLogado, function($req,$res) use ($pdo) {
    $res->status( 200 )->send( 'Acesso autenticado.' );
});

$app->get('/funcionario/gerente', $middlewareIsGerente, function($req,$res) use ($pdo) {
    $res->status( 200 )->send( 'Acesso permitido.' );
});

$app->get('/funcionario/gerenteestoquista', $middlewareIsGerenteouEstoquista, function($req,$res) use ($pdo) {
    $res->status( 200 )->send( 'Acesso permitido.' );
});


$app->post('/logout', function( $req, $res ) use ($pdo) {
    
    session_name('sid');
    session_start();

    $cookie = $req->cookie( 'sid' );

    if (isset($_SESSION['logado']) && $_SESSION['logado'] === TRUE && $cookie) {
        session_unset();
        setcookie("sid", "", time() - 3600); // deletando o cookie
        session_destroy();
        header('Location: http://localhost:5173/index.html');
        exit;
    }

});



$app->post( '/funcionario/cadastro',$middlewareIsGerente, function( $req, $res ) use ( $pdo ) 
{
    $dados = (array) $req->body();


    $usuario = htmlspecialchars( $dados[ 'usuario' ] ?? '' );
    $senha = htmlspecialchars( $dados[ 'senha' ] ?? '' );
    $nome = htmlspecialchars($dados['nome'] ?? '');
    $cargo = htmlspecialchars($dados['acesso'] ?? '');


    $controladora = criarControladoraFuncionario($pdo);

    $success = $controladora->postFuncionario($usuario,$senha,$nome,$cargo);
    if ( $success ) {
        $res->json(['success' => true, 'message' => 'Cadastro realizado com sucesso!']);
    } else {
        $res->json(['success' => false, 'message' => 'Cadastro com erros! Verifique as informações fornecidas.']);
    }

} );

