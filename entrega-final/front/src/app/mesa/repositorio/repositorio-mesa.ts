import { API } from "../../infra/API";
import { Mesa } from "../modelo/mesa";

export class RepositorioMesa {
    
    async consultarMesas(_dia: string, _hora: string): Promise<Mesa[]> {
        const response = await fetch(`${API}/mesas?dia=${_dia}&hora=${_hora}`, { method: 'get', headers: {'Content-Type': 'application/json'}, credentials:'include'  } );
        const text = await response.text();
        if(response.status >= 400){
            throw new Error(text);
        }
        return JSON.parse(text);
    }
}