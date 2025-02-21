import { API } from "../../infra/API";
import { Movimentacao } from "../modelo/movimentacao";
import { Produto } from "../modelo/produto";
import { ProdutoMovimentado } from "../modelo/produto-movimentado";

export class RepositorioHistorico{

    private static KEY = 'historico';

    salvar(historico: [{movimentacao: Movimentacao, produto: Produto, produtoMovimentado: ProdutoMovimentado}]) {

        localStorage.setItem(RepositorioHistorico.KEY,JSON.stringify(historico));
    }

    getSalvos(): [{movimentacao: Movimentacao, produto: Produto, produtoMovimentado: ProdutoMovimentado}]{
        const els = localStorage.getItem(RepositorioHistorico.KEY);
        return els ? JSON.parse(els) : [];
    }

    clear() {
        localStorage.removeItem(RepositorioHistorico.KEY);
    }


    async todasMovimentacoes(): Promise<[{movimentacao: Movimentacao, produto: Produto, produtoMovimentado: ProdutoMovimentado}]>{
        const response = await fetch( `${API}/estoque/historico`, { method: 'get', credentials:'include' } );
        const text = await response.text();
        if(response.status >= 400){
            console.log(text);
            throw new Error(text);
        }
        return JSON.parse(text);
    }

}