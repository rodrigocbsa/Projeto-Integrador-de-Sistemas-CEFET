<?php

class TratadoraDeExcecoes{

    public static function handler(Throwable $e): void {

        file_put_contents('php://stderr', print_r($e, TRUE)); // debug

        if(is_a($e,'DominioException',true)){
            $dados = empty( $e->getProblemas() ) ? [ $e->getMessage() ] : $e->getProblemas();
            TratadoraDeExcecoes::erro( 400, $dados );
        }
        else if(is_a($e,'NaoEncontradoException',true)){
            TratadoraDeExcecoes::erro( 404, $e->getMessage() );
        }
        else if(is_a($e,'RepositorioException',true)){
            TratadoraDeExcecoes::erro( 401, $e->getMessage() );
        }
        else if(is_a($e,'PDOException',true)){
            TratadoraDeExcecoes::erro( 500, $e->getMessage() );
        }
        else { // Exception
            TratadoraDeExcecoes::erro( 500, $e->getMessage() );
        }
    }

    private static function erro($status, $dados) {
        file_put_contents('php://stderr', print_r($dados, TRUE)); // debug
        http_response_code($status);
        header('Content-Type: application/json');
        die(json_encode($dados));
    }
    
}

