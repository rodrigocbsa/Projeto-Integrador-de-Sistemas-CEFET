<?php

interface RepositorioFuncionario
{
  /**
   * Busca um Funcionario pelo id
   * 
   * @return Funcionario|null
   * @throws RepositorioException
   */
  public function busca(int $id): Funcionario|null;
}
