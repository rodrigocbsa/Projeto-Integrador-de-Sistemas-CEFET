export class Estoque{
    id: number;
    estoque_minimo: number;
    estoque_atual: number;
    codigo_produto: string;


    constructor(id: number,estoqueMinimo: number,estoqueAtual: number,codigoProduto: string){
        this.id = id;
        this.estoque_minimo = estoqueMinimo;
        this.estoque_atual = estoqueAtual;
        this.codigo_produto = codigoProduto;
    }
}