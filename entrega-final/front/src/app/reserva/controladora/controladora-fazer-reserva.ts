import { Funcionario } from "../../funcionario/modelo/funcionario";
import { Mesa } from "../../mesa/modelo/mesa";
import { Reserva } from "../modelo/reserva";
import { VisaoFazerReserva } from "../visao/visao-fazer-reserva";
import { RepositorioReserva } from "../repositorio/repositorio-reserva";
import { GestorDatas } from "../../util/gestor-datas";
import { RepositorioMesa } from "../../mesa/repositorio/repositorio-mesa";
import { TIPOS_NOTIFICACAO } from "../../util/notificacao";

export class ControladoraFazerReserva {

  private visao       : VisaoFazerReserva;
  private repoReserva : RepositorioReserva;
  private repoMesa    : RepositorioMesa;
  private gestorData  : GestorDatas;

  constructor(visao: VisaoFazerReserva) {
    this.visao        = visao;
    this.repoReserva  = new RepositorioReserva();
    this.repoMesa     = new RepositorioMesa();
    this.gestorData   = new GestorDatas();
  }

  async fazerReserva() {

    const nome_cliente    = this.visao.valorNomeCliente();
    const telefone        = this.visao.valorTelefoneCliente();
    const data            = this.visao.valorData();
    const hora            = this.visao.valorHorario();
    const funcionario_id  = Number(this.visao.valorIdFuncionario());
    const mesa_id         = Number(this.visao.valorIdMesa());
    const funcionario     = new Funcionario(funcionario_id);
    const mesa            = new Mesa(mesa_id);

    const reserva = new Reserva(0,nome_cliente,telefone,data,hora,0,0,mesa,funcionario); // passa seco que o backend valida mesa e funcionario

    const problemas = reserva.validar(); // coisas básicas. Backend confirma. Data e Hora já são válidos (ver pesquisarMesasDisponiveis)

    if(problemas.length != 0){
      this.visao.exibirNotificacao(problemas,TIPOS_NOTIFICACAO.ERRO);
    }

    else{
      try {

        const response = await this.repoReserva.cadastrarReserva(reserva);
        if ( !response.success ) {
          this.visao.exibirNotificacao([response.message],TIPOS_NOTIFICACAO.ERRO);
        } else {
          this.visao.exibirNotificacao([response.message],TIPOS_NOTIFICACAO.SUCESSO);
          this.visao.limparCampos();
        }

      } catch(error: any){
        this.visao.exibirNotificacao([error.message],TIPOS_NOTIFICACAO.ERRO);
      }
    }
  }

  async pesquisarMesasDisponiveis() {

    const data = this.visao.valorData();
    const horario = this.visao.valorHorario();

    try{
      const mesas = await this.repoMesa.consultarMesas(data,horario);
      console.log(mesas);
      if(mesas.length == 0){
        this.visao.exibirNotificacao(["Informe: não há mesas disponíveis neste horário."],TIPOS_NOTIFICACAO.INFO);
        return;
      }
      this.visao.desenhaMesas(mesas);
    } catch(error: any){
      this.visao.exibirNotificacao([error.message],TIPOS_NOTIFICACAO.ERRO);
    }
  }


  dataValida(data: string): boolean{
    const problemas = this.gestorData.validarData(data);
    if(problemas.length > 0)
      this.visao.exibirNotificacao(problemas,TIPOS_NOTIFICACAO.AVISO);
    return problemas.length > 0 ? false : true;
  }

  horaValida(hora: string, data: string): boolean {
    const problemas = this.gestorData.validarHora(hora, data);
    if(problemas.length > 0)
      this.visao.exibirNotificacao(problemas,TIPOS_NOTIFICACAO.AVISO);
    return problemas.length > 0 ? false : true;
  }
}
