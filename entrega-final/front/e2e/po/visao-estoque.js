import { expect } from '@playwright/test';

export class TelasEstoque{
    page = null;

    /**
     *
     * @param {import('@playwright/test').Page} page
     */
    constructor( page ) {
        this.page = page;
    }

    async abrirPaginaEstoqueEntrada() {
        await this.page.goto( 'http://localhost:5173/src/pages/estoque-entrada.html' );
    }

    async abrirPaginaEstoqueSaida() {
        await this.page.goto( 'http://localhost:5173/src/pages/estoque-saida.html' );
    }



    async pesquisarProdutoPeloCodigoInterno( codigo ) {
        await this.page.locator('#codigo-pesquisa').fill(codigo);
        await this.page.locator('#codigo-pesquisa').blur();
    }

    async pesquisarProdutoPeloCodigoDeBarras( codigo ) {
        await this.page.locator('#ean-pesquisa').fill(codigo);
        await this.page.locator('#ean-pesquisa').blur();
    }

    async toastPossuiTexto( textoEsperado ) {
        const texto = await this.page.locator( '.sn-notify' ).innerHTML();
        console.log(texto);
        expect( texto ).toContain( textoEsperado );
    }

    async toastSecundarioPossuiTexto( textoEsperado ) {
        const toasts = await this.page.locator( '.sn-notify' );
        await expect(toasts).toHaveCount(2);
        const textos = await toasts.allTextContents();
        console.log(textos);
        const possuiTexto = textos.some(texto => texto.includes(textoEsperado));
        expect( possuiTexto ).toBe( true );
    }

    async toastFinalPossuiTexto( textoEsperado ) {
        const toasts = this.page.locator( '.sn-notify' );
        await expect(toasts).toHaveCount(3);
        const textos = await toasts.allTextContents();
        console.log(textos);
        const possuiTexto = textos.some(texto => texto.includes(textoEsperado));
        expect( possuiTexto ).toBe( true );
    }

    async botaoMovimentar(){
        await this.page.click( '#movimentar-estoque' );
    }

    async preencherMotivoComMensagem( mensagem ) {
        await this.page.locator('#motivo').fill(mensagem);
    }

    async adicionar50UnidadesAoProdutoDeCodigoInternoEntrada( codigo ) {
        const spanId = this.page.locator('.codigo');
        await expect(spanId).toContainText(codigo);
        const input = this.page.locator('input[type=number]');
        await input.fill("50");
        await expect(input).toHaveValue("50");
        console.log(await spanId.innerHTML(), await input.inputValue());
    }

    async adicionar10UnidadesAoProdutoDeCodigoInternoSaida( codigo ) {
        const spanId = this.page.locator('.codigo');
        await expect(spanId).toContainText(codigo);
        const input = this.page.locator('input[type=number]');
        await input.fill("10");
        await expect(input).toHaveValue("10");
        console.log(await spanId.innerHTML(), await input.inputValue());
    }
}