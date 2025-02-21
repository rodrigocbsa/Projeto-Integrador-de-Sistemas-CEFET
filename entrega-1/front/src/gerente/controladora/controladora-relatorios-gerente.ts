import { RepositorioFuncionario } from "../../funcionario/repositorio/repositorio-funcionario";
import { GestorDatas } from "../../util/gestor-datas";
import { VisaoRelatoriosGerente } from "../visao/visao-relatorios-gerente";

export class ControladoraRelatoriosGerente {
    visao           : VisaoRelatoriosGerente;
    gestorDatas     : GestorDatas;
    repoFuncionario : RepositorioFuncionario;

    constructor(visao: VisaoRelatoriosGerente) {
        this.visao              = visao;
        this.gestorDatas        = new GestorDatas();
        this.repoFuncionario    = new RepositorioFuncionario();
    }

    async gerarRelatorioVendasPagamento() {
        try {
            const dataInicial = this.visao.valorDataInicial();
            const dataFinal = this.visao.valorDataFinal();

            let problemas = this.gestorDatas.validarDatasRelatorio(dataInicial, dataFinal);
            if (problemas.length != 0) {
                this.visao.exibirNotificacao(problemas, 'error');
                return;
            }

            // Consulta aqui
            const array = await this.repoFuncionario.consultarVendasPorPagamento(dataInicial, dataFinal);

            if (array.length == 0) {
                this.visao.exibirNotificacao(["Não há dados para o período informado."], 'info');
                return;
            }


            // Separando chaves e valores para o gráfico
            const modalidades = array.map(item => item.pagamento);
            const totais = array.map(item => item.total_pag);

            this.visao.removerGrafico('grafico-vendas-pagamento');
            this.visao.desenharVendasPagamento(modalidades,totais);

        } catch(error: any){
            console.log(error);
            this.visao.exibirNotificacao([error.message], 'error');
        }
    }

    async gerarRelatorioVendasFuncionario() {
        try{
            const dataInicial = this.visao.valorDataInicial();
            const dataFinal = this.visao.valorDataFinal();

            let problemas = this.gestorDatas.validarDatasRelatorio(dataInicial, dataFinal);
            if (problemas.length != 0) {
                this.visao.exibirNotificacao(problemas, 'error');
                return;
            }


            const array = await this.repoFuncionario.consultarVendasPorFuncionario(dataInicial,dataFinal);

            if(array.length == 0){
                this.visao.exibirNotificacao(["Não há dados para a consulta no período informado."],'info');
                return;
            }

            console.log(array);
        
            // Separando chaves e valores para o gráfico
            const x = array.map(i => i.nome);
            const y = array.map(i => i.total_func);



            this.visao.removerGrafico('grafico-vendas-funcionario');
            this.visao.desenharVendasFuncionario(x,y);


        } catch(error: any){
            console.log(error);
            this.visao.exibirNotificacao([error.message], 'error');
        }
    }

    async gerarRelatorioVendasCategoria() {
        try{
            const dataInicial = this.visao.valorDataInicial();
            const dataFinal = this.visao.valorDataFinal();

            let problemas = this.gestorDatas.validarDatasRelatorio(dataInicial, dataFinal);
            if (problemas.length != 0) {
                this.visao.exibirNotificacao(problemas, 'error');
                return;
            }


            const array = await this.repoFuncionario.consultarVendasPorCategoria(dataInicial,dataFinal);

            if(array.length == 0){
                this.visao.exibirNotificacao(["Não há dados para a consulta no período informado."],'info');
                return;
            }
        
            // Separando chaves e valores para o gráfico
            const x = array.map(i => i.categoria);
            const y = array.map(i => i.total_categ);



            this.visao.removerGrafico('grafico-vendas-categoria');
            this.visao.desenharVendasCategoria(x,y);


        } catch(error: any){
            console.log(error);
            this.visao.exibirNotificacao([error.message], 'error');
        }
    }

    async gerarRelatorioTotalVendas() {
        try{
            const dataInicial = this.visao.valorDataInicial();
            const dataFinal = this.visao.valorDataFinal();

            let problemas = this.gestorDatas.validarDatasRelatorio(dataInicial, dataFinal);
            if (problemas.length != 0) {
                this.visao.exibirNotificacao(problemas, 'error');
                return;
            }


            const array = await this.repoFuncionario.consultarTotalVendas(dataInicial,dataFinal);

            if(array.length == 0){
                this.visao.exibirNotificacao(["Não há dados para a consulta no período informado."],'info');
                return;
            }
        
            // Separando chaves e valores para o gráfico
            const x = array.map(i => i.dia);
            const y = array.map(i => i.total_dia);



            this.visao.removerGrafico('grafico-total-vendas');
            this.visao.desenharTotalVendas(x,y);


        } catch(error: any){
            console.log(error);
            this.visao.exibirNotificacao([error.message], 'error');
        }
    }
}