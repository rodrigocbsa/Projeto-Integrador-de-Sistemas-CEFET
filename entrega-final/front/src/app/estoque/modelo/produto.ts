
export class Produto {

    nome: string;
    codigo: string;
    ean13: string;
    vencimento: string;
    categoria: string;
    medida: string;
    recebimento: string;
    quantidade_recebimento: number;



    constructor(nome: string, codigo: string, ean13: string, vencimento: string, categoria: string, medida: string, recebimento: string, quantidadeRecebimento: number) {

        this.nome = nome;
        this.codigo = codigo;
        this.ean13 = ean13;
        this.vencimento = vencimento;
        this.categoria = categoria;
        this.medida = medida;
        this.recebimento = recebimento;
        this.quantidade_recebimento = quantidadeRecebimento;

    }

}
