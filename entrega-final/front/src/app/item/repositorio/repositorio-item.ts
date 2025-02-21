import { Item } from "../modelo/item";


export class RepositorioItem {

    // key: pedido-mesa:{id_da_mesa}
    private static KEY = 'pedido-mesa:';

    setItem(item: Item, idMesa: string) {
        const itens = this.getItens(idMesa);
        itens.push(item);
        localStorage.setItem(RepositorioItem.KEY.concat(idMesa),JSON.stringify(itens));
    }

    getItens(idMesa: string): Array<Item>{
        const itens = localStorage.getItem(RepositorioItem.KEY.concat(idMesa));
        return itens ? JSON.parse(itens) : new Array<Item>();
    }

    clear(idMesa: string) {
        localStorage.removeItem(RepositorioItem.KEY.concat(idMesa));
    }

}