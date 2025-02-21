import { API } from "../../infra/API";
import { Login } from "../modelo/login";

export class RepositorioFuncionario {

    async cadastrar(obj: { acesso: string; nome: string; senha: string; usuario: string; }) {
        const response = await fetch(`${API}/funcionario/cadastro`, { method: 'post', body: JSON.stringify(obj), headers: {'Content-Type': 'application/json'}, credentials:'include'  } );
        const text = await response.text();
        if(response.status >= 400){
            throw new Error(text);
        }
        return JSON.parse(text);
    }

    async consultarVendasPorPagamento(dataInicial: string, dataFinal: string): Promise<{ pagamento: string; total_pag: number }[]> {
        const response = await fetch(`${API}/funcionario/gerente/relatorios/4?data_inicio=${dataInicial}&data_fim=${dataFinal}`, { method: 'get', credentials:'include' } );
        const text = await response.text();
        if(response.status >= 400){
            throw new Error(text);
        }
        return JSON.parse(text);
    }

    async consultarVendasPorFuncionario(dataInicial: string, dataFinal: string): Promise<{ nome: string; total_func: number }[]> {
        const response = await fetch(`${API}/funcionario/gerente/relatorios/1?data_inicio=${dataInicial}&data_fim=${dataFinal}`, { method: 'get', credentials:'include' } );
        const text = await response.text();
        if(response.status >= 400){
            throw new Error(text);
        }
        return JSON.parse(text);
    }

    async consultarVendasPorCategoria(dataInicial: string, dataFinal: string): Promise<{ categoria: string; total_categ: number }[]> {
        const response = await fetch(`${API}/funcionario/gerente/relatorios/2?data_inicio=${dataInicial}&data_fim=${dataFinal}`, { method: 'get', credentials:'include' } );
        const text = await response.text();
        if(response.status >= 400){
            throw new Error(text);
        }
        return JSON.parse(text);
    }

    async consultarTotalVendas(dataInicial: string, dataFinal: string): Promise<{ dia: string; total_dia: number }[]> {
        const response = await fetch(`${API}/funcionario/gerente/relatorios/3?data_inicio=${dataInicial}&data_fim=${dataFinal}`, { method: 'get', credentials:'include' } );
        const text = await response.text();
        if(response.status >= 400){
            throw new Error(text);
        }
        return JSON.parse(text);
    }

    
    async login(user: Login){
        const response = await fetch(`${API}/login`, { method: 'post', body: JSON.stringify(user), headers: {'Content-Type': 'application/json'}, credentials:'include'  } );

        const text = await response.text();
        console.log("Resposta do Backend:",text);

        if (response.status >= 400) {
            const error = JSON.parse(text);
            throw new Error(error.message || `Erro ${response.status}`);
        }

        return JSON.parse(text);
    }

}