import { describe, it, expect } from 'vitest';
import { RepositorioMesa } from "../../src/app/mesa/repositorio/repositorio-mesa";




describe.skip('RepositorioMesa', () => {

    
    describe('consulta', () => {

        it('DADO QUE as mesas precisem ser consultadas QUANDO as datas forem validas ENTAO devera ser retornado um array', async () => {
            const repo = new RepositorioMesa();
            const mesas = await repo.consultarMesas('2025-01-26','19:55');
            expect(mesas.length).toBeGreaterThan(0);
        });

    });

});