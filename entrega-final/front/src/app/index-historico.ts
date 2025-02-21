import { VisaoHistorico } from "./estoque/visao/visao-historico";
import { isGerenteouEstoquista } from "./infra/auth";


const res = await isGerenteouEstoquista();

if(res == false){
  window.location.href = "http://localhost:5173/src/pages/dashboard.html";
}


console.log('oi historico');
const visao = new VisaoHistorico();
visao.iniciar();