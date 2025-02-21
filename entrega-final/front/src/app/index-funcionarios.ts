import { VisaoCadastrarFuncionarios } from "./funcionario/visao/visao-cadastrar-funcionario";
import { isGerente } from "./infra/auth";

const res = await isGerente();

if(res == false){
  window.location.href = "http://localhost:5173/src/pages/dashboard.html";
}

console.log('oi funcionarios');
const visao = new VisaoCadastrarFuncionarios();
visao.iniciar();