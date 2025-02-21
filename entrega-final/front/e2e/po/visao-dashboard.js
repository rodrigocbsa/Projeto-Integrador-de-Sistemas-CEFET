import { expect } from '@playwright/test';
import { sels } from '../../src/app/dashboard/visao/visao-dashboard'

export class TelaDashboard {

    page = null;

    /**
     *
     * @param {import('@playwright/test').Page} page
     */
    constructor( page ) {
        this.page = page;
    }

    async abrir() {
        await this.page.goto( 'http://localhost:5173/src/pages/dashboard.html' ); // LiveServer;
    }

    async clicarNoBotaoDeRelatorio( ) {
        await this.page.click( sels.relatorio );
    }

    async preencherDataInicialRelatorio( dataInicial ){
        await this.page.locator(sels.dti).fill(dataInicial);
    }

    async preencherDataFinalRelatorio( dataFinal ){
        await this.page.locator(sels.dtf).fill(dataFinal);
    }

    async toastPossuiTexto( textoEsperado ) {
        const texto = await this.page.locator( 'body' ).innerHTML();
        expect( texto ).toContain( textoEsperado );
    }
}