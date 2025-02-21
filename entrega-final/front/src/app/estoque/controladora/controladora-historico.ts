import { RepositorioHistorico } from "../repositorio/repositorio-historico";
import { UtilHistorico } from "../util/util-historico";
import { VisaoHistorico } from "../visao/visao-historico";

export class ControladoraHistorico{

    private visao: VisaoHistorico;
    private repo: RepositorioHistorico;
    private util: UtilHistorico;

    constructor(visao: VisaoHistorico){
        this.visao = visao;
        this.repo = new RepositorioHistorico();
        this.util = new UtilHistorico();
    }


    async carregar(){
        try{
            // Buscar
            const movimentacoesProdutos = await this.repo.todasMovimentacoes();
            if ( movimentacoesProdutos.length > 0 ) {
                // Salvar localmente como [{movimentacao: Movimentacao, produto: Produto, produtoMovimentado: ProdutoMovimentado}]
                this.repo.salvar(movimentacoesProdutos);
                // Agrupar pelo id da movimentação (retirar as repetições)
                const historico = this.util.filtrarMovimentacoesPeloMesmoId(movimentacoesProdutos);
                // Desenhar as movimentações unicamente
                this.visao.desenharTabelaMovimentacoes(historico);
            } else {
                this.visao.exibirNotificacaoNaoHaHistoricoInfo();
            }
        } catch(error: any){
            console.log(error);
            this.visao.exibirNotificacaoExcecaoErro(error.message);
        }
    }

    limpar(){
        this.repo.clear();
    }

    carregarDetalhes(id = ''){
        const movimentacoesProdutos = this.repo.getSalvos();
        const movimentacaoCompleta = this.util.filtrarDetalhesPeloIdDaMovimentacao(Number(id),movimentacoesProdutos);
        this.visao.desenharDetalhes(movimentacaoCompleta);
    }

}