import { API } from "./API";

export async function usuarioAutenticado()
{
    const response = await fetch(`${API}/funcionario/autenticado`, { method: 'get', credentials:'include' } );
    const text = await response.text();
    console.log("resposta autenticacao",text);
    if(response.status >= 400){
        return false;
    }
    return true;
}

export async function usuarioPermitido()
{
    const response = await fetch(`${API}/funcionario/permitido`, { method: 'get', credentials:'include' } );
    const text = await response.text();
    console.log("resposta permissao",text);
    if(response.status >= 400){
        return false;
    }
    return true;
}