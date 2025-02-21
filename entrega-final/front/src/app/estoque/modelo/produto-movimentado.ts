export class ProdutoMovimentado{
    
    total_anterior: number;
    total_posterior: number;
    codigo_produto: string;
    movimentacao: number;



    constructor(totalAnterior: number, totalPosterior: number, codigoProduto: string, idMovimentacao: number) {

        this.total_anterior = totalAnterior;
        this.total_posterior = totalPosterior;
        this.codigo_produto = codigoProduto;
        this.movimentacao = idMovimentacao;

    }
}