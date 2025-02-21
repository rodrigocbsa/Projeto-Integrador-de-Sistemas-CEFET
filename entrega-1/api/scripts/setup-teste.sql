-- Rodar este script para configurar todo o banco de TESTES de uma vez

/* estrutura */
DROP DATABASE IF EXISTS g6_tests;
CREATE DATABASE g6_tests;
USE g6_tests;


CREATE TABLE login(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(10) NOT NULL,
    senha VARCHAR(200) NOT NULL,
    acesso VARCHAR(10) NOT NULL,
    sal VARCHAR(40) NOT NULL,
    pimenta VARCHAR(40) NOT NULL,
    CONSTRAINT unq_usuario__usuario UNIQUE (usuario)
) ENGINE=INNODB;

CREATE TABLE funcionario (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    login INT NOT NULL,
    CONSTRAINT unq_funcionario__login UNIQUE (login),
    CONSTRAINT fk_funcionario__login FOREIGN KEY (login) REFERENCES login(id) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=INNODB;

CREATE TABLE mesa (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    numero INT NOT NULL,
    CONSTRAINT unq_mesa__numero UNIQUE (numero)
) ENGINE=INNODB;

CREATE TABLE reserva (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nome_cliente VARCHAR(100) NOT NULL,
    telefone VARCHAR(15) NOT NULL,
    dia DATE NOT NULL,
    hora TIME NOT NULL,
    reserva_cancelada BOOLEAN DEFAULT 0 NOT NULL, 
    reserva_concluida BOOLEAN DEFAULT 0 NOT NULL, 
    mesa INT NOT NULL,
    funcionario INT NOT NULL,
    CONSTRAINT fk_reserva__mesa FOREIGN KEY (mesa) REFERENCES mesa(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_reserva__funcionario FOREIGN KEY (funcionario) REFERENCES funcionario(id) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=INNODB;


CREATE TABLE funcionario_reserva(
    funcionario INT,
    reserva INT,
    CONSTRAINT fk_funcionario_reserva__funcionario FOREIGN KEY (funcionario) REFERENCES funcionario(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_funcionario_reserva__reserva FOREIGN KEY (reserva) REFERENCES reserva(id) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=INNODB;

CREATE TABLE item(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    preco float NOT NULL,
    descricao VARCHAR(30) NOT NULL,
    categoria VARCHAR(30) NOT NULL
) ENGINE=INNODB;

CREATE TABLE pedido(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    total float NOT NULL,
    mesa int NOT NULL,
    pagamento VARCHAR(20) NOT NULL,
    CONSTRAINT fk_pedido__mesa FOREIGN KEY (mesa) REFERENCES mesa(id) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=INNODB;

CREATE TABLE pedido_item (
    pedido INT NOT NULL,
    item INT NOT NULL,
    quantidade INT NOT NULL,
    CONSTRAINT fk_pedido_item__pedido FOREIGN KEY (pedido) REFERENCES pedido(id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_pedido_item__item FOREIGN KEY (item) REFERENCES item(id) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=INNODB;

/* dados iniciais */
use g6_tests;


INSERT INTO login (usuario,senha,acesso,sal,pimenta) VALUES 
('teste','teste','teste','teste','teste');
INSERT INTO funcionario (nome,login) VALUES 
('John Doe Corin Test',1);
-- Pré-cadastre as 10 mesas disponíveis
INSERT INTO mesa (numero) VALUES (1),(2),(3),(4),(5),(6),(7),(8),(9),(10);
