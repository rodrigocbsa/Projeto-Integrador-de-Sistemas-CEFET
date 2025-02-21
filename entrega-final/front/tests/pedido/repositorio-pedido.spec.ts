import { describe, expect, it } from 'vitest';
import { RepositorioPedido } from '../../src/app/pedido/repositorio/repositorio-pedido';
import { Item } from '../../src/app/item/modelo/item';
import { Pedido } from '../../src/app/pedido/modelo/pedido';



describe.skip('RepositorioPedido', () => {

    
    describe('cadastramento', () => {

        it('DADO QUE um pedido precise ser cadastrado QUANDO for cadastrado ENTAO devera retornar uma mensagem que contenha sucesso', async () => {
            const repo = new RepositorioPedido();
            const itens: Array<Item> = [];
            const item1 = new Item(0,'Item 1',1,50.00,'Entrada');
            const item2 = new Item(0,'Item 2',1,50.00,'Entrada');
            itens.push(item1,item2);
            const pedido = new Pedido(0,10,100.00,itens);
            const resposta = await repo.adicionar(pedido);
            expect(resposta.success).toBe(true);
            expect(resposta.message).toContain("sucesso");
        });

    });
});