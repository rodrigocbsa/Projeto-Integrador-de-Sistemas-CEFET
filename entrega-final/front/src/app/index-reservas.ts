import { isLogado } from "./infra/auth";
import { VisaoFazerReserva } from "./reserva/visao/visao-fazer-reserva";


const res = await isLogado();

if(res == false){
  window.location.href = "http://localhost:5173/src/pages/dashboard.html";
}

console.log('oi reservas');
const visao = new VisaoFazerReserva();
visao.iniciar();