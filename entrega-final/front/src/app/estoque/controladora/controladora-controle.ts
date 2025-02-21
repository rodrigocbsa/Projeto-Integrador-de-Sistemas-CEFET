import { RepositorioEstoque } from "../repositorio/repositorio-estoque";
import { VisaoControle } from "../visao/visao-controle";

export class ControladoraControle{

    private visao: VisaoControle;
    private repo: RepositorioEstoque;

    constructor(visao: VisaoControle){
        this.visao = visao;
        this.repo = new RepositorioEstoque;
    }


    async carregar(){
        try{
            // Buscar
            const produtosAbaixoEstoqueMinimo = await this.repo.buscarProdutosEstoqueMinimo();
            if ( produtosAbaixoEstoqueMinimo.length > 0 ) {
                this.visao.desenharTabela(produtosAbaixoEstoqueMinimo);
            } else {
                this.visao.exibirNotificacaoNaoHaProdutosInfo();
            }
        } catch(error: any){
            console.log(error);
            this.visao.exibirNotificacaoExcecaoErro(error.message);
        }
    }

}