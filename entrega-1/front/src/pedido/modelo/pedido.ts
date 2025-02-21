import { Item } from "../../item/modelo/item";

export class Pedido{
    id: number;
    mesa: number;
    total: number;
    itens: Item[];
    pagamento: string;

    constructor(
        id = 0,
        id_mesa = 0,
        total = 0.0,
        itens: Array<Item>,
        pagamento = ""
    ){
        this.id = id;
        this.mesa = id_mesa;
        this.total = total;
        this.itens = itens;
        this.pagamento = pagamento;
    }
}