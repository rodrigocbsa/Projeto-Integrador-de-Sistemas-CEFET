import { Chart } from "chart.js/auto";
import { ControladoraRelatoriosGerente } from "../controladora/controladora-relatorios-gerente";
import { Notificacao, TIPOS_NOTIFICACAO } from "../../util/notificacao";

export class VisaoRelatoriosGerente {    
    
    controladora: ControladoraRelatoriosGerente | undefined;
    
    iniciar(): void {
        this.controladora = new ControladoraRelatoriosGerente(this);
    
        (document.getElementById('vendas-pagamento') as HTMLButtonElement).onclick = (event: Event) => {
            event.preventDefault();
            this.controladora?.gerarRelatorioVendasPagamento();
        };

        (document.getElementById('vendas-funcionario') as HTMLButtonElement).onclick = (event: Event) => {
            event.preventDefault();
            this.controladora?.gerarRelatorioVendasFuncionario();
        };

        (document.getElementById('vendas-categoria') as HTMLButtonElement).onclick = (event: Event) => {
            event.preventDefault();
            this.controladora?.gerarRelatorioVendasCategoria();
        };

        (document.getElementById('total-vendas') as HTMLButtonElement).onclick = (event: Event) => {
            event.preventDefault();
            this.controladora?.gerarRelatorioTotalVendas();
        };
    }
    
    exibirNotificacao(mensagens: Array<string>, tipo: TIPOS_NOTIFICACAO): void{
        Notificacao.exibirNotificacao(mensagens, tipo);
    }

    valorDataInicial() {
        const dataInicial = <HTMLInputElement> document.getElementById("data-inicio");
        return dataInicial ? dataInicial.value : '';
    }
    valorDataFinal() {
        const dataFinal = <HTMLInputElement> document.getElementById("data-fim");
        return dataFinal ? dataFinal.value : '';
    }


    /***************************************
     *                                     *
     *            GRÁFICOS                 *
     *                                     *
     **************************************/

    removerGrafico(id: 'grafico-vendas-pagamento' | 'grafico-vendas-funcionario' | 'grafico-vendas-categoria' | 'grafico-total-vendas'){
        const divCanva = document.getElementById(`div-${id}`) as HTMLDivElement;
        divCanva.innerHTML = '';
        const canvas = document.createElement("canvas") as HTMLCanvasElement;
        canvas.id = id;
        divCanva.appendChild(canvas);
    }

    desenharVendasPagamento(modalidades: Array<string>, totais: Array<number>) {
        const canva = <HTMLCanvasElement> document.getElementById("grafico-vendas-pagamento");
        const ctx = canva.getContext("2d");
        if(ctx){
            new Chart(ctx, {
            type: "pie",
            data: {
                labels: modalidades,
                datasets: [{
                    label: 'Total na modalidade de pagamento',
                    data: totais,
                    backgroundColor: [
                      'rgb(255, 99, 132)',
                      'rgb(54, 162, 235)',
                      'rgb(255, 205, 86)'
                    ],
                    hoverOffset: 4
                  }],
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
                maintainAspectRatio: false
            },
            });
        }
    }


    desenharVendasFuncionario(funcionarios: string[], totalFunc: number[]){
        const canva = <HTMLCanvasElement> document.getElementById("grafico-vendas-funcionario");
        const ctx = canva.getContext("2d");
        if(ctx){
            new Chart(ctx, {
            type: "pie",
            data: {
                labels: funcionarios,
                datasets: [{
                    label: 'Total vendido pelo funcionário',
                    data: totalFunc,
                    backgroundColor: [
                      'rgb(255, 99, 132)',
                      'rgb(54, 162, 235)',
                      'rgb(255, 205, 86)'
                    ],
                    hoverOffset: 4
                  }],
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
                maintainAspectRatio: false
            },
            });
        }
    }


    desenharVendasCategoria(categoria: string[], totalCateg: number[]){
        const canva = <HTMLCanvasElement> document.getElementById("grafico-vendas-categoria");
        const ctx = canva.getContext("2d");
        if(ctx){
            new Chart(ctx, {
            type: "pie",
            data: {
                labels: categoria,
                datasets: [{
                    label: 'Total vendido na categoria',
                    data: totalCateg,
                    backgroundColor: [
                      'rgb(255, 99, 132)',
                      'rgb(54, 162, 235)',
                      'rgb(255, 205, 86)'
                    ],
                    hoverOffset: 4
                  }],
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
                maintainAspectRatio: false
            },
            });
        }
    }


    desenharTotalVendas(dia: string[], totalDia: number[]){
        const canva = <HTMLCanvasElement> document.getElementById("grafico-total-vendas");
        const ctx = canva.getContext("2d");
        if(ctx){
        new Chart(ctx, {
            type: "bar",
            data: {
            labels: dia,
            datasets: [
                {
                label: "Total vendido no dia",
                backgroundColor: "#365CF5",
                borderRadius: 30,
                barThickness: 6,
                maxBarThickness: 8,
                data: totalDia,
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
                    stepSize: 10,
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


    
}