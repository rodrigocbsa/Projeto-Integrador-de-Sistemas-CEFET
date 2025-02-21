<?php

class ControladoraDashboard{

    public function __construct( private RepositorioDashboard $repo ) { }

    public function getExtras(): array{
        return $this->repo->consultarExtras();
    }
}