<?php

class ControladoraEstoque{

    public function __construct( private RepositorioEstoque $repoEstoque, private ValidadorEstoque $validador ) { }
    

    public function getHistorico(): array {
        return $this->repoEstoque->historico();
    }

    public function getEstoqueProdutosReposicao(): array {
        return $this->repoEstoque->buscaProdutosAbaixoEstoqueMinimo();
    }

    public function getEstoqueProduto($codigo = ''): Estoque|false {
        $codigoValido = $this->validador->validarCodigoInterno($codigo);
        return $codigoValido ? $this->repoEstoque->buscaEstoqueProduto($codigo) : false;
    }

    public function getProdutoPorCodigo( $codigo = '' ): Produto|false {
        
        $codigoValido = $this->validador->validarCodigoInterno($codigo);
        return $codigoValido ? $this->repoEstoque->buscaProdutoPorCodigoInterno($codigo) : false;
    }

    public function getProdutoPorEan( $ean = '' ): Produto|false {
        
        $codigoValido = $this->validador->validarEan($ean);
        return $codigoValido ? $this->repoEstoque->buscaProdutoPorCodigoBarras($ean) : false;
    }

    public function postEntrada( $dados = [] ){
        // Sanitiza
        $this->validador->sanitizadorDeDados($dados);

        $sucesso = false;
        $problemas = [];
        $JA_REGISTROU_MOTIVO = false;

        $quantidade = count($dados) ?? 0;

        for($i = 0; $i < $quantidade; $i++){
            $produto = $dados[$i]->produto ?? '';
            $adicao = $dados[$i]->adicao ?? 0;
            $motivo = $dados[$i]->motivo ?? '';
            $totalAnterior = $dados[$i]->totalAnterior ?? 0;
            $totalPosterior = $dados[$i]->totalPosterior ?? 0;

            $problemas = $this->validador->validarMovimentacao($produto,$adicao,$motivo,$quantidade);

            if(count($problemas) == 0){
                $sucesso = $this->repoEstoque->entrada($produto,$adicao);
                if($sucesso){
                    if($JA_REGISTROU_MOTIVO == false){
                        $id = $this->repoEstoque->registraMovimentacao($quantidade, $motivo, TipoMovimentacao::ENTRADA->value);
                        $JA_REGISTROU_MOTIVO = true;
                    }
                    $this->repoEstoque->registraProdutoMovimentacao($id,$totalAnterior, $totalPosterior, $produto);
                }
            }
        }
                

        return $sucesso ? $sucesso : $problemas;
    }

    public function postSaida( $dados = [] ): array|bool{
        // Sanitiza
        $this->validador->sanitizadorDeDados($dados);

        $sucesso = false;
        $problemas = [];

        $quantidade = count($dados) ?? 0;

        for($i = 0; $i < $quantidade; $i++){

            $produto = $dados[$i]->produto ?? '';
            $remocao = $dados[$i]->remocao ?? 0;
            $motivo = $dados[$i]->motivo ?? '';
            $categoria = $dados[$i]->categoria ?? '';
            $totalAnterior = $dados[$i]->totalAnterior ?? 0;
            $totalPosterior = $dados[$i]->totalPosterior ?? 0;
            $totalDispensaASomar = $dados[$i]->$totalDispensaASomar ?? 0;

            $problemas = $this->validador->validarMovimentacao($produto,$remocao,$motivo,$quantidade);
            $this->validador->validarCategoria($categoria,$problemas);

            if(count($problemas) == 0){
                $categoria == CategoriaProduto::INTERNO->value ? 
                    $sucesso = $this->repoEstoque->saidaInterno($produto,$remocao) 
                : 
                    $sucesso = $this->repoEstoque->saidaExterno($produto,$remocao)
                ;
                if($sucesso){
                    if($JA_REGISTROU_MOTIVO == false){
                        $id = $this->repoEstoque->registraMovimentacao($quantidade, $motivo, TipoMovimentacao::SAIDA->value);
                        $JA_REGISTROU_MOTIVO = true;
                    }
                    $this->repoEstoque->registraProdutoMovimentacao($id,$totalAnterior, $totalPosterior, $produto);
                }
            }
            
        }

        return $sucesso ?: $problemas;
        
    }

}