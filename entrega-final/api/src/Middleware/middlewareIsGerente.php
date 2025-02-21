<?php
$middlewareIsGerente = function ( $req, $res, &$stop ) {
    session_name( 'sid' );
    session_start();
    $isGerente = isset( $_SESSION[ 'gerente' ] ) && $_SESSION[ 'gerente' ] && isset( $_SESSION[ 'logado' ] ) && $_SESSION[ 'logado' ];
    if ( $isGerente ) {
        return; // Access allowed
    }
    $stop = true;
    $res->status( 403 )->send( 'Acesso não autorizado.' ); // Forbidden
};