import { expect } from '@playwright/test';

export class TelaEstoqueListagem{
    page = null;

    /**
     *
     * @param {import('@playwright/test').Page} page
     */
    constructor( page ) {
        this.page = page;
    }

    async abrir() {
        await this.page.goto( 'http://localhost:5173/src/pages/historico.html' );
    }



    async tabelaPossuiMotivo( motivo ){
        await expect( this.page.locator('td > p') ).toContainText( ['1', motivo] );
    }

    async detalhesDaUltimaMovimentacaoPossuiAdicaoDeXUnidadesNoEstoque( X ){
        await this.page.locator('td > div > button').first().click();
        await this.page.locator('td > div > ul > li > a').first().click();
        await expect( this.page.locator('h5 > p') ).toContainText( ['Resumo', `+${X} un`] );
    }
}