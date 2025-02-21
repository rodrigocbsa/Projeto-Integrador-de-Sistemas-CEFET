import { Estoque } from "../modelo/estoque";
import { Produto } from "../modelo/produto";
import { RepositorioEstoque } from "../repositorio/repositorio-estoque";

export class GestorEstoque{
    
    private repo: RepositorioEstoque;

    constructor(){
        this.repo = new RepositorioEstoque();
    }


    async consultarEstoqueProduto(codigo: string) {
        return await this.repo.consultarEstoqueProduto(codigo);
    }

    async movimentarEntradaEstoque(motivo: string, adicoes: string[]) {
        const estoque_produtos = this.repo.getProdutosSalvos();
        let i = 0;
        const movimentacoes = new Array<{produto: string, adicao: number, motivo: string, totalAnterior: number, totalPosterior: number}>;
        estoque_produtos.forEach(ep => {
            const obj = {
                produto: ep.produto.codigo,
                adicao: Number(adicoes[i]),
                motivo: motivo,
                totalAnterior: ep.estoque.estoque_atual,
                totalPosterior: ep.estoque.estoque_atual + Number(adicoes[i])
            };
            movimentacoes.push(obj);
            i++;
        });
        return await this.repo.atualizarEstoqueEntrada(movimentacoes);
    }

    async movimentarSaidaEstoque(motivo: string, remocoes: string[]) {
        const estoque_produtos = this.repo.getProdutosSalvos();
        let i = 0;
        const movimentacoes = new Array<{produto: string, remocao: number, motivo: string, totalAnterior: number, totalPosterior: number, categoria: string}>;
        estoque_produtos.forEach(ep => {
            const obj = {
                produto: ep.produto.codigo,
                remocao: Number(remocoes[i]),
                motivo: motivo,
                totalAnterior: ep.estoque.estoque_atual,
                totalPosterior: ep.estoque.estoque_atual - Number(remocoes[i]),
                categoria: ep.produto.categoria,
            };
            movimentacoes.push(obj);
            i++;
        });
        return await this.repo.atualizarEstoqueSaida(movimentacoes);
    }


    async consultarProdutoViaCodigo(codigo: string): Promise<Produto> {
        return await this.repo.consultarProdutoViaCodigo(codigo);
    }

    async consultarProdutoViaEan(ean: string): Promise<Produto> {
        return await this.repo.consultarProdutoViaEan(ean);
    }

    removerProdutoPesquisado(cod: string) {
        const estoqueProdutos = this.repo.getProdutosSalvos();
        const novoEstoqueProdutos = new Array<{produto: Produto, estoque: Estoque}>;
        estoqueProdutos.forEach(ep => {
            if(ep.produto.codigo != cod)
                novoEstoqueProdutos.push(ep);
        });
        this.repo.salvarLocalmenteProdutosJaPesquisados(novoEstoqueProdutos);
    }

    produtoJaSalvo(produto: Produto) : boolean {
        const estoque_produtos = this.repo.getProdutosSalvos();
        for(let i = 0; i < estoque_produtos.length; i++){
            if(estoque_produtos[i].produto.codigo == produto.codigo)
                return true;
        }
        return false;
    }
    
    salvarLocalmenteProdutoPesquisado(produto: Produto, estoque: Estoque) : boolean{
        if(!this.produtoJaSalvo(produto)){
            this.repo.salvarLocalmenteProdutoPesquisado({produto,estoque});
            return true;
        }
        return false;
    }

    pegarProdutosPesquisados() : Array<{ produto: Produto; estoque: Estoque}> {
        return this.repo.getProdutosSalvos();
    }

    limparProdutosPesquisados(){
        this.repo.clear();
    }
}