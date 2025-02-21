import { API } from "../../infra/API";
import { Reserva } from "../modelo/reserva";

export class RepositorioReserva {
  
  async concluir(idReserva: number) {
    const response = await fetch(`${API}/reserva/concluir/${idReserva}`, { method: 'put',credentials:'include' });
    const text = await response.text();
    if(response.status >= 400){
        throw new Error(text);
    }
    return JSON.parse(text);
  }
    
  async cadastrarReserva(reserva: Reserva) {
    const response = await fetch(`${API}/reservas`, { method: 'post', body: JSON.stringify(reserva), headers: {'Content-Type': 'application/json'},credentials:'include'  } );
    const text = await response.text();
    if(response.status >= 400){
        throw new Error(text);
    }
    return JSON.parse(text);
  }
  
   
  async consultarReservasPorPeriodo(_dataInicioInput: string, _dataFinalInput: string): Promise<{ dia: string; quantidade: number }[]> {
    const response = await fetch(`${API}/reservas?data_inicio=${_dataInicioInput}&data_fim=${_dataFinalInput}`, { method: 'get',credentials:'include' } );
    const text = await response.text();
    if(response.status >= 400){
        throw new Error(text);
    }
    return JSON.parse(text);
  }

  async consultarReservas(): Promise<Reserva[]> {
    const response = await fetch(`${API}/reservas`, { method: 'get', credentials:'include' } );
    const text = await response.text();
    if(response.status >= 400){
        throw new Error(text);
    }
    return JSON.parse(text);
  }

  async consultarReservaPorId(id: number): Promise<Reserva> {
    const response = await fetch(`${API}/reserva/${id}`, { method: 'get',credentials:'include' } );
    const text = await response.text();
    if(response.status >= 400){
        throw new Error(text);
    }
    return JSON.parse(text);
  }

  async cancelarReserva(id: number) {
    const response = await fetch(`${API}/reserva/${id}`, { method: 'put',credentials:'include' });
    const text = await response.text();
    if(response.status >= 400){
        throw new Error(text);
    }
    return JSON.parse(text);
  }

}