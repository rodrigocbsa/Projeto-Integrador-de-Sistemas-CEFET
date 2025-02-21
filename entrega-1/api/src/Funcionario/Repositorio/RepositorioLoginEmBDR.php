<?php

class RepositorioLoginEmBDR implements RepositorioLogin
{

    public function __construct(
        private PDO $pdo
    ) {
    }

    public function login($login): array|bool
    {
        try {

            $ps = $this->pdo->prepare('
            
            SELECT f.id,f.nome,l.usuario,l.acesso FROM funcionario f JOIN login l 
            ON f.login = l.id 
            WHERE l.usuario = :usuario AND l.senha = :hash 
            
            ');
            $ps->execute([
                'usuario' => $login->usuario,
                'hash' => $login->senha
            ]);
            return $ps->fetch(PDO::FETCH_ASSOC);

        } catch (PDOException $ex) {

            throw new RepositorioException('Erro ao consultar dados do usuário no banco de dados.', (int) $ex->getCode(), $ex);

        }
    }

    public function sal(string $usuario): array|bool
    {
        try {

            $ps = $this->pdo->prepare('SELECT sal,pimenta FROM login WHERE usuario = :usuario');
            $ps->execute(['usuario' => $usuario]);
            return $ps->fetch( PDO::FETCH_ASSOC );

        } catch (PDOException $ex) {

            throw new RepositorioException('Erro ao consultar dados do sal no banco de dados.', (int) $ex->getCode(), $ex);

        }
    }
}