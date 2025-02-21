import { expect } from '@playwright/test';
import { sel } from '../../../front/src/dashboard/visao/visao-dashboard';

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
        await this.page.goto( 'http://localhost:5173/front/pages/dashboard.html' ); // LiveServer;
    }

    async clicarNoBotaoDeRelatorio( ) {
        await this.page.click( sel.relatorio );
    }

    async preencherDataInicialRelatorio( dataInicial ){
        await this.page.locator(sel.dti).fill(dataInicial);
    }

    async preencherDataFinalRelatorio( dataFinal ){
        await this.page.locator(sel.dtf).fill(dataFinal);
    }

    async toastPossuiTexto( textoEsperado ) {
        const texto = await this.page.locator( 'body' ).innerHTML();
        expect( texto ).toContain( textoEsperado );
    }
}