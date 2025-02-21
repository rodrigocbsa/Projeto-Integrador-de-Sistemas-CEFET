<?php

class ControladoraMesa{

  public function __construct(private RepositorioMesa $repoMesa, private GestorDatas $gestorDatas){}

  public function getMesasDisponiveis( $dia = '', $hora = '' ) {
    $problemas = [];

    $this->gestorDatas->validaDia($dia,$problemas);
    $this->gestorDatas->validaHora($hora,$problemas);

    if(count($problemas)){
      $ex = new DominioException('Dia e hora inválidos', 400);
      $ex->setProblemas($problemas);
      throw $ex;
    }
    
    return $this->repoMesa->mesasDisponiveis( $dia, $hora );

  }

  
}