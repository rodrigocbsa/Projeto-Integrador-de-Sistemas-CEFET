<?php

class ControladoraReserva{

    public function __construct( private RepositorioReserva $repoReserva, private RepositorioMesa $repoMesa, private RepositorioFuncionario $repoFuncionario, private GestorDatas $gestorDatas ) { }

    
    /* FUNCIONALIDADE PRINCIPAL */
    public function postReserva( $dados = [] ): bool {

        // Sanitiza
        foreach ( $dados as $chave => &$valor ) {
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


        
        file_put_contents('php://stderr', print_r($dados, TRUE));

        

        // Validar os objetos Funcionario e Mesa de Reserva
        $id_funcionario = $dados[ 'funcionario' ]->id ?? 0;
        $id_mesa = $dados[ 'mesa' ]->id ?? 0;

        if($id_funcionario != $_SESSION['funcionario']){
            throw new FuncionarioInvalidoException('Funcionário inválido.');
        }
        $funcionario = $this->repoFuncionario->busca($id_funcionario);
        if($funcionario == null){
            throw new FuncionarioNaoEncontradoException('Funcionário não encontrado.');
        }
        $mesa = $this->repoMesa->busca($id_mesa);
        if($mesa == null){
            throw new MesaNaoEncontradaException('Mesa não encontrada.');
        }

        $nome_cliente = $dados['nome_cliente'] ?? '';
        $telefone = $dados['telefone'] ?? '';
        $dia = $dados['dia'] ?? '';
        $hora = $dados['hora'] ?? '';

        $reserva = new Reserva(0,$nome_cliente,$telefone,$dia,$hora,0,0,$mesa,$funcionario);
        $problemas = $reserva->validar();
        $this->gestorDatas->validaDia($dia,$problemas);
        $this->gestorDatas->validaHora($hora,$problemas);

        if ( count( $problemas ) ) {
            throw ( new ReservaInvalidaException() )->setProblemas( $problemas );
        }

        $success = $this->repoReserva->adicionar($reserva);
        return $success; // Retorna true ou false
    }
    //$end
    

    public function getReservas(): array {
        return $this->repoReserva->todos();
    }

    public function getReservasPorPeriodo( $data_inicio = '', $data_fim = '' ): array {
        $data_inicio = htmlspecialchars( $data_inicio );
        $data_fim = htmlspecialchars( $data_fim );
        return $this->repoReserva->consultar($data_inicio, $data_fim);
    }


    public function getReservaPorId($id): Reserva{
        // Sanitiza id e converte para número
        $id = htmlspecialchars( $id['id'] );
        $r = $this->repoReserva->busca(intval($id));
        if(!$r){
            throw new ReservaNaoEncontradaException(`Reserva $id não encontrada.`);
        }
        return $r; // Retorna um objeto de reserva
    }

    public function putCancelarReserva( $id ): bool{
        // Sanitiza id e converte para número
        // TODO: reserva já foi cancelada
        $id = htmlspecialchars( $id['id'] );
        $success = $this->repoReserva->cancelar(intval($id));
        return $success; // Retorna true ou false.
    }


    public function putConcluirReserva( $id ): bool{
        // Sanitiza id e converte para número
        // TODO: reserva já foi cancelada
        $id = htmlspecialchars( $id['id'] );
        $success = $this->repoReserva->concluir(intval($id));
        return $success; // Retorna true ou false.
    }

}