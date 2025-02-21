import { describe, expect, it } from 'vitest';
import { GestorDatas } from '../../src/app/util/gestor-datas';

describe('GestorDatas', () => {

    describe('data', () => {

        describe('validarData', () => {

            it('DADO QUE a funcao validarData tenha sido chamada QUANDO a data de uma reserva for valida e estiver no intervalo permitido ENTAO nao devera retornar problemas no array', () => {
                const gestor = new GestorDatas();
                const problemas = gestor.validarData('2025-01-31');
                expect(problemas).toHaveLength(0);
            });
        
            it('DADO QUE a funcao validarData tenha sido chamada QUANDO a data de uma reserva for valida e estiver fora do intervalo permitido ENTAO devera retornar a mensagem em array', () => {
                const gestor = new GestorDatas();
                const problemas = gestor.validarData('2025-01-27');
                expect(problemas).toEqual([
                    'Reservas só podem ser realizadas entre quinta e domingo.',
                ]);
            });
    
            it('DADO QUE a funcao validarData tenha sido chamada QUANDO a data de uma reserva for invalida ENTAO devera retornar a mensagem em array', () => {
                const gestor = new GestorDatas();
                const problemas = gestor.validarData('2025-01|27');
                expect(problemas).toEqual([
                    'Data inválida.',
                ]);
            });

        });

        describe('ehHoje', () => {

            it('DADO QUE a funcao ehHoje tenha sido chamada QUANDO a data for hoje ENTAO devera retornar true', () => {
                const gestor = new GestorDatas();
                const agora = new Date();
                const resposta = gestor.ehHoje(agora);
                expect(resposta).toBe(true);
            });
    
            it('DADO QUE a funcao ehHoje tenha sido chamada QUANDO a data nao for hoje ENTAO devera retornar false', () => {
                const gestor = new GestorDatas();
                const agora = new Date();
                const resposta = gestor.ehHoje(new Date(agora.getTime() - 100000000)); // provavelmente nao é hoje
                expect(resposta).toBe(false);
            });

        });

        describe('validaDatasRelatorio', () => {

            it('DADO QUE a funcao validaDatasRelatorio tenha sido chamada QUANDO as datas forem validas ENTAO nao deverao ser retornados problemas', () => {
                const gestor = new GestorDatas();
                const problemas = gestor.validarDatasRelatorio('2025-01-01','2025-01-31');
                expect(problemas).toHaveLength(0);
            });
    
            it('DADO QUE a funcao validaDatasRelatorio tenha sido chamada QUANDO a primeira data estiver vazia ENTAO devera ser retornada mensagem apropriada', () => {
                const gestor = new GestorDatas();
                const problemas = gestor.validarDatasRelatorio('','2025-01-31');
                expect(problemas).toHaveLength(1);
                expect(problemas.at(0)).toContain("Campos não podem ser vazios");
            });
    
            it('DADO QUE a funcao validaDatasRelatorio tenha sido chamada QUANDO a segunda data estiver vazia ENTAO devera ser retornada mensagem apropriada', () => {
                const gestor = new GestorDatas();
                const problemas = gestor.validarDatasRelatorio('2025-01-01','');
                expect(problemas).toHaveLength(1);
                expect(problemas.at(0)).toContain("Campos não podem ser vazios");
            });
    
            it('DADO QUE a funcao validaDatasRelatorio tenha sido chamada QUANDO as datas estiverem vazias ENTAO devera ser retornada mensagem apropriada', () => {
                const gestor = new GestorDatas();
                const problemas = gestor.validarDatasRelatorio('','');
                expect(problemas).toHaveLength(1);
                expect(problemas.at(0)).toContain("Campos não podem ser vazios");
            });
    
            it('DADO QUE a funcao validaDatasRelatorio tenha sido chamada QUANDO a data final for menor que a data inicial ENTAO devera ser retornada mensagem apropriada', () => {
                const gestor = new GestorDatas();
                const problemas = gestor.validarDatasRelatorio('2025-01-31','2025-01-01');
                expect(problemas).toHaveLength(1);
                expect(problemas).toEqual([
                    'Data inicial deve ser menor ou igual à data final.',
                ]);
            });

        });
        
    });

    describe('hora', () => {

        describe('validaHora', () => {

            it('DADO QUE a funcao validaHora tenha sido chamada QUANDO a hora for valida e estiver dentro do horario permitido ENTAO nao devera ser retornado problemas', () => {
                const gestor = new GestorDatas();
                const problemas = gestor.validarHora('18:00','2025-01-31');
                expect(problemas).toHaveLength(0);
            });
    
            it('DADO QUE a funcao validaHora tenha sido chamada QUANDO a hora for valida ou estiver fora do horario permitido ENTAO devera retornar a mensagem no array', () => {
                const gestor = new GestorDatas();
                const problemas = gestor.validarHora('20:01','2025-01-31');
                expect(problemas).toEqual([
                    'Hora inválida. Horários permitidos: 11:00 as 20:00.',
                ]);
            });
    
            it('DADO QUE a funcao validaHora tenha sido chamada QUANDO a hora for invalida ou estiver fora do horario permitido ENTAO devera retornar a mensagem no array', () => {
                const gestor = new GestorDatas();
                const problemas = gestor.validarHora('20|01','2025-01-31');
                expect(problemas).toEqual([
                    'Hora inválida. Horários permitidos: 11:00 as 20:00.',
                ]);
            });

        });

    });

});