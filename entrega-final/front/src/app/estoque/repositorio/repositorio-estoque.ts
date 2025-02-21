import { API } from "../../infra/API";
import { Estoque } from "../modelo/estoque";
import { Produto } from "../modelo/produto";

export class RepositorioEstoque{

    private static KEY = 'movimentacao';

    getProdutosSalvos(): Array<{produto: Produto; estoque: Estoque}>{
        const produtos = localStorage.getItem(RepositorioEstoque.KEY);
        return produtos ? JSON.parse(produtos) : new Array<{ produto: Produto; estoque: Estoque}>();
    }
    clear() {
        localStorage.removeItem(RepositorioEstoque.KEY);
    }
    salvarLocalmenteProdutosJaPesquisados(novoEstoqueProdutos: Array<{produto: Produto, estoque: Estoque}>){
        localStorage.setItem(RepositorioEstoque.KEY,JSON.stringify(novoEstoqueProdutos));
    }
    salvarLocalmenteProdutoPesquisado(produto_estoque: { produto: Produto; estoque: Estoque} ) {
        const estoque_produtos = this.getProdutosSalvos();
        estoque_produtos.push(produto_estoque);
        localStorage.setItem(RepositorioEstoque.KEY,JSON.stringify(estoque_produtos));
    }


    async consultarEstoqueProduto(codigo: string): Promise<Estoque> {
        const response = await fetch( `${API}/estoque/produto/codigo?codigo=${codigo}`, { method: 'get', credentials:'include' } );
        const text = await response.text();
        if(response.status >= 400){
            throw new Error(text);
        }
        return JSON.parse(text);
    }
    async consultarProdutoViaCodigo(codigo: string): Promise<Produto> {
        const response = await fetch(`${API}/produto/codigo?codigo=${codigo}`, { method: 'get', credentials:'include'  } );
        const text = await response.text();
        if(response.status >= 400){
            throw new Error(text);
        }
        return JSON.parse(text);
    }
    async consultarProdutoViaEan(ean: string): Promise<Produto> {
        const response = await fetch(`${API}/produto/ean?ean=${ean}`, { method: 'get', credentials:'include'  } );
        const text = await response.text();
        if(response.status >= 400){
            throw new Error(text);
        }
        return JSON.parse(text);
    }


    async atualizarEstoqueEntrada(entradasEstoque: Array<{produto: string, adicao: number, motivo: string, totalAnterior: number, totalPosterior: number}>) {
        const response = await fetch(`${API}/estoque/entrada`, { method: 'post', body: JSON.stringify(entradasEstoque), headers: {'Content-Type': 'application/json'}, credentials:'include'  } );
        const text = await response.text();
        if(response.status >= 400){
            throw new Error(text);
        }
        return JSON.parse(text);
    }

    async atualizarEstoqueSaida(saidasEstoque: Array<{produto: string, remocao: number, motivo: string, totalAnterior: number, totalPosterior: number, categoria: string}>) {
        const response = await fetch(`${API}/estoque/saida`, { method: 'post', body: JSON.stringify(saidasEstoque), headers: {'Content-Type': 'application/json'}, credentials:'include'  } );
        const text = await response.text();
        if(response.status >= 400){
            throw new Error(text);
        }
        return JSON.parse(text);
    }


    async buscarProdutosEstoqueMinimo(): Promise<Array<{nome: string, codigo: string}>> {
        const response = await fetch(`${API}/estoque/produtos/reposicao`, { method: 'get', credentials:'include'  } );
        const text = await response.text();
        if(response.status >= 400){
            throw new Error(text);
        }
        return JSON.parse(text);
    }

}
