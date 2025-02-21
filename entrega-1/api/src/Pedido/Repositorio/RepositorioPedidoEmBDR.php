<?php

class RepositorioPedidoEmBDR implements RepositorioPedido
{
    public function __construct(
        private PDO $pdo
    ){}

    public function adicionar($pedido): bool {
        try {

            $sql = '

            INSERT INTO pedido (total,mesa,pagamento) values (:total, :mesa, :pagamento)

            ';
            $ps = $this->pdo->prepare( $sql );
            $ps->execute( 
            [ 
                'total' => $pedido->total,
                'mesa' => $pedido->mesa,
                'pagamento' => $pedido->pagamento
                ] 
            );

            $id_pedido = $this->pdo->lastInsertId();


            foreach ($pedido->itens as $item) {
                $sql = '
            
                INSERT INTO item (preco,descricao,categoria) values (:preco,:descricao,:categoria)
                
                ';
                $ps = $this->pdo->prepare($sql);
                $ps->execute(
                    [
                        'preco' => $item->preco,
                        'descricao' => $item->descricao,
                        'categoria' => $item->categoria
                    ]
                );

                $id_item = $this->pdo->lastInsertId();

                $sql = '
            
                INSERT INTO pedido_item (quantidade,pedido,item) values (:quantidade,:id_pedido,:id_item)
                
                ';
                $ps = $this->pdo->prepare($sql);
                $ps->execute(
                    [
                        'quantidade' => $item->quantidade,
                        'id_pedido' => $id_pedido,
                        'id_item' => $id_item
                    ]
                );
            }
            
    
            return $ps->rowCount() > 0;
    
        } catch ( PDOException $ex ) {
            throw new RepositorioException( 'Erro ao adicionar o pedido no banco de dados.', (int) $ex->getCode(), $ex );
        }
    }
}