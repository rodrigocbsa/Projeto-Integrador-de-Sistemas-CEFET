import { ControladoraEstoqueEntrada } from "../controladora/controladora-estoque-entrada";
import { Estoque } from "../modelo/estoque";
import { Produto } from "../modelo/produto";
import { selsVisaoEstoque } from "../util/sels-visao-estoque";
import { VisaoEstoque } from "./visao-estoque";

export class VisaoEstoqueEntrada extends VisaoEstoque{

    

    iniciar(): void {
        const controladora = new ControladoraEstoqueEntrada(this);

        const botaoMovimentar = document.querySelector(selsVisaoEstoque.botao) as HTMLButtonElement;
        botaoMovimentar.addEventListener('click', (e) => {
            e.preventDefault();
            controladora.movimentarEntradaEstoque();
        });


        const inputCodigo = document.querySelector(selsVisaoEstoque.codigo) as HTMLInputElement;
        inputCodigo.onblur = () => {
            if(controladora.codigoInternoPreenchido())
                controladora.pesquisarProdutoPorCodigo();
        }

        const inputEan = document.querySelector(selsVisaoEstoque.ean) as HTMLInputElement;
        inputEan.onblur = () => {
            if(controladora.codigoEanPreenchido())
                controladora.pesquisarProdutoPorEan()
        }

        window.onbeforeunload = () => {
            controladora.limparProdutosPesquisados()
        }
    }


    /********************************
     * 
     * FUNÇÕES PARA DESENHAR NA TELA
     * 
    *********************************/
    desenharProdutos(estoqueProdutos: { produto: Produto; estoque: Estoque}[]){
        this.desenharListagemRemocao(estoqueProdutos);
        this.desenharListagemMovimentacao(estoqueProdutos);
    }
    private desenharListagemMovimentacao(estoqueProdutos: { produto: Produto; estoque: Estoque}[]){
        const divListagem = document.querySelector(selsVisaoEstoque.lista2) as HTMLDivElement;
        divListagem.innerHTML = '';
        estoqueProdutos.forEach(ep => {
            const divGrupo = document.createElement('div');
            divGrupo.classList.add("input-group");

            const spanCodigo = document.createElement('span');
            spanCodigo.classList.add("input-group-text","codigo");
            spanCodigo.innerHTML = `${ep.produto.codigo}`;

            const spanTotalRecebimentos = document.createElement('span');
            spanTotalRecebimentos.classList.add("input-group-text","qtd-att");
            spanTotalRecebimentos.innerHTML = `${ep.estoque.estoque_atual} + 0 ${ep.produto.recebimento}s`;

            const spanTotalEmUnidades = document.createElement('span');
            spanTotalEmUnidades.classList.add("input-group-text","total-att");
            const totalAtual = ep.estoque.estoque_atual * ep.produto.quantidade_recebimento;
            spanTotalEmUnidades.innerHTML = `${totalAtual} + 0 ${ep.produto.medida}`;

            const inputQtd = document.createElement('input');
            inputQtd.classList.add("qtd","form-control");
            inputQtd.type = "number";
            inputQtd.placeholder = '0';
            inputQtd.min = '0';
            

            inputQtd.addEventListener('input', (event) => {
                // Impedir caracteres não numéricos no campo de quantidade a ser movimentada
                const input = event.target as HTMLInputElement;
                input.value = input.value.replace(/[^0-9]/g, '');
                // Calcular os novos totais
                let totalEntrada = Number(inputQtd.value) * ep.produto.quantidade_recebimento;
                // Impedir inserção de valores maiores que o estoque atual do produto
                if(Number(inputQtd.value) > 100){
                    // Resetar valores para o máximo possível
                    inputQtd.value = '100';
                    totalEntrada = Number(inputQtd.value) * ep.produto.quantidade_recebimento;
                    spanTotalRecebimentos.innerHTML = '0';
                    this.exibirNotificacaoQuantidadeMaximaEntradaAtingidaAviso();
                }
                // Imprimir os novos totais
                spanTotalEmUnidades.innerHTML = `${totalAtual} + ${totalEntrada} ${ep.produto.medida}`;
                spanTotalRecebimentos.innerHTML = `${ep.estoque.estoque_atual} + ${inputQtd.value} ${ep.produto.recebimento}s`;
            });

            inputQtd.tabIndex = this.TAB_INDEX_COUNTER++;

            divGrupo.append(spanCodigo,inputQtd,spanTotalRecebimentos,spanTotalEmUnidades);
            divListagem.append(divGrupo);
        });
    }
    private desenharListagemRemocao(estoqueProdutos: { produto: Produto; estoque: Estoque}[]){
        const ul = document.querySelector(selsVisaoEstoque.lista1) as HTMLUListElement;
        ul.innerHTML = '';
        if(estoqueProdutos.length == 0){
            this.limparCampos();
            return;
        }
        estoqueProdutos.forEach(ep => {
            const li = document.createElement('li');
            li.classList.add("list-group-item","text-muted","list-group-item-action","list-group-item-info","readonly-hoverable","mb-1");
            li.innerHTML = `${ep.produto.nome} #${ep.produto.codigo} | ESTOQUE ATUAL: ${ep.estoque.estoque_atual} ${ep.produto.recebimento.toLowerCase()}s de ${ep.produto.quantidade_recebimento} ${ep.produto.medida} (${ep.estoque.estoque_atual * ep.produto.quantidade_recebimento} total)`;
            ul.appendChild(li);
            li.addEventListener('dblclick', () => {
                li.remove();
                const controladora = new ControladoraEstoqueEntrada(this);
                controladora.removerProdutoDaPesquisa(ep.produto.codigo);
            });
            li.addEventListener('touchstart', (e) => {
                this.touchStartTimeStamp = e.timeStamp;
            });
            li.addEventListener('touchend', (e) => {
                this.touchEndTimeStamp = e.timeStamp;
                const diff = this.touchEndTimeStamp - this.touchStartTimeStamp
                if(diff > 900 && diff < 1800){
                    li.remove();
                    const controladora = new ControladoraEstoqueEntrada(this);
                    controladora.removerProdutoDaPesquisa(ep.produto.codigo);
                }
            });
        });
    }
    
}
