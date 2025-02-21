export class Item{
    id: number;
    preco: number;
    quantidade: number; // Vai para a tabela associativa pedido_item
    descricao: string;
    categoria: string;

    constructor(
        id = 0,
        descricao = '',
        quantidade = 0,
        preco = 0.0,
        categoria = ''
    ){
        this.id = id;
        this.descricao = descricao;
        this.quantidade = quantidade;
        this.preco = preco;
        this.categoria = categoria;
    }

    validarItem(): Array<string>{
        const problemas: Array<string> = [];

        this.validaDescricao(problemas);
        this.validaQuantidade(problemas);
        this.validaPreco(problemas);
        this.validaCategoria(problemas);

        return problemas;
    }
    
    validaCategoria(problemas: string[]) {
        if(!(this.categoria === 'Entrada' || this.categoria === 'Principal' || this.categoria === 'Bebida' || this.categoria === 'Sobremesa')){
            problemas.push("Categoria inválida");
        }
    }
    validaPreco(problemas: string[]) {
        if(Number.isNaN(this.preco) || this.preco == 0)
            problemas.push("Preço inválido");
        else {
            if(this.preco < 10 || this.preco > 50){
                problemas.push("Preço dos itens do restaurante deve estar entre R$ 10,00 e R$ 50,00");
            }
        }
    }
    validaQuantidade(problemas: string[]) {
        if(Number.isNaN(this.quantidade) || this.quantidade == 0)
            problemas.push("Quantidade inválida");
        else {
            if(this.quantidade <= 0){
                problemas.push("Quantidade não pode ser zero");
            }
        }
    }
    validaDescricao(problemas: string[]) {
        const regex: RegExp = /[a-z ]/gi;
        if(!regex.test(this.descricao))
            problemas.push("Descrição do item inválida");
    }
}