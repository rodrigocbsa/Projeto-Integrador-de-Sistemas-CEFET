import { test } from '@playwright/test';
import { TelasEstoque } from './po/visao-estoque';
import { TelaEstoqueListagem } from './po/visao-estoque-listagem';

//test.describe.configure({ mode: 'serial' });

test.describe('Entrada', () => {

    let tela: TelasEstoque | undefined;

    test.beforeEach(async ({ page }) => {
        tela = new TelasEstoque(page);
        await tela.abrirPaginaEstoqueEntrada();
    });

    test('Exibe mensagem de produto encontrado no toast ao pesquisar um produto existente', async ({ page }) => {
        const codigoPesquisa = '000001';
        await tela?.pesquisarProdutoPeloCodigoInterno(codigoPesquisa);
        await tela?.toastSecundarioPossuiTexto('encontrado!');
    });

    test('Exibe mensagem de código inválido no toast ao pesquisar por um código inválido', async ({ page }) => {
        await tela?.pesquisarProdutoPeloCodigoInterno('a');
        await tela?.toastPossuiTexto('inválido');
    });

    test('Exibe mensagem de código de barras inválido no toast ao pesquisar por um código de barras inválido', async ({ page }) => {
        await tela?.pesquisarProdutoPeloCodigoDeBarras('2936181503071');
        await tela?.toastSecundarioPossuiTexto('Código de barras inválido.');
    });

    test('Exibe mensagem de produto encontrado no toast ao pesquisar por um código de barras válido e existente', async ({ page }) => {
        await tela?.pesquisarProdutoPeloCodigoDeBarras('2936181503079');
        await tela?.toastSecundarioPossuiTexto('encontrado');
    });

    test('Exibe aviso no toast ao tentar movimentar sem campos preenchidos', async ({ page }) => {
        const codigoPesquisa = '000001';
        await tela?.pesquisarProdutoPeloCodigoInterno(codigoPesquisa);
        await tela?.botaoMovimentar();
        await tela?.toastFinalPossuiTexto('Atualize');
    });

    test('Exibe aviso no toast ao tentar movimentar sem campo de motivo preenchido', async ({ page }) => {
        const codigoPesquisa = '000001';
        await tela?.pesquisarProdutoPeloCodigoInterno(codigoPesquisa);
        await tela?.adicionar50UnidadesAoProdutoDeCodigoInternoEntrada(codigoPesquisa);
        await tela?.botaoMovimentar();
        await tela?.toastFinalPossuiTexto('Atualize');
    });

    test('Exibe frase no toast com o final "sucesso." ao movimentar um produto com os campos preenchidos', async ({ page }) => {
        const codigoPesquisa = '000001';
        await tela?.pesquisarProdutoPeloCodigoInterno(codigoPesquisa);
        await tela?.adicionar50UnidadesAoProdutoDeCodigoInternoEntrada(codigoPesquisa);
        await tela?.preencherMotivoComMensagem('Teste Entrada Sucesso E2E');
        await tela?.botaoMovimentar();
        await tela?.toastFinalPossuiTexto('sucesso.');
    });

});

