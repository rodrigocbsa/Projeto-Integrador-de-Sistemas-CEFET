<?php
session_name( 'sid' );
//session_set_cookie_params( 60 * 15 );
session_start();

if( !($_SESSION['logado'] ?? false) ) {
    Header('Location: http://localhost:5173/login.html');
    exit;
}
