import { ProdutoMovimentado } from './../modelo/produto-movimentado';
import { Notificacao, TIPOS_NOTIFICACAO } from "../../util/notificacao";
import { ControladoraHistorico } from "../controladora/controladora-historico";
import { TIPO_MOVIMENTACAO } from "../modelo/enum-movimentacao";
import { Movimentacao } from "../modelo/movimentacao";
import { Produto } from "../modelo/produto";
import { TIPO_CATEGORIA } from '../modelo/enum-categoria';

export class VisaoHistorico{

    private static CONTADOR = 0;

    iniciar(){
        const controladora = new ControladoraHistorico(this);

        if(document.readyState == 'complete'){
            controladora.carregar();
        }

        window.onbeforeunload = () => {
            controladora.limpar();
        }
    }


    exibirNotificacaoExcecaoErro(msg: string): void{
        Notificacao.exibirNotificacao([msg],TIPOS_NOTIFICACAO.ERRO);
    }
    exibirNotificacaoNaoHaHistoricoInfo() {
        Notificacao.exibirNotificacao(['Não há histórico de movimentações no estoque.'],TIPOS_NOTIFICACAO.INFO);
    }



    desenharDetalhes(movimentacaoCompleta: {movimentacao: Movimentacao, produto: Produto, produtoMovimentado: ProdutoMovimentado}[]){
        const titulo = document.querySelector('.modal-title') as HTMLTitleElement;
        titulo.innerHTML = `Detalhes da Movimentação`;
        const body = document.querySelector('.modal-body') as HTMLDivElement;

        body.innerHTML = 
        `
            <h5>Tipo de Movimentação</h5>
            <p>${movimentacaoCompleta.at(0)?.movimentacao.tipo}</p>
            <h5>Data e Hora</h5>
            <p>${movimentacaoCompleta.at(0)?.movimentacao.dia} ${movimentacaoCompleta.at(0)?.movimentacao.hora}</p>
            <h5>Total</h5>
            <p>${movimentacaoCompleta.at(0)?.movimentacao.quantidade} produtos</p>
            <h5>Motivo</h5>
            <p>${movimentacaoCompleta.at(0)?.movimentacao.motivo}</p>
        `;

        movimentacaoCompleta.forEach(el => {
            body.innerHTML += 
            `
                <br><br>
                <h5>Produto</h5>
                <p>${el.produto.nome}</p>
                <h5>Formato de Recebimento</h5>
                <p>${el.produto.recebimento} ${el.produto.quantidade_recebimento}${el.produto.medida}</p>
                <h5>Total Anterior à Movimentação</h5>
                <p>${el.produtoMovimentado.total_anterior} (${el.produtoMovimentado.total_anterior * el.produto.quantidade_recebimento} ${el.produto.medida})</p>
                <h5>Total Posterior à Movimentação</h5>
                <p>${el.produtoMovimentado.total_posterior} (${el.produtoMovimentado.total_posterior * el.produto.quantidade_recebimento} ${el.produto.medida})</p>
                <h5>Resumo</h5>
            `;

            if(el.movimentacao.tipo == TIPO_MOVIMENTACAO.SAIDA){ // Se for saída, imprimir pela forma de recebimento ou pela unidade de recebimento

                if(el.produto.categoria == TIPO_CATEGORIA.VENDAVEL){ // Os externos (vendáveis), imprimir-se-ão pelas unidades (un, kg)

                    const totalAnterior = el.produtoMovimentado.total_anterior * el.produto.quantidade_recebimento;
                    const totalPosterior = el.produtoMovimentado.total_posterior * el.produto.quantidade_recebimento;
                    const diferenca = totalPosterior - totalAnterior;

                    if( el.produtoMovimentado.total_anterior > el.produtoMovimentado.total_posterior ){
                        body.innerHTML += `<p style="color: red">${diferenca} ${el.produto.medida}</p>`;
                    } else {
                        body.innerHTML += `<p style="color: green">+${diferenca} ${el.produto.medida}</p>`;
                    }
                } else {
                    const diferenca = el.produtoMovimentado.total_posterior - el.produtoMovimentado.total_anterior;
                    if( el.produtoMovimentado.total_anterior > el.produtoMovimentado.total_posterior ){
                        body.innerHTML += `<p style="color: red">${diferenca} ${el.produto.recebimento}</p>`;
                    } else {
                        body.innerHTML += `<p style="color: green">+${diferenca} ${el.produto.recebimento}</p>`;
                    }
                }

            } else { // Entrada no estoque (é sempre pela forma de recebimento (caixa, engradado, ...))
                const diferenca = el.produtoMovimentado.total_posterior - el.produtoMovimentado.total_anterior;
                if( el.produtoMovimentado.total_anterior > el.produtoMovimentado.total_posterior ){
                    body.innerHTML += `<p style="color: red">${diferenca} ${el.produto.recebimento}</p>`;
                } else {
                    body.innerHTML += `<p style="color: green">+${diferenca} ${el.produto.recebimento}</p>`;
                }
            }

            
        });

        
    }