test.describe('Saída', () => {

    let tela: TelasEstoque | undefined;

    test.beforeEach(async ({ page }) => {
        tela = new TelasEstoque(page);
        await tela.abrirPaginaEstoqueSaida();
    });

    test('Exibe mensagem de produto encontrado no toast ao pesquisar um produto existente', async ({ page }) => {
        const codigoPesquisa = '000001';
        await tela?.pesquisarProdutoPeloCodigoInterno(codigoPesquisa);
        await tela?.toastSecundarioPossuiTexto('encontrado!');
    });

    test('Exibe mensagem de código inválido no toast ao pesquisar por um código inválido', async ({ page }) => {
        await tela?.pesquisarProdutoPeloCodigoInterno('a');
        await tela?.toastPossuiTexto('inválido');
    });

    test('Exibe aviso no toast ao tentar movimentar sem campos preenchidos', async ({ page }) => {
        const codigoPesquisa = '000001';
        await tela?.pesquisarProdutoPeloCodigoInterno(codigoPesquisa);
        await tela?.botaoMovimentar();
        await tela?.toastFinalPossuiTexto('Atualize');
    });

    test('Exibe aviso no toast ao tentar movimentar sem campo de motivo preenchido', async ({ page }) => {
        const codigoPesquisa = '000001';
        await tela?.pesquisarProdutoPeloCodigoInterno(codigoPesquisa);
        await tela?.adicionar50UnidadesAoProdutoDeCodigoInternoEntrada(codigoPesquisa);
        await tela?.botaoMovimentar();
        await tela?.toastFinalPossuiTexto('Atualize');
    });

    test('Exibe frase no toast com o final "sucesso." ao movimentar um produto com os campos preenchidos', async ({ page }) => {
        const codigoPesquisa = '000001';
        await tela?.pesquisarProdutoPeloCodigoInterno(codigoPesquisa);
        await tela?.adicionar10UnidadesAoProdutoDeCodigoInternoSaida(codigoPesquisa);
        await tela?.preencherMotivoComMensagem('Teste Saída Sucesso E2E');
        await tela?.botaoMovimentar();
        await tela?.toastFinalPossuiTexto('sucesso.');
    });

    test('Exibe aviso no toast ao tentar movimentar sem atualizar quantidade', async ({ page }) => {
        const codigoPesquisa = '000001';
        await tela?.pesquisarProdutoPeloCodigoInterno(codigoPesquisa);
        await tela?.preencherMotivoComMensagem('Teste Saída Erro E2E');
        await tela?.botaoMovimentar();
        await tela?.toastFinalPossuiTexto('Atualize');
    });

});

test.describe('Entrada Saída Listagem', () => {

    let telaListagem: TelaEstoqueListagem | undefined;
    let telaEntradaSaida: TelasEstoque | undefined;

    test.beforeEach(async ({ page }) => {
        telaEntradaSaida = new TelasEstoque(page);
        telaListagem = new TelaEstoqueListagem(page);
    });

    test('Registra uma entrada para um produto e aparece movimentação no histórico', async ({ page }) => {
        const codigo = "000004";
        const motivo = "Teste Entrada Listagem E2E";
        await telaEntradaSaida?.abrirPaginaEstoqueEntrada();
        await telaEntradaSaida?.pesquisarProdutoPeloCodigoInterno(codigo);
        await telaEntradaSaida?.adicionar50UnidadesAoProdutoDeCodigoInternoEntrada(codigo);
        await telaEntradaSaida?.preencherMotivoComMensagem(motivo);
        await telaEntradaSaida?.botaoMovimentar();
        await telaListagem?.abrir();
        await telaListagem?.tabelaPossuiMotivo(motivo);
    });

    test('Registra uma saída para um produto e aparece movimentação no histórico', async ({ page }) => {
        const codigo = "000004";
        const motivo = "Teste Saída Listagem E2E";
        await telaEntradaSaida?.abrirPaginaEstoqueSaida();
        await telaEntradaSaida?.pesquisarProdutoPeloCodigoInterno(codigo);
        await telaEntradaSaida?.adicionar10UnidadesAoProdutoDeCodigoInternoSaida(codigo);
        await telaEntradaSaida?.preencherMotivoComMensagem(motivo);
        await telaEntradaSaida?.botaoMovimentar();
        await telaListagem?.abrir();
        await telaListagem?.tabelaPossuiMotivo(motivo);
    });


    test('Registra uma entrada para um produto e lista suas informações de movimentação exatas', async ({ page }) => {
        const codigo = "000003"; // Engradado 20 un
        const motivo = "Teste Entrada Listagem Informações E2E";
        const adicoes = `${50 * 20}`;
        await telaEntradaSaida?.abrirPaginaEstoqueEntrada();
        await telaEntradaSaida?.pesquisarProdutoPeloCodigoInterno(codigo);
        await telaEntradaSaida?.adicionar50UnidadesAoProdutoDeCodigoInternoEntrada(codigo);
        await telaEntradaSaida?.preencherMotivoComMensagem(motivo);
        await telaEntradaSaida?.botaoMovimentar();
        await telaListagem?.abrir();
        await telaListagem?.tabelaPossuiMotivo(motivo);
        await telaListagem?.detalhesDaUltimaMovimentacaoPossuiAdicaoDeXUnidadesNoEstoque( adicoes );
    });

});