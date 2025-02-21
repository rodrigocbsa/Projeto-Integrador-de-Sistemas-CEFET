import { RepositorioFuncionario } from "../repositorio/repositorio-funcionario";
import { Login } from "../modelo/login";
import { VisaoLogin } from "../visao/visao-login";

export class ControladoraFuncionario{

    private visao   : VisaoLogin;
    private repo    : RepositorioFuncionario;

    constructor(visao: VisaoLogin){
        this.visao = visao;
        this.repo = new RepositorioFuncionario();
    }

    async acaoDeLogin(){
        const usuario = this.visao.pegarUsuario();
        const senha = this.visao.pegarSenha();
        
        const login = new Login(0,usuario,senha);
        const resposta = await this.repo.login(login);
        if(resposta.success){
            sessionStorage.setItem('nome',resposta.nome);
            sessionStorage.setItem('usuario',resposta.usuario);
            sessionStorage.setItem('id',resposta.funcionario);
            window.location.href = 'http://localhost:5173/front/pages/dashboard.html';
        }
        else{
            this.visao.exibirNotificacao([resposta.message],'error');
        }
    }
}