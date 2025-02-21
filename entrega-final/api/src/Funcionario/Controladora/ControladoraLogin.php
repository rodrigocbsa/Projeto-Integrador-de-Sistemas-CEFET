<?php

class ControladoraLogin {

    public function __construct(private RepositorioLogin $repoLogin) {}


    public function postLogin($usuario,$senha): array|bool{
        try{

            if($usuario == '' || $senha == ''){
                throw new DominioException('Usuário ou senha inválidos.');
            }
            // pegar sal e pimenta do usuário caso ele exista
            $dados = $this->pegarSalePimentaDoUsuario($usuario);

            if(!count($dados)){
                return false;
            }

            $login = new Login($usuario,$senha,$dados['sal'],$dados['pimenta']);
            // transferir o sal e a pimenta do usuário existente para o hash com a senha utilizada no login
            $hash = $login->deSenhaParaHash();
            $login->senha = $hash;


            // pegar dados do funcionário a partir do hash gerado com a senha de login, caso exista
            $dadosFunc = $this->login($login);


            if(count($dadosFunc)){ 
                session_name( 'sid' );
                session_start();
                $_SESSION[ 'logado' ] = true;
                $_SESSION[ 'funcionario' ] = $dadosFunc['id'];
                $_SESSION[ 'nome' ] = $dadosFunc['nome'];
                $_SESSION[ 'usuario' ] = $dadosFunc['usuario'];
                switch($dadosFunc['cargo']){
                    case Cargo::GERENTE->value : $_SESSION[ 'gerente' ] = true;
                    break;
                    case Cargo::ATENDENTE->value : $_SESSION[ 'atendente' ] = true;
                    break;
                    default: $_SESSION[ 'estoquista' ] = true;
                    break;
                }
                return ['success' => true, 'nome' => $dadosFunc['nome'], 'usuario' => $dadosFunc['usuario'], 'funcionario' => $dadosFunc['id'], 'cargo' => $dadosFunc['cargo']];
            } else { // login inexistente
                return false;
            }

        } catch(Exception $ex){
            throw $ex;
        }
        
    }


    private function pegarSalePimentaDoUsuario($usuario): array{
        $resposta = $this->repoLogin->sal($usuario);
        return $resposta == false ? [] : $resposta;
    }

    private function login($login): array{
        $resposta = $this->repoLogin->login($login);
        return $resposta == false ? [] : $resposta;
    }
}