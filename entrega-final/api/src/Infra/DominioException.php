<?php

class DominioException extends RuntimeException {

    private array $problemas = [];

    public function setProblemas( array $problemas ) {
        $this->problemas = $problemas;
        return $this;
    }

    public function getProblemas() {
        return $this->problemas;
    }

}

?>