import { VisaoDashboard } from "./dashboard/visao/visao-dashboard";
import { VisaoCadastrarFuncionarios } from "./funcionario/visao/visao-cadastrar-funcionario";
import { VisaoLogin } from "./funcionario/visao/visao-login";
import { VisaoRelatoriosGerente } from "./gerente/visao/visao-relatorios-gerente";
import { usuarioAutenticado, usuarioPermitido } from "./infra/auth";
import { VisaoPedidos } from "./pedido/visao/visao-pedidos";
import { VisaoFazerReserva } from "./reserva/visao/visao-fazer-reserva";

// autenticado = usuário logado?
// permitido = usuário administrador?

document.addEventListener("DOMContentLoaded", async () => {
  const local = window.location.pathname;

  if ( local.endsWith("/index.html") ) {

    /*
    let autenticado = await usuarioAutenticado();

    if(autenticado){
      window.location.href = "http://localhost:5173/front/pages/dashboard.html";
    }
    */

    console.log('oi login');
    let visao = new VisaoLogin();
    visao.iniciar();

  } else if ( local.endsWith("/front/pages/reservas.html") ) {

    let autenticado = await usuarioAutenticado();

    if(autenticado == false){
      window.location.href = "http://localhost:5173/index.html";
    }

    console.log('oi reservas');
    let visao = new VisaoFazerReserva();
    visao.iniciar();

  } else if ( local.endsWith("/front/pages/dashboard.html") ) {

    let autenticado = await usuarioAutenticado();

    if(autenticado == false){
      window.location.href = "http://localhost:5173/index.html";
    }

    console.log('oi dashboard');
    let visao = new VisaoDashboard();
    visao.iniciar();

  } else if ( local.endsWith("/front/pages/relatorios.html") ) {

    let permitido = await usuarioPermitido();

    if(permitido == false){
      window.location.href = "http://localhost:5173/front/pages/dashboard.html";
    }

    console.log('oi relatorios');
    let visao = new VisaoRelatoriosGerente();
    visao.iniciar();

  } else if ( local.endsWith("/front/pages/pedidos.html") ) {

    let autenticado = await usuarioAutenticado();

    if(autenticado == false){
      window.location.href = "http://localhost:5173/index.html";
    }

    console.log('oi pedidos');
    let visao = new VisaoPedidos();
    visao.iniciar();

  } else if( local.endsWith("/front/pages/funcionarios.html" )) {

    let permitido = await usuarioPermitido();

    if(permitido == false){
      window.location.href = "http://localhost:5173/front/pages/dashboard.html";
    }

    console.log('oi funcionarios');
    let visao = new VisaoCadastrarFuncionarios();
    visao.iniciar();

  } else {

    window.location.href = "http://localhost:5173/front/pages/404.html";

  }
  
});
