import { VisaoControle } from "./estoque/visao/visao-controle";
import { isGerenteouEstoquista } from "./infra/auth";


const res = await isGerenteouEstoquista();

if(res == false){
  window.location.href = "http://localhost:5173/src/pages/dashboard.html";
}


console.log('oi controle');
const visao = new VisaoControle();
visao.iniciar();