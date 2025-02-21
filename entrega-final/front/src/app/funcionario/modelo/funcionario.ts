export class Funcionario {
    id: number;
    nome: string;
    login: number;
    
    constructor( id = 0, nome = '', login = 0){
        this.id = id;
        this.nome = nome;
        this.login = login;
    }
}
