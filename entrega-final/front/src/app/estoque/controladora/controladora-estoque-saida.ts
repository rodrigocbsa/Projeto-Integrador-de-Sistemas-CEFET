import { VisaoEstoqueSaida } from '../visao/visao-estoque-saida';
import { ControladoraEstoque } from './controladora-estoque';

export class ControladoraEstoqueSaida extends ControladoraEstoque{

    constructor(visao: VisaoEstoqueSaida){
        super(visao);
    }

    async movimentarSaidaEstoque() {
        if(!this.camposEstaoPreenchidos()){
            console.log(this);
            this.visao.exibirNotificacaoFavorPreencherOsCamposAviso();
            return;
        }
        try{
            const motivo = this.visao.valorMotivo();
            const remocoes = this.visao.valoresMovimentacoes();
            const response = await this.gestor.movimentarSaidaEstoque(motivo,remocoes);
            if ( !response.success ) {
                this.visao.exibirNotificacaoProblemasNosDadosErro(response.message);
            } else {
                this.visao.exibirNotificacaoSaidaSucesso(response.message);
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
                if(estoque.estoque_atual == 0){
                    this.visao.exibirNotificacaoEstoqueEsgotadoAviso();
                    return;
                }
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
                if(estoque.estoque_atual == 0){
                    this.visao.exibirNotificacaoEstoqueEsgotadoAviso();
                    return;
                }
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