<?php

class ControladoraPedido {
    public function __construct(private RepositorioPedido $repoPedido) {}

    public function postPedido($dados){

        // Sanitiza
        foreach ( $dados as $chave => &$valor ) {
            if (is_array($valor) || is_object($valor)) {
                // Itera sobre os valores do array/objeto
                foreach ($valor as $chave => &$subValor) {
                    foreach ($subValor as $subChave => &$subsubValor) {
                        //file_put_contents('php://stderr', print_r($subsubValor, TRUE));
                        $subsubValor = htmlspecialchars($subsubValor, ENT_QUOTES, 'UTF-8');
                    }
                    
                }
            } elseif (is_string($valor)) {
                // Aplica htmlspecialchars para strings
                $valor = htmlspecialchars($valor, ENT_QUOTES, 'UTF-8');
            }
        }

        $itens = [];
        foreach ( $dados as $chave => &$valor ) {
            if (is_array($valor) || is_object($valor)) {
                // Pega todos os itens que estão no pedido
                foreach ($valor as $chave) {
                    $item = new Item(0,$chave->categoria,$chave->descricao,$chave->quantidade,$chave->preco);//
                    array_push($itens,$item);
                }
            }
        }
        $pedido = new Pedido(0,$dados['total'],$dados['mesa'],$itens, $dados['pagamento']);

        $success = $this->repoPedido->adicionar($pedido);
        return $success;
    }
}