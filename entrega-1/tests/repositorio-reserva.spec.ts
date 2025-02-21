import { describe, it, expect } from 'vitest';
import { RepositorioReserva } from "../front/src/reserva/repositorio/repositorio-reserva";
import { Reserva } from '../front/src/reserva/modelo/reserva';
import { Mesa } from '../front/src/mesa/modelo/mesa';
import { Funcionario } from '../front/src/funcionario/modelo/funcionario';



describe.skip('RepositorioReserva', () => {

    
    describe('cadastramento', () => {

        it('DADO QUE uma reserva precise ser cadastrada QUANDO for valida ENTAO devera ser retornado true', async () => {
            const repo = new RepositorioReserva();
            const reserva = new Reserva(0,'Nome Cliente Teste Spec', '229910133333', '2025-01-26', '14:00', 0,0, new Mesa(10), new Funcionario(1));
            const resposta = await repo.cadastrarReserva(reserva);
            expect(resposta.success).toBe(true);
        });

        it.skip('DADO QUE uma reserva precise ser cadastrada QUANDO tiver dado faltante ENTAO devera ser retornado false', async () => {
            const repo = new RepositorioReserva();
            const reserva = new Reserva(0,'Nome Cliente Teste Spec', '', '2025-01-26', '14:00', 0,0, new Mesa(10), new Funcionario(1));
            const resposta = await repo.cadastrarReserva(reserva);
            expect(resposta.success).toBe(false);
        });
    })

    describe('consulta', () => {

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

    describe('cancelamento', () => {

        it.skip('DADO QUE uma reserva precise ser cancelada QUANDO ela existir ENTAO devera retornar true', async () => {
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


    describe('conclusao', () => {

        it.skip('DADO QUE uma reserva precise ser concluida QUANDO ela existir ENTAO devera retornar true', async () => {
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