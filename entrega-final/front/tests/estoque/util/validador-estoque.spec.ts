import { describe, expect, it } from 'vitest';
import { ValidadorEstoque } from '../../../src/app/estoque/util/validador-estoque';

describe('ValidadorEstoque', () => {

    describe('validarCodigoProduto', () => {

        it('DADO QUE a funcao validarCodigoProduto tenha sido chamada QUANDO o codigo interno contiver letras ENTAO devera retornar false', () => {
            const gestor = new ValidadorEstoque();
            const response = gestor.codigoProdutoValido('12345a');
            expect(response).toBe(false);
        });

        it('DADO QUE a funcao validarCodigoProduto tenha sido chamada QUANDO o codigo interno tiver mais de 6 numeros ENTAO devera retornar false', () => {
            const gestor = new ValidadorEstoque();
            const response = gestor.codigoProdutoValido('1234567');
            expect(response).toBe(false);
        });

        it('DADO QUE a funcao validarCodigoProduto tenha sido chamada QUANDO o codigo interno for valido ENTAO devera retornar true', () => {
            const gestor = new ValidadorEstoque();
            const response = gestor.codigoProdutoValido('123456');
            expect(response).toBe(true);
        });
    
    });
    
    
    describe('valorPossuiConteudo', () => {

        it('DADO QUE a funcao valorPossuiConteudo tenha sido chamada QUANDO nao for texto vazio ENTAO devera retornar true', () => {
            const gestor = new ValidadorEstoque();
            const response = gestor.valorPossuiConteudo('aaa');
            expect(response).toBe(true);
        });

        it('DADO QUE a funcao valorPossuiConteudo tenha sido chamada QUANDO for texto vazio ENTAO devera retornar false', () => {
            const gestor = new ValidadorEstoque();
            const response = gestor.valorPossuiConteudo('');
            expect(response).toBe(false);
        });

    });


    describe('codigoInternoPossui6Caracteres', () => {

        it('DADO QUE a funcao codigoInternoPossui6Caracteres tenha sido chamada QUANDO o texto tiver mais de 6 caracteres ENTAO devera retornar false', () => {
            const gestor = new ValidadorEstoque();
            const response = gestor.codigoInternoPossui6Caracteres('1234567');
            expect(response).toBe(false);
        });

        it('DADO QUE a funcao codigoInternoPossui6Caracteres tenha sido chamada QUANDO o texto tiver menos de 6 caracteres ENTAO devera retornar false', () => {
            const gestor = new ValidadorEstoque();
            const response = gestor.codigoInternoPossui6Caracteres('12345');
            expect(response).toBe(false);
        });

        it('DADO QUE a funcao codigoInternoPossui6Caracteres tenha sido chamada QUANDO o texto tiver 6 caracteres ENTAO devera retornar true', () => {
            const gestor = new ValidadorEstoque();
            const response = gestor.codigoInternoPossui6Caracteres('123456');
            expect(response).toBe(true);
        });

    });

    describe('preencherCodigoInterno', () => {

        it('DADO QUE a funcao preencherCodigoInterno tenha sido chamada QUANDO o texto tiver menos de 6 caracteres ENTAO devera retornar um texto com 6 caracteres preenchido com 0 a esquerda', () => {
            const gestor = new ValidadorEstoque();
            const response = gestor.preencherCodigoInterno('12345');
            expect(response).toBe('012345');
        });

        it('DADO QUE a funcao preencherCodigoInterno tenha sido chamada QUANDO o texto tiver 6 caracteres ENTAO devera retornar o mesmo texto', () => {
            const gestor = new ValidadorEstoque();
            const response = gestor.preencherCodigoInterno('123456');
            expect(response).toBe('123456');
        });

        it('DADO QUE a funcao preencherCodigoInterno tenha sido chamada QUANDO o texto tiver mais de 6 caracteres ENTAO devera retornar o mesmo texto', () => {
            const gestor = new ValidadorEstoque();
            const response = gestor.preencherCodigoInterno('1234567');
            expect(response).toBe('1234567');
        });

    });

});