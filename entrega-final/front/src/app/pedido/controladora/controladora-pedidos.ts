import { Item } from "../../item/modelo/item";
import { Mesa } from "../../mesa/modelo/mesa";
import { RepositorioReserva } from "../../reserva/repositorio/repositorio-reserva";
import { GestorDatas } from "../../util/gestor-datas";
import { RepositorioItem } from "../../item/repositorio/repositorio-item";
import { VisaoPedidos } from "../visao/visao-pedidos";
import { TIPOS_NOTIFICACAO } from "../../util/notificacao";

export class ControladoraPedidos{

    private visao: VisaoPedidos;
    private repoReserva: RepositorioReserva;
    private repoItem: RepositorioItem;
    private gestorData: GestorDatas;

    constructor(visao: VisaoPedidos){
        this.visao          = visao;
        this.repoReserva    = new RepositorioReserva();
        this.repoItem       = new RepositorioItem();
        this.gestorData     = new GestorDatas();
    }

    async listarMesasDasReservasDeAgora(){
        try{

            const mesas: Mesa[] = [];

            const reservas = await this.repoReserva.consultarReservas();

            // Pegar apenas reservas em andamento (DE AGORA)
            const reservasDeAgora = reservas.filter(r => {
                if(r.reserva_concluida == 0 && r.reserva_cancelada == 0)
                    return this.gestorData.reservaEmAndamento( new Date(Number( r.dia.split('-')[0] ), Number( r.dia.split('-')[1] ) - 1, Number( r.dia.split('-')[2] ), Number( r.hora.split(':')[0] ), Number( r.hora.split(':')[1] )) );
            });

            if(reservasDeAgora.length == 0){
                this.visao.exibirNotificacao(["Não há reservas em andamento."],TIPOS_NOTIFICACAO.INFO);
                return;
            }

            reservasDeAgora.forEach(r => {
                if(r.mesa)
                    mesas.push(r.mesa);
            });

            this.visao.desenhaMesas(mesas);

        } catch(error: any){
            this.visao.exibirNotificacao([error.message],TIPOS_NOTIFICACAO.ERRO);
        }
    }


    adicionarItemAoPedidoDaMesa(idMesa: string){

        // 1- pegar os valores de um ITEM
        const descricao     = this.visao.valorDescricaoItem();
        const quantidade    = Number(this.visao.valorQuantidadeItem());
        const preco         = Number(this.visao.valorPrecoItem());
        const categoria     = this.visao.valorCategoriaItem();

        // 2- validar entradas do ITEM
        const item = new Item(0,descricao,quantidade,preco,categoria);
        const problemas = item.validarItem();

        if(problemas.length > 0){
            this.visao.exibirNotificacao(problemas,TIPOS_NOTIFICACAO.ERRO);
            return;
        }

        // 3- adicionar item ao local storage do pedido
        try{
            this.repoItem.setItem(item,idMesa);
            this.visao.exibirNotificacao(["Item adicionado com sucesso"],TIPOS_NOTIFICACAO.SUCESSO);
            // 4- adicionar o item no resumo do pedido
            this.visao.desenharPedido(item);
        } catch(error: any){
            this.visao.exibirNotificacao([error.message],TIPOS_NOTIFICACAO.ERRO);
        }
    }



    async adicionarPedidoViaDashboardNaMesa(id_reserva: string){
        try{
            const reserva = await this.repoReserva.consultarReservaPorId(Number(id_reserva));
            localStorage.setItem('dashboard_mesa_id',`${reserva.mesa.id}`);
            window.location.href = 'http://localhost:5173/front/src/pages/pedidos.html';
        } catch(error: any){
            localStorage.removeItem('dashboard_mesa_id');
            this.visao.exibirNotificacao([error.message],TIPOS_NOTIFICACAO.ERRO);
        }
    }
}