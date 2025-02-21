import { Chart } from "chart.js/auto";
import { ControladoraDashboard } from "../controladora/controladora-dashboard";
import { Reserva } from "../../reserva/modelo/reserva";
import { Notificacao, TIPOS } from '../../util/notificacao';
import { ControladoraPedidos } from '../../pedido/controladora/controladora-pedidos';
import { VisaoPedidos } from "../../pedido/visao/visao-pedidos";
import { Item } from "../../item/modelo/item";

export const sel = {
  reservas            : '#carregar-reservas',
  relatorio           : '#gerar-relatorio',
  grafico             : '#grafico-reservas-periodo',
  dti                 : '#data-inicio',
  dtf                 : '#data-fim',
  pagamento           : '#modo-pagamento',
  resumo              : '#resumo-pedido',
  total               : '#total',
  totalFinal          : '#total-final',
  fecharOffCanvas     : '#fechar-offcanvas',
  reservasFeitas      : '#reservas-feitas',
  pedidosRealizados   : '#pedidos-realizados',
  receitaTotal        : '#receita-total'
}


export class VisaoDashboard {
  
  controladora: ControladoraDashboard | undefined;
  controladoraPedidos: ControladoraPedidos | undefined;
  private static CONTADOR = 0;

  iniciar(): void {
    this.controladora = new ControladoraDashboard(this);
    this.controladoraPedidos = new ControladoraPedidos(new VisaoPedidos());

    const botaoReservas = document.querySelector(sel.reservas) as HTMLButtonElement;
    botaoReservas.onclick = (event: Event) => {
      event.preventDefault();
      this.controladora?.listarReservas();
    };

    const botaoRelatorio = document.querySelector(sel.relatorio) as HTMLButtonElement;
    botaoRelatorio.onclick = (event: Event) => {
      event.preventDefault();
      this.controladora?.gerarRelatorio();
    };

    const botaoFecharOffCanvas = document.querySelector(sel.fecharOffCanvas) as HTMLButtonElement;
    botaoFecharOffCanvas.onclick = () => {
      this.limparOffCanvas();
    }

    // Extra: ao carregar a tela, pegar dados gerais e carregar reservas na tabela
    if(document.readyState){
      this.controladora?.listarReservas();
      this.controladora?.loadExtras();
  }
  }


  /****************************/
  /* VisaoDashboard FUNCTIONS */
  /****************************/

  exibirNotificacao(mensagens: Array<string>, tipo: TIPOS): void{
    Notificacao.exibirNotificacao(mensagens, tipo);
  }

  desenharExtras(totalReservasFeitas: string, totalPedidosRealizados: string, receitaTotal: string) {
    (document.querySelector(sel.reservasFeitas) as HTMLTitleElement).innerHTML = totalReservasFeitas;
    (document.querySelector(sel.pedidosRealizados) as HTMLTitleElement).innerHTML = totalPedidosRealizados;
    (document.querySelector(sel.receitaTotal) as HTMLTitleElement).innerHTML = `R$ ${receitaTotal},00`;
  }

  
  
