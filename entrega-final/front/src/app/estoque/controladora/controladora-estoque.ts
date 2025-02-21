import { ValidadorEstoque } from '../util/validador-estoque';
import { VisaoEstoqueEntrada } from '../visao/visao-estoque-entrada';
import { VisaoEstoqueSaida } from '../visao/visao-estoque-saida';
import { GestorEstoque } from './gestor-estoque';

export abstract class ControladoraEstoque{

    protected visao : VisaoEstoqueEntrada | VisaoEstoqueSaida;
    protected gestor : GestorEstoque;
    protected validador : ValidadorEstoque;

    constructor(visao: VisaoEstoqueEntrada | VisaoEstoqueSaida){
        this.visao = visao;
        this.gestor = new GestorEstoque();
        this.validador = new ValidadorEstoque();
    }


    codigoInternoPreenchido() {
        return this.validador.valorPossuiConteudo(this.visao.valorCodigo());
    }

    codigoEanPreenchido() {
        return this.validador.valorPossuiConteudo(this.visao.valorEan());
    }

    camposEstaoPreenchidos() {
        const motivo = this.visao.valorMotivo();
        const movimentacoes = this.visao.valoresMovimentacoes();
        
        if(motivo.length == 0 || movimentacoes.includes('0')){
            return false;
        }
        else
            return true;
    }

    limparProdutosPesquisados(){
        this.gestor.limparProdutosPesquisados();
    }
    
    removerProdutoDaPesquisa(cod: string) {
        this.gestor.removerProdutoPesquisado(cod);
        const produtos = this.gestor.pegarProdutosPesquisados();
        this.visao.desenharProdutos(produtos);
    }
}