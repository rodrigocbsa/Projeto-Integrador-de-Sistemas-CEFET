import { isLogado } from "./infra/auth";
import { VisaoPedidos } from "./pedido/visao/visao-pedidos";


const res = await isLogado();

if(res == false){
  window.location.href = "http://localhost:5173/src/pages/dashboard.html";
}

console.log('oi pedidos');
const visao = new VisaoPedidos();
visao.iniciar();