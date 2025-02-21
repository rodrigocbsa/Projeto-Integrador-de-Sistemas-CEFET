<?php
$middlewareIsAdmin = function ( $req, $res, &$stop ) {
    session_name( 'sid' );
    session_start();
    $isAdmin = isset( $_SESSION[ 'admin' ] ) && $_SESSION[ 'admin' ] && isset( $_SESSION[ 'logado' ] ) && $_SESSION[ 'logado' ];
    if ( $isAdmin ) {
        return; // Access allowed
    }
    $stop = true;
    $res->status( 403 )->send( 'Acesso não autorizado.' ); // Forbidden
};