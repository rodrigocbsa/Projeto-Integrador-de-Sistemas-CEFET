import { VisaoEstoqueEntrada } from "./estoque/visao/visao-estoque-entrada";
import { isGerenteouEstoquista } from "./infra/auth";


const res = await isGerenteouEstoquista();

if(res == false){
  window.location.href = "http://localhost:5173/src/pages/dashboard.html";
}

console.log('oi estoque entrada');
const visao = new VisaoEstoqueEntrada();
visao.iniciar();