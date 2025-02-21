import { describe, it, expect } from 'vitest';
import { RepositorioPedido } from "../front/src/pedido/repositorio/repositorio-pedido";
import { Pedido } from '../front/src/pedido/modelo/pedido';
import { Item } from '../front/src/item/modelo/item';



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