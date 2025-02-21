import { ControladoraFazerReserva } from "../controladora/controladora-fazer-reserva";
import { Mesa } from '../../mesa/modelo/mesa';
import { Notificacao, TIPOS } from "../../util/notificacao";

export class VisaoFazerReserva {

  private controladora: ControladoraFazerReserva | null = null;

  /* Método para iniciar as funcionalidades da view de reservar mesa. */
  iniciar() {
    this.controladora = new ControladoraFazerReserva(this);

    const inputData       = document.getElementById('data-reserva')       as HTMLInputElement;
    const inputHora       = document.getElementById('hora-reserva')       as HTMLInputElement;
    const selectMesas     = document.getElementById('mesas')              as HTMLSelectElement;
    const botaoLimpar     = document.getElementById('corrigir-selecao')   as HTMLButtonElement;
    const botaoCadastrar  = document.getElementById('confirmar-reserva')  as HTMLButtonElement;
    const inputNome       = document.getElementById('nome-cliente')       as HTMLInputElement;
    const inputTelefone   = document.getElementById('telefone-cliente')   as HTMLInputElement;

    // Ao mudar o campo de data validar a data
    inputData.onchange = () => {
      if(inputData.value){
        const dataValida = this.controladora?.dataValida(inputData.value);
        if(dataValida)
          inputHora.focus();
        else inputData.value = '';
      }
    }
    
    // Ao sair do campo de hora e o campo de data e de hora estiverem preenchidos, validar a hora e pesquisar as mesas disponíveis.
    inputHora.onblur = () => {
      if(inputData.value && inputHora.value) {
        const horaValida = this.controladora?.horaValida(inputHora.value,inputData.value);
        if(horaValida){
          this.controladora?.pesquisarMesasDisponiveis();
          selectMesas.focus();
        } else inputHora.value = '';
      } else {
        this.exibirNotificacao(["Favor preencher a data e a hora para pesquisar as mesas."],'warning');
      }
    };

    // Previnir alteração de data e hora após a seleção da mesa.
    selectMesas.onchange = () => {
      inputHora.readOnly = true;
      inputData.readOnly = true;
    };

    // Ao clicar em "Confirmar Reserva", chamar a função da controladora.
    botaoCadastrar.onclick = (event: Event) => {
      event.preventDefault();
      if(this.camposEstaoVazios() == false)
        this.controladora?.fazerReserva();
      else
        this.exibirNotificacao(["É necessário preencher todos os campos."],'warning');
    };

    // Ao clicar em "Corrigir Seleção", reativar os campos de data e hora e limpar seleções anteriores.
    botaoLimpar.onclick = (event: Event) => {
      event.preventDefault();
      this.corrigirSelecao();
    }

    // Impedir caracteres não numéricos no campo de telefone.
    inputTelefone.addEventListener('input', (event) => {
      const input = event.target as HTMLInputElement;
      input.value = input.value.replace(/[^0-9]/g, '');
    });

    // Impedir caracteres numéricos no campo de nome.
    inputNome.addEventListener('input', (event) => {
      const input = event.target as HTMLInputElement;
      input.value = input.value.replace(/[^a-z ]/gi, '');
    })

    // Ao pressionar Enter no campo de telefone, clicar no botão de cadastro.
    inputTelefone.onkeyup = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        botaoCadastrar.click();
      }
    }

    // Impedir seleção de datas anteriores à data atual.
    const hoje = new Date();
    if(hoje.getMonth() == 0)
      inputData.min = `${hoje.getFullYear()}-0${hoje.getMonth()+1}-${hoje.getDate()}`;
    else
      inputData.min = `${hoje.getFullYear()}-${hoje.getMonth()+1}-${hoje.getDate()}`;

  }

  camposEstaoVazios() {
    return (
      this.valorNomeCliente() == '' ||
      this.valorTelefoneCliente() == '' ||
      this.valorData() == '' ||
      this.valorHorario() == '' ||
      this.valorIdMesa() == ''
    ) ? true : false;
  }

  valorIdFuncionario() {
    return sessionStorage.getItem('id');
  }

  desenhaMesas(mesas: Mesa[]) {
    this.limparSelectMesas();
    const select = <HTMLSelectElement> document.getElementById('mesas');
    for (const m of mesas) {
      const option = document.createElement('option');
      option.value = m.id.toString();
      option.textContent = m.numero.toString();
      select.appendChild(option);
    }
  }

  valorNomeCliente() {
    const el = <HTMLInputElement> document.getElementById('nome-cliente');
    return el.value ? el.value : '';
  }
  valorTelefoneCliente() {
    const el = <HTMLInputElement> document.getElementById('telefone-cliente');
    return el.value ? el.value : '';
  }

  valorData() {
    const el = <HTMLInputElement> document.getElementById('data-reserva');
    return el.value ? el.value : '';
  }

  valorHorario() {
    const el = <HTMLInputElement> document.getElementById('hora-reserva');
    return el.value ? el.value : '';
  }

  valorIdMesa(){
    const el = <HTMLSelectElement> document.getElementById('mesas');
    return el.value ? el.value : '';
  }

  exibirNotificacao(mensagens: Array<string>, tipo: TIPOS): void{
    Notificacao.exibirNotificacao(mensagens, tipo);
  }

  

  /* FUNÇÕES AUXILIARES DE LIMPEZA DE TELA */
  limparSelectMesas(){
    const select = <HTMLSelectElement> document.getElementById('mesas');
    select.innerHTML = '';
    select.appendChild(new Option('Selecione uma mesa', '0', true, true));
    select.selectedIndex = 0;
  }

  corrigirSelecao(){
    const inputHora = document.getElementById('hora-reserva') as HTMLInputElement;
    const inputData = document.getElementById('data-reserva') as HTMLInputElement;

    inputData.readOnly = false;
    inputHora.readOnly = false;
    inputData.value = '';
    inputHora.value = '';
    inputData.focus();
  }

  limparCampos() {
    const inputTelefone = document.getElementById('telefone-cliente') as HTMLInputElement;
    const inputNome = document.getElementById('nome-cliente') as HTMLInputElement;

    inputTelefone.value = '';
    inputNome.value = '';
    this.corrigirSelecao();
    this.limparSelectMesas();
  }
}
