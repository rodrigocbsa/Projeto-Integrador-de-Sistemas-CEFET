<?php

class ControladoraFuncionario{

    public function __construct( private RepositorioGerente $repoGerente, private GestorDatas $gestorDatas ) { }

    public function getVendasPorFuncionario($dataInicial,$dataFinal): array{
        // TODO: validação de datas no backend
        return $this->repoGerente->consultaVendasPorFuncionario($dataInicial,$dataFinal);
    }

    public function getVendasPorCategoria($dataInicial,$dataFinal): array{
        // TODO: validação de datas no backend
        return $this->repoGerente->consultaVendasPorCategoria($dataInicial,$dataFinal);
    }

    public function getTotalVendas($dataInicial,$dataFinal): array{
        // TODO: validação de datas no backend
        return $this->repoGerente->consultaTotalVendas($dataInicial,$dataFinal);
    }

    public function getTotalPorModalidadeDePagamento($dataInicial,$dataFinal): array{
        // TODO: validação de datas no backend
        return $this->repoGerente->consultaTotalPorPagamento($dataInicial,$dataFinal);
    }


    public function postFuncionario($usuario,$senha,$nome,$acesso): bool{
        // TODO: regras de negócio para funcionário e usuário
        $login = new Login($usuario,$senha,$acesso);
        $sal = $login->gerarHash40Caracteres();
        $pimenta = $login->gerarHash40Caracteres();
        $login->sal = $sal;
        $login->pimenta = $pimenta;
        $hash = $login->deSenhaParaHash();
        $login->senha = $hash;
        return $this->repoGerente->cadastrarFuncionarioComLogin($login,$nome);
    }
}