
import { GestorDatas } from "../../util/gestor-datas";
import { RepositorioReserva } from "../../reserva/repositorio/repositorio-reserva";
import { VisaoDashboard } from "../visao/visao-dashboard";
import { RepositorioPedido } from "../../pedido/repositorio/repositorio-pedido";
import { Pedido } from "../../pedido/modelo/pedido";
import { RepositorioItem } from "../../item/repositorio/repositorio-item";
import { RepositorioDashboard } from "../repositorio/repositorio-dashboard";
import { TIPOS_NOTIFICACAO } from "../../util/notificacao";

export class ControladoraDashboard {

  private visao       : VisaoDashboard;
  private gestorDatas : GestorDatas;
  private repoReserva : RepositorioReserva;
  private repoItem    : RepositorioItem;
  private repoPedido  : RepositorioPedido;
  private repo        : RepositorioDashboard;


  constructor(visao: VisaoDashboard) {
    this.visao        = visao;
    this.gestorDatas  = new GestorDatas();
    this.repoReserva  = new RepositorioReserva();
    this.repoItem     = new RepositorioItem();
    this.repoPedido   = new RepositorioPedido();
    this.repo         = new RepositorioDashboard();
  }


  async loadExtras() {
    try{
      const array = await this.repo.extras();
      const totalReservasFeitas = (array[0].reservas_feitas ?? '-').toString();
      const totalPedidosRealizados = (array[1].pedidos_realizados ?? '-').toString();
      const receitaTotal = (array[2].receita_total ?? '-').toString();
      this.visao.desenharExtras(totalReservasFeitas,totalPedidosRealizados,receitaTotal);
    } catch(error: any){
      this.visao.exibirNotificacao([error.message],TIPOS_NOTIFICACAO.ERRO);
    }
  }


  async gerarRelatorio() {
    try {
      const dataInicialInput = this.visao.valorDataInicioRelatorio();
      const dataFinalInput = this.visao.valorDataFinalRelatorio();

      let problemas = this.gestorDatas.validarDatasRelatorio(dataInicialInput,dataFinalInput);
      if(problemas.length != 0){
        this.visao.exibirNotificacao(problemas,TIPOS_NOTIFICACAO.ERRO);
        return;
      }

      const array = await this.repoReserva.consultarReservasPorPeriodo(dataInicialInput,dataFinalInput);

      if(array.length == 0){
        this.visao.exibirNotificacao(["Não há reservas para o período informado."],TIPOS_NOTIFICACAO.INFO);
        return;
      }

      // Limpa
      this.visao.removerGrafico();

      // Separando chaves e valores para o gráfico
      const dias = array.map(item => item.dia);
      const quantidades = array.map(item => item.quantidade);

      this.visao.desenharGrafico(dias, quantidades);

    } catch(error: any){
      this.visao.exibirNotificacao([error.message],TIPOS_NOTIFICACAO.ERRO);
    }
  }


  async listarReservas() {
    try {
      const reservas = await this.repoReserva.consultarReservas();
      // pegar apenas as reservas de HOJE que não tenham sido canceladas nem já concluídas
      const reservasFiltradas = reservas.filter(r => this.gestorDatas.ehHoje( new Date(Number( r.dia.split('-')[0] ), Number( r.dia.split('-')[1] ) - 1, Number( r.dia.split('-')[2] ), Number( r.hora.split(':')[0] ), Number( r.hora.split(':')[1] ))) && r.reserva_cancelada == 0 && r.reserva_concluida == 0 );
      if(reservasFiltradas.length == 0){
        this.visao.exibirNotificacao(["Não há mais reservas para hoje."],TIPOS_NOTIFICACAO.INFO);
        this.visao.resetaTabela();
        return;
      }
      this.visao.desenharReservas(reservasFiltradas);
    } catch (error: any) {
      this.visao.exibirNotificacao([error.message],TIPOS_NOTIFICACAO.ERRO);
    }
  }

  async cancelarReserva(id_reserva: string){
    try {
      const reserva = await this.repoReserva.consultarReservaPorId(Number(id_reserva));
      if(reserva.id != Number(id_reserva)){
        this.visao.exibirNotificacao(["Reserva não encontrada."],TIPOS_NOTIFICACAO.AVISO);
        return;
      }
      const response = await this.repoReserva.cancelarReserva(reserva.id);
      console.log(`Resposta no Frontend:`);
      console.log(response);
      if(!response.success){
        this.visao.exibirNotificacao([response.message],TIPOS_NOTIFICACAO.ERRO);
      } else{
        this.visao.exibirNotificacao([response.message],TIPOS_NOTIFICACAO.SUCESSO);
        this.listarReservas();
      }
    } catch(error: any){
      this.visao.exibirNotificacao([error.message],TIPOS_NOTIFICACAO.ERRO);
    }
  }


  async resumoDaConta(id_reserva: string){
    try{
      // Validar id da reserva
      const reserva = await this.repoReserva.consultarReservaPorId(Number(id_reserva));
      if(reserva.id != Number(id_reserva)){
        this.visao.exibirNotificacao(["Reserva não encontrada."],TIPOS_NOTIFICACAO.AVISO);
        return;
      }
      // Pego itens associadas à mesa da reserva (id)
      const pedidos = this.repoItem.getItens(`${reserva.mesa.id}`);
      this.visao.desenharPedidosNoOverlay(pedidos,reserva.mesa.id,reserva.id);
    } catch(error: any){
      this.visao.exibirNotificacao([error.message],TIPOS_NOTIFICACAO.ERRO);
    }
  }


  async fecharConta(idMesa: string, total: number, idReserva: number){
    // 1- pegar itens do local storage do pedido e modo de pagamento
    const itens = this.repoItem.getItens(idMesa);
    const pagamento = this.visao.valorModoPagamento();
    if(itens.length != 0){
      // 2- instanciar pedido com o total
      const pedido = new Pedido(0,Number(idMesa),total,itens,pagamento);
      // 3- enviar pedido para o backend e concluir a reserva
      try{
          const pedidoCadastrado = await this.repoPedido.adicionar(pedido);
          const reservaConcluida = await this.repoReserva.concluir(idReserva);
          if ( pedidoCadastrado.success && reservaConcluida.success ) {
            this.visao.exibirNotificacao(["Conta fechada com sucesso!"],TIPOS_NOTIFICACAO.SUCESSO);
            // 4- limpa local storage
            this.repoItem.clear(idMesa);
            // 5- fechar offcanvas e listar reservas
            this.visao.fecharOffCanvas();
            this.listarReservas();
          } else{
            this.visao.exibirNotificacao(["Erro ao fechar a conta!"],TIPOS_NOTIFICACAO.ERRO);
          }
      } catch(error: any){
        this.visao.exibirNotificacao([error.message],TIPOS_NOTIFICACAO.ERRO);
      }
    } else {
      this.visao.exibirNotificacao(["Não há pedidos nesta reserva."],TIPOS_NOTIFICACAO.AVISO); // Não haver pedidos na mesa, no meu restaurante, é o equivalente a ter que cancelar uma reserva.
    }
  }
  
}