  /**********************
   *                    *
   *      GRÁFICO       *
   *                    *
   *********************/
  desenharGrafico(datasOrdenadas: Array<string>, totaisPorData: Array<number>) {
    const canva = <HTMLCanvasElement> document.querySelector(sel.grafico);
    const ctx = canva.getContext("2d");
    if(ctx){
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: datasOrdenadas,
          datasets: [
            {
              label: "Reservas na data",
              backgroundColor: "#365CF5",
              borderRadius: 30,
              barThickness: 6,
              maxBarThickness: 8,
              data: totaisPorData,
            },
          ],
        },
        options: {
          layout: {
            padding: {
              top: 15,
              right: 15,
              bottom: 15,
              left: 15,
            },
          },
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1,
                callback: function(value) {
                  return Number.isInteger(value) ? value : null;
                }
              }
            },
            x: {
              grid: {
                display: false,
                color: "rgba(143, 146, 161, .1)",
                drawTicks: false,
              },
              ticks: {
                padding: 20,
              },
            },
          }
        },
      });
    }
    
  }

  removerGrafico(){
    const divCanva = document.getElementsByClassName("chart")[0] as HTMLDivElement;
    divCanva.innerHTML = '';
    const canvas = document.createElement("canvas") as HTMLCanvasElement;
    canvas.id = "grafico-reservas-periodo";
    divCanva.appendChild(canvas);
  }

  valorDataInicioRelatorio(): string {
    const el = <HTMLInputElement> document.querySelector(sel.dti);
    return el.value;
  }
  valorDataFinalRelatorio(): string {
    const el = <HTMLInputElement> document.querySelector(sel.dtf);
    return el.value;
  }


  /**********************
   *                    *
   *      TABELA       *
   *                    *
   *********************/
  private definirEventos() {

    // Cancelar reserva
    const botoesDeCancelamento = document.getElementsByClassName('cancelar-reserva');
    if (botoesDeCancelamento) {
      Array.from(botoesDeCancelamento).forEach(botao => {
        botao.addEventListener('click', (event) => {
          event.preventDefault();
          // Encontra o elemento pai <tr> mais próximo
          const target = event.target as HTMLElement;
          const row = target ? target.closest('tr') : null;
          if (row) {
            // Obtém o ID da linha
            const reservaId = row.dataset.id;
            this.controladora?.cancelarReserva(reservaId ?? '');
          }
        });
      });
    }
  
    // Adicionar pedidos
    const botoesDePedido = document.getElementsByClassName('adicionar-pedido');
    if(botoesDePedido) {
      Array.from(botoesDePedido).forEach(botao => {
        botao.addEventListener('click', (event => {
          event.preventDefault();
          const target = event.target as HTMLElement;
          const row = target ? target.closest('tr') : null;
          if(row) {
            const reservaId = row.dataset.id;
            this.controladoraPedidos?.adicionarPedidoViaDashboardNaMesa(reservaId ?? ''); // Se o funcionário acessar a tela de pedidos pela tabela, impedir alteração do select de mesas.
          }
        }))
      })
    }

    // Concluir reserva (Fechar conta)
    const botoesDeConclusao = document.getElementsByClassName('concluir-reserva');
    if(botoesDeConclusao) {
      Array.from(botoesDeConclusao).forEach(botao => {
        botao.addEventListener('click', (event => {
          event.preventDefault();
          const target = event.target as HTMLElement;
          const row = target ? target.closest('tr') : null;
          if(row) {
            const reservaId = row.dataset.id;
            this.controladora?.resumoDaConta(reservaId ?? '');
          }
        }))
      })
    }

  }

  desenharReservas(reservas: Reserva[]): void {
    const tbody = document.querySelector('tbody');
    if(tbody){
      tbody.innerHTML = '';

      const fragmento = document.createDocumentFragment();
      for (const r of reservas) {
        const linha = this.criarLinha(r);
        fragmento.append(linha);
      }
      tbody.append(fragmento);

      // Adiciona eventos aos botões de ação das reservas
      this.definirEventos();

      // Reseta contador de reservas
      VisaoDashboard.CONTADOR = 0;
      
    }
  }

  resetaTabela() {
    const tbody = document.querySelector('tbody') as HTMLTableSectionElement;
    tbody.innerHTML = '';
    const fragmento = document.createDocumentFragment();
    const tr = document.createElement('tr');

    const celulaActions = document.createElement('div');
    celulaActions.innerHTML = `
      <div class="action justify-content-end">
        <button class="more-btn ml-10 dropdown-toggle" id="moreAction1" data-bs-toggle="dropdown" aria-expanded="false">
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
            <a href="#0" class="text-gray adicionar-pedido">Pedidos</a>
          </li>
          <li class="dropdown-item">
            <a class="text-gray concluir-reserva" type="button" data-bs-toggle="offcanvas" href="#staticBackdrop">Concluir</a>
          </li>
          <span class="divider"></span>
          <li class="dropdown-item">
            <a href="#0" class="text-gray cancelar-reserva">Cancelar</a>
          </li>
        </ul>
      </div>
    `;

    tr.append(
      this.criarCelula('-'),
      this.criarCelula('YYYY-MM-DD hh:mm'),
      this.criarCelula('-'),
      this.criarCelula('-'),
      this.criarCelulaDeStatus('Concluída'),
      this.criarCelula('-'),
      celulaActions
    );

    fragmento.append(tr);
    tbody.append(fragmento);
  }

  
  criarLinha(r: Reserva): HTMLTableRowElement {
    const tr = document.createElement('tr');

    const celulaContagem = this.criarCelula(VisaoDashboard.CONTADOR += 1);
    const celulaDataHora = this.criarCelula(r.dia + ' ' + r.hora);
    const celulaMesa = this.criarCelula(r.mesa?.numero);
    const celulaCliente = this.criarCelula(r.nome_cliente);
    let celulaStatus;
    if (r.reserva_cancelada == 1) {
      celulaStatus = this.criarCelulaDeStatus('Cancelada');
    } else {
      celulaStatus = this.criarCelulaDeStatus(r.reserva_concluida ? 'Concluída' : 'Ativa');
    }
    const celulaFeitaPor = this.criarCelula(r.funcionario?.nome);

    // Cria as ações comuns a toda reserva
    const celulaActions = document.createElement('div');
    celulaActions.innerHTML = `
      <div class="action justify-content-end">
        <button class="more-btn ml-10 dropdown-toggle" id="moreAction1" data-bs-toggle="dropdown" aria-expanded="false">
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
            <a href="#0" class="text-gray adicionar-pedido">Pedidos</a>
          </li>
          <li class="dropdown-item">
            <a class="text-gray concluir-reserva" type="button" data-bs-toggle="offcanvas" href="#staticBackdrop">Concluir</a>
          </li>
          <span class="divider"></span>
          <li class="dropdown-item">
            <a href="#0" class="text-gray cancelar-reserva">Cancelar</a>
          </li>
        </ul>
      </div>
    `;


    tr.append(
      celulaContagem,
      celulaDataHora,
      celulaMesa,
      celulaCliente,
      celulaStatus,
      celulaFeitaPor,
      celulaActions
    );

    tr.setAttribute('data-id', r.id.toString()); // Adiciona o id da reserva à linha

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
   * @param {any} status
   * @returns {HTMLTableCellElement}
   */
  criarCelulaDeStatus(status: "Ativa" | "Concluída" | "Cancelada"): HTMLTableCellElement {
    const td = document.createElement('td');
    const span = document.createElement('span');

    switch(status) {
      case "Ativa":
        span.classList.add('status-btn', 'warning-btn');
        break;
      case "Cancelada":
        span.classList.add('status-btn', 'close-btn');
        break;
      default: // Concluída
        span.classList.add('status-btn', 'success-btn');
        break;
    }

    span.innerText = status;
    td.append(span);

    return td;
  }








   /**********************
   *                    *
   *      OFFCANVAS     *
   *                    *
   *********************/
  desenharPedidosNoOverlay(itens: Item[],idMesa: number,idReserva: number) {

    let totalSemDesconto = 0;
    let totalDesconto = 0;

    // Preencher campos do overlay
    const textArea = document.querySelector(sel.resumo) as HTMLTextAreaElement;
    itens.forEach(item => {
      textArea.value += `${item.descricao} (${item.categoria}) - R$ ${item.preco} x${item.quantidade} un\n`;
      totalSemDesconto += (item.preco * item.quantidade);
    });

    const totalEl = document.querySelector(sel.total) as HTMLParagraphElement;
    totalEl.innerText = `R$ ${totalSemDesconto},00`;

    const totalEl2 = document.querySelector(sel.totalFinal) as HTMLParagraphElement;
    totalEl2.innerText = `R$ ${totalSemDesconto},00`;

    // Funcionalidade de desconto
    const botaoDeDesconto = document.getElementById('desconto') as HTMLInputElement;
    botaoDeDesconto.addEventListener('click', () => {
      if(botaoDeDesconto.checked == true){
        totalDesconto = totalSemDesconto - (totalSemDesconto * 0.1);
        totalEl2.innerText = `R$ ${totalSemDesconto},00 - 10% = R$ ${totalDesconto},00 `;
      }
      else {
        totalEl2.innerText = `R$ ${totalSemDesconto},00`;
      }
    });

    // Fechar a conta (com e sem desconto)
    const botao = document.getElementById('fechar-conta') as HTMLButtonElement;
    botao.addEventListener('click',(e) => {
      e.preventDefault();
      if(botaoDeDesconto.checked == true){
        this.controladora?.fecharConta(`${idMesa}`,totalDesconto,idReserva);
      }
      else{
        this.controladora?.fecharConta(`${idMesa}`,totalSemDesconto,idReserva);
      }
      
    });
  }

  valorModoPagamento(): string{
    const el = <HTMLInputElement> document.querySelector(sel.pagamento);
    return el.value;
  }

  limparOffCanvas(){
    const textArea = document.querySelector(sel.resumo) as HTMLTextAreaElement;
    textArea.value = '';
    const total = document.querySelector(sel.total) as HTMLParagraphElement;
    total.innerText = '';
    const totalFinal = document.querySelector(sel.totalFinal) as HTMLParagraphElement;
    totalFinal.innerText = '';
  }

  fecharOffCanvas(){
    const btn = document.querySelector(sel.fecharOffCanvas) as HTMLButtonElement;
    btn.click();
  }
}