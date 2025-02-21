import { API } from "../../infra/API";
import { Pedido } from "../modelo/pedido";

export class RepositorioPedido{

    async adicionar(pedido: Pedido) {
      const response = await fetch(`${API}/pedidos`, { method: 'post', body: JSON.stringify(pedido), headers: {'Content-Type': 'application/json'}, credentials:'include'  } );
      const text = await response.text();
      if(response.status >= 400){
          throw new Error(text);
      }
      return JSON.parse(text);
    }

}