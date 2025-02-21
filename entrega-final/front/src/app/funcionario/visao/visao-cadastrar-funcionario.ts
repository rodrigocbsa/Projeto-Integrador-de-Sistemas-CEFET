import { Notificacao, TIPOS_NOTIFICACAO } from "../../util/notificacao";
import { ControladoraCadastrarFuncionarios } from "../controladora/controladora-cadastrar-funcionario";

export class VisaoCadastrarFuncionarios {

    iniciar(){
        const controladora = new ControladoraCadastrarFuncionarios(this);

        const botao = document.getElementById('cadastrar-funcionario') as HTMLButtonElement;
        botao.addEventListener('click', (e) => {
            e.preventDefault();
            if(this.camposEstaoVazios() == false){
                controladora.cadastrarFuncionario();
            } else{
                this.exibirNotificacao(["Os campos precisam estar preenchidos."],TIPOS_NOTIFICACAO.AVISO);
            }
        })
    }


    camposEstaoVazios() {
        const selectAcesso  = document.getElementById('acesso') as HTMLSelectElement;
        const inputNome     = document.getElementById('nome') as HTMLInputElement;
        const inputUsuario  = document.getElementById('usuario') as HTMLInputElement;
        const inputSenha    = document.getElementById('senha') as HTMLInputElement;

        return  (
            inputSenha.value   == '' ||
            inputUsuario.value == '' ||
            inputNome.value    == '' ||
            selectAcesso.value == ''
        ) ? true : false;
    }


    valorAcesso() {
        const el = <HTMLSelectElement> document.getElementById('acesso');
        return el.value ? el.value : '';
    }
    valorNome() {
        const el = <HTMLInputElement> document.getElementById('nome');
        return el.value ? el.value : '';
    }
    valorSenha() {
        const el = <HTMLInputElement> document.getElementById('senha');
        return el.value ? el.value : '';
    }
    valorUsuario() {
        const el = <HTMLInputElement> document.getElementById('usuario');
        return el.value ? el.value : '';
    }
    



    exibirNotificacao(mensagens: Array<string>, tipo: TIPOS_NOTIFICACAO): void{
        Notificacao.exibirNotificacao(mensagens, tipo);
    }
}