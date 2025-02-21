import { API } from "../../infra/API";

export class RepositorioDashboard{
    
    async extras(): Promise<{ reservas_feitas: number; pedidos_realizados: number; receita_total: number }[]> {
        const response = await fetch(`${API}/dashboard/extras`, { method: 'get', credentials:'include' } );
        const text = await response.text();
        if(response.status >= 400){
            throw new Error(text);
        }
        return JSON.parse(text);
    }

}