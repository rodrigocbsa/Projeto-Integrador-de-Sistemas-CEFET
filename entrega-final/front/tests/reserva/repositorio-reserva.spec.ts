import { beforeAll, describe, expect, it, vi } from 'vitest';
import { RepositorioReserva } from '../../src/app/reserva/repositorio/repositorio-reserva';
import { Reserva } from '../../src/app/reserva/modelo/reserva';
import { Funcionario } from '../../src/app/funcionario/modelo/funcionario';
import { Mesa } from '../../src/app/mesa/modelo/mesa';



describe('RepositorioReserva', () => {

    /*
    vi.mock("../../src/visao/visao-login");
    vi.mock("../../src/controladora/controladora-funcionario");

    beforeAll(() => {
        const controladoraLoginMock = {
            acaoDeLogin: vi.fn(),
            visao: {} as VisaoLogin,
            repo: {} as RepositorioFuncionario
        }
        const visaoLoginMock = {
            iniciar: vi.fn(),
            pegarUsuario: vi.fn(() => {return 'admin'}),
            pegarSenha: vi.fn(() => {return 'admin'}),
            camposEstaoVazios: vi.fn(),
            exibirNotificacao: vi.fn()
        }
        controladoraLoginMock.visao = visaoLoginMock;
        visaoLoginMock.iniciar();
        //const loginMock = {"success":true,"nome":"John Doe Corin","usuario":"admin","funcionario":1};
        //controladoraLoginMock.acaoDeLogin.mockResolvedValue(loginMock);
        controladoraLoginMock.acaoDeLogin();
    })
        */

    
    describe.skip('cadastramento', () => {

        it('DADO QUE uma reserva precise ser cadastrada QUANDO for valida ENTAO devera ser retornado true', async () => {
            const repo = new RepositorioReserva();
            const reserva = new Reserva(0,'Nome Cliente Teste Spec', '229910133333', '2025-01-26', '14:00', 0,0, new Mesa(10), new Funcionario(1));
            const resposta = await repo.cadastrarReserva(reserva);
            expect(resposta.success).toBe(true);
        });

        it('DADO QUE uma reserva precise ser cadastrada QUANDO tiver dado faltante ENTAO devera ser retornado false', async () => {
            const repo = new RepositorioReserva();
            const reserva = new Reserva(0,'Nome Cliente Teste Spec', '', '2025-01-26', '14:00', 0,0, new Mesa(10), new Funcionario(1));
            const resposta = await repo.cadastrarReserva(reserva);
            expect(resposta.success).toBe(false);
        });
    })

    describe.skip('consulta', () => {

        it('DADO QUE todas as reservas precisem ser consultadas QUANDO houver reservas no banco de dados ENTAO devera ser retornado um array com reservas', async () => {
            const repo = new RepositorioReserva();
            const reservas = await repo.consultarReservas();
            expect(reservas.length).toBeGreaterThan(0);
        });

        it('DADO QUE uma reserva precise ser consultada QUANDO ela existir ENTAO devera ser retornada', async () => {
            const repo = new RepositorioReserva();
            const reserva = await repo.consultarReservaPorId(1);
            expect(reserva.id).toBe(1);
        });

    });

    describe.skip('cancelamento', () => {

        it('DADO QUE uma reserva precise ser cancelada QUANDO ela existir ENTAO devera retornar true', async () => {
            const repo = new RepositorioReserva();
            const resposta = await repo.cancelarReserva(1);
            expect(resposta.success).toBe(true);
        });

        it('DADO QUE uma reserva precise ser cancelada QUANDO ela nao existir ENTAO devera retornar false', async () => {
            const repo = new RepositorioReserva();
            const resposta = await repo.cancelarReserva(0);
            expect(resposta.success).toBe(false);
        });

    });


    describe.skip('conclusao', () => {

        it('DADO QUE uma reserva precise ser concluida QUANDO ela existir ENTAO devera retornar true', async () => {
            const repo = new RepositorioReserva();
            const resposta = await repo.concluir(1);
            expect(resposta.success).toBe(true);
        });

        it('DADO QUE uma reserva precise ser concluida QUANDO ela nao existir ENTAO devera retornar false', async () => {
            const repo = new RepositorioReserva();
            const resposta = await repo.concluir(0);
            expect(resposta.success).toBe(false);
        });

    });

});