import { VisaoEstoqueEntrada } from '../visao/visao-estoque-entrada';
import { ControladoraEstoque } from './controladora-estoque';

export class ControladoraEstoqueEntrada extends ControladoraEstoque{

    constructor(visao: VisaoEstoqueEntrada){
        super(visao);
    }

    async movimentarEntradaEstoque(){
        if(!this.camposEstaoPreenchidos()){
            this.visao.exibirNotificacaoFavorPreencherOsCamposAviso();
            return;
        }
        try{
            const motivo = this.visao.valorMotivo();
            const adicoes = this.visao.valoresMovimentacoes();
            const response = await this.gestor.movimentarEntradaEstoque(motivo,adicoes);
            if ( !response.success ) {
                this.visao.exibirNotificacaoProblemasNosDadosErro(response.message);
            } else {
                this.visao.exibirNotificacaoEntradaSucesso(response.message);
            }
        } catch(error: any){
            console.log(error.message);
            this.visao.exibirNotificacaoExcecaoErro(error.message);
        } finally{
            this.limparProdutosPesquisados();
            this.visao.limparCampos();
        }
    }

    async pesquisarProdutoPorCodigo() {
        try{
            const codigoVisao = this.visao.valorCodigo();
            const codigo = this.validador.preencherCodigoInterno(codigoVisao);
            if(this.validador.codigoProdutoValido(codigo)){
                this.visao.exibirNotificacaoPesquisandoProdutoInfo();
                const produto = await this.gestor.consultarProdutoViaCodigo(codigo);
                const estoque = await this.gestor.consultarEstoqueProduto(produto.codigo);
                const sucesso = this.gestor.salvarLocalmenteProdutoPesquisado(produto,estoque);
                if(sucesso){
                    this.visao.exibirNotificacaoProdutoEncontradoSucesso();
                    const produtos = this.gestor.pegarProdutosPesquisados();
                    this.visao.desenharProdutos(produtos);
                } else{
                    this.visao.exibirNotificacaoProdutoJaListadoInfo();
                }
            } else{
                this.visao.exibirNotificacaoCodigoInvalidoErro();
            }
        } catch(error: any){
            console.log(error);
            this.visao.exibirNotificacaoExcecaoErro(error.message);
        }
    }

    async pesquisarProdutoPorEan() {
        try{
            const ean13 = this.visao.valorEan();
            if(this.validador.eanDePesquisaValido(ean13)){
                this.visao.exibirNotificacaoPesquisandoProdutoInfo()
                const produto = await this.gestor.consultarProdutoViaEan(ean13);
                const estoque = await this.gestor.consultarEstoqueProduto(produto.codigo);
                const sucesso = this.gestor.salvarLocalmenteProdutoPesquisado(produto,estoque);
                if(sucesso){
                    this.visao.exibirNotificacaoProdutoEncontradoSucesso();
                    const produtos = this.gestor.pegarProdutosPesquisados();
                    this.visao.desenharProdutos(produtos);
                } else{
                    this.visao.exibirNotificacaoProdutoJaListadoInfo();
                }
            } else{
                this.visao.exibirNotificacaoCodigoInvalidoErro();
            }
        } catch(error: any){
            console.log(error);
            this.visao.exibirNotificacaoExcecaoErro(error.message);
        }

    }

}