    /*********************
    *                    *
    *      TABELA        *
    *                    *
    *********************/
    private definirEventos() {
        // Visualizar detalhes da movimentação
        const botoesDeDetalhes = document.getElementsByClassName('visualizar-movimentacao');
        if (botoesDeDetalhes) {
            Array.from(botoesDeDetalhes).forEach(botao => {
                botao.addEventListener('click', (event) => {
                    event.preventDefault();
                    // Encontra o elemento pai <tr> mais próximo
                    const target = event.target as HTMLElement;
                    const row = target ? target.closest('tr') : null;
                    if (row) {
                        // Obtém o ID da linha
                        const id = row.dataset.id;
                        const controladora = new ControladoraHistorico(this);
                        controladora.carregarDetalhes(id);

                    }
                });
            });
        }
    }

    desenharTabelaMovimentacoes(historico: Array<Movimentacao>): void {
        const tbody = document.querySelector('tbody');
        if(tbody){
        tbody.innerHTML = '';

        const fragmento = document.createDocumentFragment();
        for (const el of historico) {
            const linha = this.criarLinha(el);
            fragmento.append(linha);
        }
        tbody.append(fragmento);

        // Adiciona eventos aos botões de ação
        this.definirEventos();

        // Reseta contador de linhas
        VisaoHistorico.CONTADOR = 0;
        
        }
    }
  

  /**
   * Cria uma linha com os dados de uma Movimentacao e retorna.
   *
   * @param {Movimentacao} m
   * @returns {HTMLTableRowElement}
   */
    criarLinha(m: Movimentacao): HTMLTableRowElement {
        const tr = document.createElement('tr');

        const celulaContagem = this.criarCelula(VisaoHistorico.CONTADOR += 1);
        const celulaStatus = this.criarCelulaDeStatus(m.tipo);
        const celulaDataHora = this.criarCelula(m.dia + ' ' + m.hora);
        const celulaTotal = this.criarCelula(m.quantidade);
        const celulaMotivo = this.criarCelula(m.motivo);
        const celulaActions = document.createElement('td');
        celulaActions.innerHTML = `
        <div class="action justify-content-end">
            <button class="more-btn ml-10 dropdown-toggle" id="moreAction1" data-bs-toggle="dropdown"
                aria-expanded="false">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <!-- Círculo superior -->
                    <circle cx="12" cy="6" r="2" fill="#000"/>
                    <!-- Círculo do meio -->
                    <circle cx="12" cy="12" r="2" fill="#000"/>
                    <!-- Círculo inferior -->
                    <circle cx="12" cy="18" r="2" fill="#000"/>
                </svg>
            </button>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="moreAction1">
                <li class="dropdown-item">
                <a href="#0" class="text-gray visualizar-movimentacao" data-bs-toggle="modal" data-bs-target="#detalhesModal">Visualizar</a>
                </li>
            </ul>
        </div>
        `;


        tr.append(
            celulaContagem,
            celulaStatus,
            celulaDataHora,
            celulaTotal,
            celulaMotivo,
            celulaActions
        );

        tr.setAttribute('data-id', m.id.toString()); // Adiciona o id da movimentação à linha

        return tr;
    }

  /**
   * Cria uma célula para uma linha da tabela e retorna.
   *
   * @param {any} conteudo
   * @returns {HTMLTableCellElement}
   */
  criarCelula(conteudo: any): HTMLTableCellElement {
    const td = document.createElement('td');
    const p = document.createElement('p');
    p.classList.add('text-sm')
    p.innerText = conteudo;
    td.append(p);
    return td;
  }

  /**
   * Cria uma célula de status para uma linha da tabela e retorna.
   *
   * @param {string} tipo
   * @returns {HTMLTableCellElement}
   */
  criarCelulaDeStatus(tipo: string): HTMLTableCellElement {
    const td = document.createElement('td');
    const span = document.createElement('span');

    switch(tipo) {
        case TIPO_MOVIMENTACAO.ENTRADA:
           span.classList.add('status-btn', 'success-btn');
           span.innerText = "ENTRADA";
        break;
        case TIPO_MOVIMENTACAO.SAIDA:
            span.classList.add('status-btn', 'close-btn');
            span.innerText = "SAÍDA";
        break;
        default: 
            span.classList.add('status-btn', 'warning-btn'); // ??
            span.innerText = '?';
        break;
    }

    td.append(span);

    return td;
  }

}