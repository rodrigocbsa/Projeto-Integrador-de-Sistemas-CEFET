<?php

class ControladoraFuncionario{

    public function __construct( private RepositorioGerente $repoGerente, private GestorDatas $gestorDatas ) { }

    public function getVendasPorFuncionario($dataInicial,$dataFinal): array{
        return $this->repoGerente->consultaVendasPorFuncionario($dataInicial,$dataFinal);
    }

    public function getVendasPorCategoria($dataInicial,$dataFinal): array{
        return $this->repoGerente->consultaVendasPorCategoria($dataInicial,$dataFinal);
    }

    public function getTotalVendas($dataInicial,$dataFinal): array{
        return $this->repoGerente->consultaTotalVendas($dataInicial,$dataFinal);
    }

    public function getTotalPorModalidadeDePagamento($dataInicial,$dataFinal): array{
        return $this->repoGerente->consultaTotalPorPagamento($dataInicial,$dataFinal);
    }


    public function postFuncionario($usuario,$senha,$nome,$cargo): bool{
        // Criar um login para o funcionário
        $login = new Login($usuario,$senha);
        // Gerar o sal e a pimenta, que serão fixos
        $sal = $login->gerarHash40Caracteres();
        $pimenta = $login->gerarHash40Caracteres();
        $login->sal = $sal;
        $login->pimenta = $pimenta;
        // Gerar uma senha com a própria senha, sal e pimenta do login
        $hash = $login->deSenhaParaHash();
        // Guardar a senha e cadastrar o funcionário com o login
        $login->senha = $hash;
        $funcionario = new Funcionario(0,$nome,$cargo,$login);
        $problemas = $funcionario->validar();
        return count($problemas) > 0 ? false : $this->repoGerente->cadastrarFuncionarioComLogin($funcionario);
    }
}