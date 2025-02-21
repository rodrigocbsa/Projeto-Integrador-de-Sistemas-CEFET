import { describe, expect, it } from 'vitest';
import { Login } from '../../src/app/funcionario/modelo/login';
import { RepositorioFuncionario } from './../../src/app/funcionario/repositorio/repositorio-funcionario';



describe.skip('RepositorioFuncionario', () => {
    
    describe('cadastramento', () => {

        it.skip('DADO QUE um funcionario precise ser cadastrado QUANDO for valido ENTAO devera retornar uma mensagem com sucesso', async () => {
            const repo = new RepositorioFuncionario();
            const obj = {
              acesso : "padrao",
              nome : "Funcionário Spec",
              senha : "test",
              usuario : "test"
            };
            const resposta = await repo.cadastrar(obj);
            expect(resposta.success).toBe(true);
            expect(resposta.message).toContain('sucesso');
        });
    })

    describe('login', () => {

        it('DADO QUE um funcionario precise fazer login QUANDO existir um login ENTAO devera ser retornado dados do funcionario', async () => {
            const repo = new RepositorioFuncionario();
            const login = new Login(0,'admin','admin');
            const resposta = await repo.login(login);
            expect(resposta.nome).toContain("John");
        });

    });

});