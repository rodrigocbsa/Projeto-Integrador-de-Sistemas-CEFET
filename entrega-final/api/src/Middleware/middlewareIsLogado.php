<?php
$middlewareIsLogado = function ( $req, $res, &$stop ) {
    session_name( 'sid' );
    session_start();
    $isLogged = isset( $_SESSION[ 'logado' ] ) && $_SESSION[ 'logado' ];
    if ( $isLogged ) {
        return; // Access allowed
    }
    $stop = true;
    $res->status( 401 )->send( 'Acesso sem autenticação.' ); // Unauthorized
};