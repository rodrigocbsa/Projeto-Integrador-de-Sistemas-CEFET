import { Item } from "../../item/modelo/item";
import { Mesa } from "../../mesa/modelo/mesa";
import { Notificacao, TIPOS_NOTIFICACAO } from "../../util/notificacao";
import { ControladoraPedidos } from "../controladora/controladora-pedidos";

export class VisaoPedidos {

    controladora: ControladoraPedidos | undefined;

    iniciar(){
        this.controladora = new ControladoraPedidos(this);

        const inputQuantidade   = document.getElementById('quantidade-item') as HTMLInputElement;
        const inputPreco        = document.getElementById('preco-item') as HTMLInputElement;
        const selectMesas       = document.getElementById('mesas') as HTMLSelectElement;

        /* Ao carregar a tela, pegar as reservas de agora no banco de dados e listar as mesas automaticamente no select */
        // Se a tela for carregada via a listagem de reservas do dashboard, isso não deve acontecer.
        if(localStorage.getItem('dashboard_mesa_id') === null){
            if(document.readyState == 'complete'){
                this.controladora?.listarMesasDasReservasDeAgora();
            }
        } else {
            this.bloquearSelectComMesa(localStorage.getItem('dashboard_mesa_id') ?? '');
        }
        // Sempre que sair da tela, limpar o local storage dos dados via dashboard
        window.addEventListener('beforeunload', () => {  localStorage.removeItem('dashboard_mesa_id'); })

        // "Botão falso"
        const botaoPedido = document.getElementById('adicionar-pedido') as HTMLButtonElement;
        botaoPedido.onclick = (event: Event) => {
            event.preventDefault();
            if(!this.camposEstaoVazios())  
                window.location.reload(); // Só recarrega a página, pedidos só são salvos no BD quando fechar a conta
            else
              this.exibirNotificacao(["Preencha os dados para adicionar um pedido a uma mesa."],TIPOS_NOTIFICACAO.AVISO);
        }

        const botaoItem = document.getElementById('adicionar-item') as HTMLButtonElement;
        botaoItem.onclick = (event: Event) => {
            event.preventDefault();
            if(selectMesas.selectedIndex != 0)
                this.controladora?.adicionarItemAoPedidoDaMesa(selectMesas.value);
            else
                this.exibirNotificacao(["Selecione uma mesa de atendimento para adicionar itens ao pedido."],TIPOS_NOTIFICACAO.AVISO)
        }

        // Impedir caracteres não numéricos no campo de quantidade e de preço.
        inputQuantidade.addEventListener('input', (event) => {
            const input = event.target as HTMLInputElement;
            input.value = input.value.replace(/[^0-9]/g, '');
        });
        inputPreco.addEventListener('input', (event) => {
            const input = event.target as HTMLInputElement;
            input.value = input.value.replace(/[^0-9]/g, '');
        });
    }


    camposEstaoVazios() {
        const selectMesas       = document.getElementById('mesas') as HTMLSelectElement;
        const selectCategorias  = document.getElementById('categorias') as HTMLSelectElement;
        const inputDescricao    = document.getElementById('descricao-item') as HTMLInputElement;
        const inputQuantidade   = document.getElementById('quantidade-item') as HTMLInputElement;
        const inputPreco        = document.getElementById('preco-item') as HTMLInputElement;

        return  (selectMesas.value      == '' ||
                selectCategorias.value  == '' ||
                inputDescricao.value    == '' ||
                inputQuantidade.value   == '' ||
                inputPreco.value        == ''       ) ? true : false;
    }

    desenhaMesas(mesas: Mesa[]) {
        this.limparSelectMesas();
        const select = <HTMLSelectElement> document.getElementById('mesas');
        for (const m of mesas) {
            const option = document.createElement('option');
            option.value = m.id.toString();
            option.textContent = m.numero.toString();
            select.appendChild(option);
        }
    }

    desenharPedido(elemento: Item) {
        const textArea = document.getElementById('resumo-pedido') as HTMLTextAreaElement;
        textArea.value += `Item: ${elemento.descricao} - R$ ${elemento.preco},00 - ${elemento.quantidade} un\n`;
    }

    limparSelectMesas(){
        const select = <HTMLSelectElement> document.getElementById('mesas');
        select.innerHTML = '';
        select.appendChild(new Option('Selecione uma mesa', '0', true, true));
        select.selectedIndex = 0;
    }


    exibirNotificacao(mensagens: Array<string>, tipo: TIPOS_NOTIFICACAO): void{
        Notificacao.exibirNotificacao(mensagens, tipo);
    }

    bloquearSelectComMesa(id: string) {
        const select = <HTMLSelectElement> document.getElementById('mesas');
        this.limparSelectMesas();
        const option = new Option(`<< MESA ${id} EM ATENDIMENTO >>`, id, true, true);
        select.appendChild(option);
        select.selectedIndex = 1;
    }



    valorPrecoItem() {
        const el = <HTMLInputElement> document.getElementById('preco-item');
        return el.value ? el.value : '';
    }
    valorQuantidadeItem() {
        const el = <HTMLInputElement> document.getElementById('quantidade-item');
        return el.value ? el.value : '';
    }
    valorDescricaoItem() {
        const el = <HTMLInputElement> document.getElementById('descricao-item');
        return el.value ? el.value : '';
    }
    valorIdMesa() {
        const el = <HTMLSelectElement> document.getElementById('mesas');
        return el.value ? el.value : '';
    }
    valorCategoriaItem() {
        const el = <HTMLSelectElement> document.getElementById('categorias');
        return el.value ? el.value : '';
    }
}