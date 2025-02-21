import { Movimentacao } from "../modelo/movimentacao";
import { Produto } from "../modelo/produto";
import { ProdutoMovimentado } from "../modelo/produto-movimentado";

export class UtilHistorico{


    filtrarMovimentacoesPeloMesmoId(movimentacoesProdutos: [{movimentacao: Movimentacao, produto: Produto, produtoMovimentado: ProdutoMovimentado}]): Array<Movimentacao>{
        const idsUnicos = new Set<number>();
        return movimentacoesProdutos.map(mp => mp.movimentacao).filter(movimentacao => {
            if (idsUnicos.has(movimentacao.id)) {
                return false;
            } else {
                idsUnicos.add(movimentacao.id);
                return true;
            }
        });
    }

    filtrarDetalhesPeloIdDaMovimentacao(id: number,movimentacoesProdutos: [{movimentacao: Movimentacao, produto: Produto, produtoMovimentado: ProdutoMovimentado}]): {movimentacao: Movimentacao, produto: Produto, produtoMovimentado: ProdutoMovimentado}[]{
        return movimentacoesProdutos.filter(mp => mp.movimentacao.id === id);
    }
}