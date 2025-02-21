import { RepositorioFuncionario } from "../repositorio/repositorio-funcionario";
import { Login } from "../modelo/login";
import { VisaoLogin } from "../visao/visao-login";
import { TIPOS_NOTIFICACAO } from "../../util/notificacao";

export class ControladoraLogin{

    visao   : VisaoLogin;
    repo    : RepositorioFuncionario;

    constructor(visao: VisaoLogin){
        this.visao = visao;
        this.repo = new RepositorioFuncionario();
    }

    async acaoDeLogin(){
        try{
            const usuario = this.visao.pegarUsuario();
            const senha = this.visao.pegarSenha();
            
            const login = new Login(0,usuario,senha);
            const resposta = await this.repo.login(login);
            if(resposta.success){
                sessionStorage.setItem('nome',resposta.nome);
                sessionStorage.setItem('cargo',resposta.cargo);
                sessionStorage.setItem('usuario',resposta.usuario);
                sessionStorage.setItem('id',resposta.funcionario);
                window.location.href = 'http://localhost:5173/src/pages/dashboard.html';
            }
            else{
                this.visao.exibirNotificacao([resposta.message],TIPOS_NOTIFICACAO.ERRO);
            }
        } catch(error: any){
            console.log(error);
            this.visao.exibirNotificacao(['Ocorreu um erro grave.'],TIPOS_NOTIFICACAO.ERRO);
        }
        
    }
}