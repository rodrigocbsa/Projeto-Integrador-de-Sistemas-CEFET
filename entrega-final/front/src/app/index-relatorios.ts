import { VisaoRelatoriosGerente } from "./gerente/visao/visao-relatorios-gerente";
import { isGerente } from "./infra/auth";

const res = await isGerente();

if(res == false){
  window.location.href = "http://localhost:5173/src/pages/dashboard.html";
}

console.log('oi relatorios');
const visao = new VisaoRelatoriosGerente();
visao.iniciar();