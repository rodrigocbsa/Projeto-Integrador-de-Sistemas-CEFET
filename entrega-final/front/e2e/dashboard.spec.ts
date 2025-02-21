import { test } from '@playwright/test';
import { TelaDashboard } from './po/visao-dashboard';


test.describe.skip( 'Dashboard', () => {
    

    let tela: TelaDashboard | undefined;

    // Navegar até a página onde os testes serão executados (dashboard.html)
    test.beforeEach( async ( { page } ) => {
        tela = new TelaDashboard( page );
        await tela.abrir();
    } );


    test('Exibe aviso no toast ao tentar gerar relatório sem datas', async ({ page }) => {
        await tela?.clicarNoBotaoDeRelatorio();
        await tela?.toastPossuiTexto('Campos não podem ser vazios');
    });

    test('Exibe aviso no toast ao tentar gerar relatório com data final menor que data inicial', async ({ page }) => {
        await tela?.preencherDataInicialRelatorio('2025-01-31');
        await tela?.preencherDataFinalRelatorio('2025-01-01');
        await tela?.clicarNoBotaoDeRelatorio();
        await tela?.toastPossuiTexto('deve ser menor');
    });


} );