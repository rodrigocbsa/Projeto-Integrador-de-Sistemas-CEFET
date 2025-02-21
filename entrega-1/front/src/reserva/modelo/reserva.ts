import { Funcionario } from "../../funcionario/modelo/funcionario";
import { Mesa } from "../../mesa/modelo/mesa";

export class Reserva {
  id: number;
  nome_cliente: string;
  telefone: string;
  dia: string;
  hora: string;
  reserva_concluida: number;
  reserva_cancelada: number;
  mesa: Mesa;
  funcionario: Funcionario;

  constructor(
    id = 0,
    nome_cliente = "",
    telefone = "",
    dia = "",
    hora = "",
    reserva_concluida = 0,
    reserva_cancelada = 0,
    mesa: Mesa,
    funcionario: Funcionario
  ) {
    this.id = id;
    this.nome_cliente = nome_cliente;
    this.telefone = telefone;
    this.dia = dia;
    this.hora = hora;
    this.reserva_concluida = reserva_concluida;
    this.reserva_cancelada = reserva_cancelada;
    this.mesa = mesa;
    this.funcionario = funcionario;
  }


  validar(): Array<string> {
    const problemas: string[] = [];

    this.validaNomeCliente(problemas);
    this.validaTelefoneCliente(problemas);
    this.validaFuncionario(problemas);
    this.validaMesa(problemas);

    return problemas;
  }


  // Funções auxiliares
  validaMesa(problemas: string[]) {
    if(Number.isNaN(this.mesa?.id.valueOf())){
      problemas.push("Mesa inválida.");
    }
  }

  validaFuncionario(problemas: string[]) {
    if(Number.isNaN(this.funcionario?.id.valueOf())){
      problemas.push("Funcionário inválido.");
    }
  }

  validaTelefoneCliente(problemas: string[]) {
    if(this.telefone == ''){
      problemas.push("Telefone não pode estar vazio.");
    }
    else if(Number.isNaN(Number(this.telefone))){
      problemas.push("Telefone inválido.");
    }
    else if(this.telefone.length < 9 || this.telefone.length > 15){
      problemas.push("O telefone deve ter entre 9 e 15 dígitos.");
    }
  }

  validaNomeCliente(problemas: string[]) {
    if(this.nome_cliente == ''){
      problemas.push("Nome do cliente não pode estar vazio");
    }
    else if(this.nome_cliente.length < 2 || this.nome_cliente.length > 50){
      problemas.push("Nome deve ter entre 2 e 50 caracteres.");
    }
  }
}
