import { VisaoEstoqueSaida } from "./estoque/visao/visao-estoque-saida";
import { isGerenteouEstoquista } from "./infra/auth";


const res = await isGerenteouEstoquista();

if(res == false){
  window.location.href = "http://localhost:5173/src/pages/dashboard.html";
}

console.log('oi estoque saida');
const visao = new VisaoEstoqueSaida();
visao.iniciar();