import { Notificacao, TIPOS_NOTIFICACAO } from "../../util/notificacao";
import { ControladoraControle } from '../controladora/controladora-controle';

export class VisaoControle{

    private static CONTADOR = 0;

    iniciar(){
        const controladora = new ControladoraControle(this);

        if(document.readyState == 'complete'){
            controladora.carregar();
        }
    }


    exibirNotificacaoExcecaoErro(msg: string): void{
        Notificacao.exibirNotificacao([msg],TIPOS_NOTIFICACAO.ERRO);
    }
    exibirNotificacaoNaoHaProdutosInfo() {
        Notificacao.exibirNotificacao(['Não há produtos abaixo do estoque mínimo no momento.'],TIPOS_NOTIFICACAO.INFO);
    }




    /*********************
    *                    *
    *      TABELA        *
    *                    *
    *********************/

    desenharTabela(array: Array<{nome: string, codigo: string}>): void {
        const tbody = document.querySelector('tbody');
        if(tbody){
            tbody.innerHTML = '';

            const fragmento = document.createDocumentFragment();
            for (const el of array) {
                const linha = this.criarLinha(el);
                fragmento.append(linha);
            }
            tbody.append(fragmento);

            // Reseta contador de linhas
            VisaoControle.CONTADOR = 0;
        
        }
    }
  

  /**
   * Cria uma linha com os dados de um objeto e a retorna.
   *
   * @returns {HTMLTableRowElement}
   */
    criarLinha(el: {nome: string, codigo: string}): HTMLTableRowElement {
        const tr = document.createElement('tr');

        const celulaContagem = this.criarCelula(VisaoControle.CONTADOR += 1);
        const celulaStatus = this.criarCelulaDeStatus();
        const celulaNome = this.criarCelula(el.nome);
        const celulaCodigo = this.criarCelula(el.codigo);


        tr.append(
            celulaContagem,
            celulaStatus,
            celulaNome,
            celulaCodigo
        );

        return tr;
    }

  /**
   * Cria uma célula para uma linha da tabela e retorna.
   *
   * @param {any} conteudo
   * @returns {HTMLTableCellElement}
   */
  criarCelula(conteudo: any): HTMLTableCellElement {
    const td = document.createElement('td');
    const p = document.createElement('p');
    p.classList.add('text-sm')
    p.innerText = conteudo;
    td.append(p);
    return td;
  }

  /**
   * Cria uma célula de status para uma linha da tabela e retorna.
   *
   * @returns {HTMLTableCellElement}
   */
  criarCelulaDeStatus(): HTMLTableCellElement {
    const td = document.createElement('td');
    const span = document.createElement('span');
    span.classList.add('status-btn', 'close-btn');
    span.innerText = "ESTOQUE MUITO BAIXO";

    td.append(span);

    return td;
  }

}