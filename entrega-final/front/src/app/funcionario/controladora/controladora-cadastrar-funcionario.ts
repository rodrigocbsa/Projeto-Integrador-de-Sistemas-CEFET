import { TIPOS_NOTIFICACAO } from "../../util/notificacao";
import { RepositorioFuncionario } from "../repositorio/repositorio-funcionario";
import { VisaoCadastrarFuncionarios } from "../visao/visao-cadastrar-funcionario";

export class ControladoraCadastrarFuncionarios{
    private visao   : VisaoCadastrarFuncionarios;
    private repo    : RepositorioFuncionario;

    constructor(visao: VisaoCadastrarFuncionarios){
        this.visao = visao;
        this.repo = new RepositorioFuncionario();
    }


    async cadastrarFuncionario(){
        const obj = {
            acesso : this.visao.valorAcesso(),
            nome : this.visao.valorNome(),
            senha : this.visao.valorSenha(),
            usuario : this.visao.valorUsuario()
        };

        try{
            const response = await this.repo.cadastrar(obj);
            if(response.success){
                this.visao.exibirNotificacao([response.message],TIPOS_NOTIFICACAO.SUCESSO);
            } else {
                this.visao.exibirNotificacao([response.message],TIPOS_NOTIFICACAO.ERRO);
            }
        } catch(error: any){
            this.visao.exibirNotificacao([error.message],TIPOS_NOTIFICACAO.ERRO);
        }
        

    }
}