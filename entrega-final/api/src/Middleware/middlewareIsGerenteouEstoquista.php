<?php
$middlewareIsGerenteouEstoquista = function ( $req, $res, &$stop ) {
    session_name( 'sid' );
    session_start();
    $isGerente = isset( $_SESSION[ 'gerente' ] ) && $_SESSION[ 'gerente' ] && isset( $_SESSION[ 'logado' ] ) && $_SESSION[ 'logado' ];
    $isEstoquista = isset( $_SESSION[ 'estoquista' ] ) && $_SESSION[ 'estoquista' ] && isset( $_SESSION[ 'logado' ] ) && $_SESSION[ 'logado' ];
    if ( $isGerente || $isEstoquista ) {
        return; // Access allowed
    }
    $stop = true;
    $res->status( 403 )->send( 'Acesso não autorizado.' ); // Forbidden
};