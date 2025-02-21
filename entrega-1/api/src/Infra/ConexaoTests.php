<?php

class ConexaoTests{
    private static $pdo = NULL;

    public static function pdo() {
        try{
            if(self::$pdo === NULL){
                self::$pdo = new PDO( 'mysql:dbname=g6_tests;host=localhost:3307;charset=utf8', 'admin', 'admin', [ PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION ] );
            }
            return self::$pdo;
        }catch(PDOException $e){
            throw new ConexaoException($e->getMessage());
        }
    }
}