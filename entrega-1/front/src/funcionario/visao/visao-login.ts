import { Notificacao, TIPOS } from "../../util/notificacao";
import { ControladoraFuncionario } from "../controladora/controladora-funcionario";

export class VisaoLogin{

    private controladora: ControladoraFuncionario | undefined;

    iniciar(){

        this.controladora = new ControladoraFuncionario(this);

        const botao = document.getElementById('logar') as HTMLButtonElement;
        botao.addEventListener('click', (e) => {
            e.preventDefault();
            if(!this.camposEstaoVazios())
                this.controladora?.acaoDeLogin();
            else
                this.exibirNotificacao(["Preencha os campos."],'warning');
        });
    }



    pegarUsuario(): string{
        return (document.getElementById('usuario') as HTMLInputElement).value;
    }
    pegarSenha(): string{
        return (document.getElementById('senha') as HTMLInputElement).value;
    }
    exibirNotificacao(mensagens: Array<string>, tipo: TIPOS): void{
        Notificacao.exibirNotificacao(mensagens, tipo);
    }
    camposEstaoVazios(){
        return ( (document.getElementById('senha') as HTMLInputElement).value == '' || (document.getElementById('usuario') as HTMLInputElement).value == '' );
    }

}