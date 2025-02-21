import { selsVisaoEstoque } from "../util/sels-visao-estoque";
import { Notificacao, TIPOS_NOTIFICACAO } from '../../util/notificacao';

export abstract class VisaoEstoque{

    protected touchStartTimeStamp: number = 0;
    protected touchEndTimeStamp: number = 0;
    protected TAB_INDEX_COUNTER: number = 2;
    
    
    limparCampos(){
        const inputCodigo = document.querySelector(selsVisaoEstoque.codigo) as HTMLInputElement;
        inputCodigo.value = '';

        const inputEan = document.querySelector(selsVisaoEstoque.ean) as HTMLInputElement;
        inputEan.value = '';

        const textAreaMotivo = document.querySelector(selsVisaoEstoque.motivo) as HTMLTextAreaElement;
        textAreaMotivo.value = '';

        const lista1 = document.querySelector(selsVisaoEstoque.lista1) as HTMLUListElement;
        lista1.innerHTML = '';
        const li = document.createElement('li');
        li.classList.add("list-group-item","text-muted","list-group-item-action","list-group-item-info","readonly-hoverable","mb-1");
        lista1.appendChild(li);

        const divListagem = document.querySelector(selsVisaoEstoque.lista2) as HTMLDivElement;
        divListagem.innerHTML = '';

        const divGrupo = document.createElement('div');
        divGrupo.classList.add("input-group");

        const spanCodigo = document.createElement('span');
        spanCodigo.classList.add("input-group-text","codigo");
        spanCodigo.innerHTML = '(CÓDIGO INTERNO)';

        const spanAtt = document.createElement('span');
        spanAtt.classList.add("input-group-text","qtd-att");
        spanAtt.innerHTML = '(ESTOQUE ATUAL)';

        const inputQtd = document.createElement('input');
        inputQtd.classList.add("qtd","form-control");
        inputQtd.type = "number";
        inputQtd.placeholder = '0';
        inputQtd.min = '0';
        inputQtd.value = '0';

        divGrupo.append(spanCodigo,inputQtd,spanAtt);
        divListagem.append(divGrupo);
    }
    


    /****************************
     *                          *
     *      NOTIFICAÇÕES
     *                          *
    *****************************/
    exibirNotificacaoProblemasNosDadosErro(msg: string[]): void{
        Notificacao.exibirNotificacao(msg,TIPOS_NOTIFICACAO.ERRO);
    }
    exibirNotificacaoExcecaoErro(msg: string): void{
        Notificacao.exibirNotificacao([msg],TIPOS_NOTIFICACAO.ERRO);
    }
    exibirNotificacaoFavorPreencherOsCamposAviso(): void{
        Notificacao.exibirNotificacao(['Atualize as quantidades dos produtos pesquisados para realizar a movimentação e adicione um motivo.'],TIPOS_NOTIFICACAO.AVISO);
    }
    exibirNotificacaoProdutoEncontradoSucesso(): void{
        Notificacao.exibirNotificacao(['Produto encontrado!'],TIPOS_NOTIFICACAO.SUCESSO);
    }
    exibirNotificacaoProdutoJaListadoInfo(): void{
        Notificacao.exibirNotificacao(['Produto já listado.'],TIPOS_NOTIFICACAO.INFO);
    }
    exibirNotificacaoCodigoInvalidoErro(): void{
        Notificacao.exibirNotificacao(['Código inválido.'],TIPOS_NOTIFICACAO.ERRO);
    }
    exibirNotificacaoPesquisandoProdutoInfo(){
        Notificacao.exibirNotificacao(['Pesquisando produto no sistema...'],TIPOS_NOTIFICACAO.INFO);
    }
    exibirNotificacaoEntradaSucesso(msg: string){
        Notificacao.exibirNotificacao([msg],TIPOS_NOTIFICACAO.SUCESSO);
    }
    exibirNotificacaoSaidaSucesso(msg: string){
        Notificacao.exibirNotificacao([msg],TIPOS_NOTIFICACAO.SUCESSO);
    }
    exibirNotificacaoQuantidadeMaximaSaidaAtingidaAviso(){
        Notificacao.exibirNotificacao(['Quantidade máxima a ser removida atingida para este produto...'],TIPOS_NOTIFICACAO.AVISO);
    }
    exibirNotificacaoQuantidadeMaximaEntradaAtingidaAviso(){
        Notificacao.exibirNotificacao(['Favor adicione no máximo 100 entradas por vez para cada produto...'],TIPOS_NOTIFICACAO.AVISO);
    }
    exibirNotificacaoQuantidadeMovimentacaoInvalidaErro(){
        Notificacao.exibirNotificacao(['Movimentação não pode ser negativa'],TIPOS_NOTIFICACAO.ERRO);
    }
    exibirNotificacaoEstoqueEsgotadoAviso(){
        Notificacao.exibirNotificacao(['Estoque esgotado.'], TIPOS_NOTIFICACAO.AVISO);
    }

    
    


    /***************************************
     * 
     * FUNÇÕES PARA PEGAR VALORES DO USUÁRIO
     * 
    ***************************************/
    valorEan(): string {
        const el = <HTMLInputElement> document.querySelector(selsVisaoEstoque.ean);
        return el.value ? el.value : '';
    }
    valorCodigo(): string {
        const el = <HTMLInputElement> document.querySelector(selsVisaoEstoque.codigo);
        return el.value ? el.value : '';
    }
    valorMotivo(): string {
        const el = <HTMLInputElement> document.querySelector(selsVisaoEstoque.motivo);
        return el.value ? el.value : '';
    }
    valoresMovimentacoes(): string[]{
        const qtds = document.querySelectorAll('.qtd') as NodeListOf<HTMLInputElement>;
        const array: string[] = [];
        for(let i = 0; i < qtds.length; i++){
            array.push(qtds[i].value);
        }
        return array;
    }
}