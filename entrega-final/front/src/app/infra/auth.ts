import { API } from "./API";

export async function isLogado()
{
    const response = await fetch(`${API}/funcionario/logado`, { method: 'get', credentials:'include' } );
    const text = await response.text();
    console.log("resposta autenticacao",text);
    if(response.status >= 400){
        return false;
    }
    return true;
}

export async function isGerente()
{
    const response = await fetch(`${API}/funcionario/gerente`, { method: 'get', credentials:'include' } );
    const text = await response.text();
    console.log("resposta permissao",text);
    if(response.status >= 400){
        return false;
    }
    return true;
}


export async function isGerenteouEstoquista()
{
    const response = await fetch(`${API}/funcionario/gerenteestoquista`, { method: 'get', credentials:'include' } );
    const text = await response.text();
    console.log("resposta permissao",text);
    if(response.status >= 400){
        return false;
    }
    return true;
}