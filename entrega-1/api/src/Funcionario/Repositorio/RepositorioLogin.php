<?php

interface RepositorioLogin{

    /**
   * Retorna o id e nome do funcionário, o nome de usuário e o seu nível de acesso pelo usuario e hash de login
   * 
   * @param Login $usuario
   * @return array|bool
   * @throws RepositorioException
   */
  public function login(Login $usuario): array|bool;

  /**
   * Busca o sal e a pimenta de login associado a um usuario
   * 
   * @return array|bool
   * @throws RepositorioException
   */
  public function sal(string $usuario): array|bool;


}