export class ValidadorEstoque{

    constructor() {}

    codigoProdutoValido(codigo: string): boolean{
        return (isNaN(Number(codigo)) == false && codigo.length == 6);
    }

    eanDePesquisaValido(ean13: string): boolean {
        return /^[0-9]{13}$/.test(ean13);
    }

    valorPossuiConteudo(val: string): boolean {
        return val == '' ? false : true;
    }

    preencherCodigoInterno(input: string): string{
        if(input.length == 6)
            return input;
        else if(input.length < 6){
            let val = '0';
            do{
                input = val+input;
            }
            while(input.length < 6);
        }
        return input;
    }


    codigoInternoPossui6Caracteres(cod: string): boolean{
        return cod.length == 6 ? true : false;
    }

}