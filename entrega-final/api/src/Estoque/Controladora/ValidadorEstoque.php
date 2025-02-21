<?php

class ValidadorEstoque
{

    public function __construct()
    {
    }

    public function validarCodigoInterno($codigo = ''): bool
    {
        return is_numeric($codigo) && mb_strlen($codigo) == 6;
    }

    /**
     * 
     * referência: https://pt.wikipedia.org/wiki/EAN-13#C%C3%A1lculo_do_d%C3%ADgito_verificador_EAN_13. Adaptado.
     */
    public function validarEan($ean = ''): bool
    {
        try {
            if (!preg_match("/^[0-9]{13}$/", $ean)) {
                return false;
            }

            $digits = str_split($ean);
            $sum = 0;

            for ($i = 0; $i < 12; $i++) {
                $sum += ($i % 2 === 0) ? $digits[$i] : ($digits[$i] * 3);
            }

            $checkDigit = (10 - ($sum % 10)) % 10;

            return $checkDigit == $digits[12];
        } catch (Exception $e) {
            throw new Exception('O código EAN13 é inválido.');
        }
    }


    public function validarCodigos($codigo, &$problemas)
    {
        $ehCodigoInternoValido = $this->validarCodigoInterno($codigo);
        $ehCodigoEanValido = $this->validarEan($codigo);
        if (!($ehCodigoInternoValido || $ehCodigoEanValido) == true) {
            array_push($problemas, 'Não é um código válido.');
        }
    }

    public function validarCategoria($categoria, &$problemas)
    {
        if (!in_array($categoria, array_column(CategoriaProduto::cases(), 'value'), true)) {
            array_push($problemas, 'Categoria de produto inválida.');
        }
    }

    public function validarMovimentacoes($valor, &$problemas)
    {
        if (intval($valor) > 100 || intval($valor) < 1) {
            array_push($problemas, "Não é uma quantidade de entrada ou saída válida. Mínimo: 1, Máximo: 100 por produto movimentado.");
        }
    }

    public function validarMotivo($motivo, &$problemas)
    {
        if (mb_strlen($motivo) > 50) {
            array_push($problemas, "Motivo muito grande. Máximo 100 caracteres.");
        }
        if (mb_strlen($motivo) < 5) {
            array_push($problemas, "Motivo muito pequeno. Mínimo 5 caracteres.");
        }
    }

    public function validarQuantidade($valor, &$problemas)
    {
        if (!is_numeric($valor)) {
            array_push($problemas, "Total de produtos movimentados inválido.");
        } else if (intval($valor) <= 0) {
            array_push($problemas, "Total de produtos movimentados deve ser >= 0.");
        }
    }

    public function validarMovimentacao($codigo, $valorAdicionadoOuRemovido, $motivo, $quantidade): array
    {
        $problemas = [];

        $this->validarCodigos($codigo, $problemas);
        $this->validarMovimentacoes($valorAdicionadoOuRemovido, $problemas);
        $this->validarMotivo($motivo, $problemas);
        $this->validarQuantidade($quantidade, $problemas);

        return $problemas;
    }

    public function sanitizadorDeDados(&$dados)
    {
        foreach ($dados as $chave => &$valor) {
            if (is_array($valor) || is_object($valor)) {
                // Itera sobre os valores do array/objeto
                foreach ($valor as $chave => &$subValor) {
                    $subValor = htmlspecialchars($subValor, ENT_QUOTES, 'UTF-8');
                }
            } elseif (is_string($valor)) {
                // Aplica htmlspecialchars para strings
                $valor = htmlspecialchars($valor, ENT_QUOTES, 'UTF-8');
            }
        }
    }
}