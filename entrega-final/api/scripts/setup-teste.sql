-- Rodar este script para configurar todo o banco de uma vez

/* estrutura */
DROP DATABASE IF EXISTS g6_tests;
CREATE DATABASE g6_tests;
USE g6_tests;


CREATE TABLE login(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(10) NOT NULL,
    senha VARCHAR(200) NOT NULL,
    sal VARCHAR(40) NOT NULL,
    pimenta VARCHAR(40) NOT NULL,
    CONSTRAINT unq_usuario__usuario UNIQUE (usuario)
) ENGINE=INNODB;

CREATE TABLE funcionario (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cargo ENUM('Atendente','Gerente','Estoquista') NOT NULL,
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
    mesa INT NOT NULL,
    pagamento VARCHAR(20) NOT NULL,
    CONSTRAINT fk_pedido__mesa FOREIGN KEY (mesa) REFERENCES mesa(id) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=INNODB;

CREATE TABLE pedido_item (
    pedido INT NOT NULL,
    item INT NOT NULL,
    quantidade INT NOT NULL,
    CONSTRAINT fk_pedido_item__pedido FOREIGN KEY (pedido) REFERENCES pedido(id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_pedido_item__item FOREIGN KEY (item) REFERENCES item(id) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=INNODB;

/*   
Se (reserva_concluida == 0 && reserva_cancelada == 0)  reserva futura 
Se (reserva_concluida == 0 && reserva_cancelada == 1) reserva cancelada, não há mais utilidade, a não ser estatística
Se (reserva_concluida == 1 && reserva_cancelada == 0) reserva aconteceu, útil para o gráfico
*/

CREATE TABLE produto(
    nome VARCHAR(50) NOT NULL,
    codigo VARCHAR(6) NOT NULL,
    ean_13 VARCHAR(13),
    vencimento DATE,
    categoria ENUM('externo','interno') NOT NULL, -- externos são vendáveis, internos são usados na produção
    medida ENUM('kg','un') NOT NULL,
    recebimento ENUM('caixa','engradado') NOT NULL,
    quantidade_recebimento INT DEFAULT 1 NOT NULL, -- 10 kg em caixas, 20 un em engradados ...
    CONSTRAINT unq_produto__codigo UNIQUE (codigo),
    CONSTRAINT unq_produto__ean_13 UNIQUE (ean_13)
) ENGINE=INNODB;

CREATE TABLE movimentacao(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    dia DATE DEFAULT (CURRENT_DATE) NOT NULL,
    hora TIME DEFAULT (CURRENT_TIME) NOT NULL,
    quantidade INT NOT NULL, -- contagem de produtos movimentados (quantos produtos) (listagem de movimentacao)
    motivo VARCHAR(100) NOT NULL, -- GROUP BY motivo: para cada produto movimentado, o mesmo motivo numa mesma movimentação!
    tipo ENUM('entrada','saida') NOT NULL
) ENGINE=INNODB;

CREATE TABLE produto_movimentado(
    total_anterior INT NOT NULL, -- (detalhes da movimentacao)
    total_posterior INT NOT NULL, -- (detalhes da movimentacao)
    codigo_produto VARCHAR(6) NOT NULL, -- (detalhes da movimentacao)
    movimentacao INT NOT NULL,
    CONSTRAINT fk_produto_movimentado__movimentacao FOREIGN KEY (movimentacao) REFERENCES movimentacao(id) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=INNODB;

-- MOVIMENTAÇÕES
/* Entrada no Estoque */
-- 1. somar estoque.estoque_atual do produto. é a quantidade de entrada * produto.estoque_minimo daquele produto
/* Saída no Estoque (ou Entrada na Dispensa/Lançamento) */
-- 1. verificar se a quantidade de saída do produto é >= que estoque.estoque_atual
-- 2. diminuir de estoque.estoque_atual
-- 3. somar dispensa.total
/* Saída na dispensa */
-- 1. verificar se a quantidade de saída do produto é maior ou igual a dispensa.total
-- 2. se sim, diminuir a quantidade de saída do produto de dispensa.total
-- 2.1. se não, estoque de dispensa indisponivel (necessário lançamento)

CREATE TABLE estoque(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    estoque_minimo INT DEFAULT 1 NOT NULL,
    estoque_atual INT DEFAULT 0 NOT NULL, -- saidas (-X), para a dispensa, recebe na dispensa como (-X) * produto.quantidade_recebimento
    codigo_produto VARCHAR(6) NOT NULL,
    CONSTRAINT fk_estoque__codigo_produto FOREIGN KEY (codigo_produto) REFERENCES produto(codigo) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=INNODB;

CREATE TABLE dispensa(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
    total INT DEFAULT 0 NOT NULL, -- saida da dispensa diminui uma unidade
    codigo_produto VARCHAR(6) NOT NULL,
    CONSTRAINT fk_dispensa__codigo_produto FOREIGN KEY (codigo_produto) REFERENCES produto(codigo) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=INNODB;


/* configuração */
DROP USER IF EXISTS 'g6_tests'@'localhost';
CREATE USER 'g6_tests'@'localhost' IDENTIFIED BY 'g6_tests';
GRANT ALL PRIVILEGES ON `g6_tests`.* TO 'g6_tests'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;
SHOW GRANTS FOR 'g6_tests'@'localhost';


/* dados iniciais */
use g6_tests;

-- Pré-cadastre pelo menos 3 funcionários (OBS: fiz cadastro de usuários. Por isso apenas o gerente está com a conta. Ele pode cadastrar funcionários.)
INSERT INTO login (usuario,senha,sal,pimenta) VALUES 
('teste','teste','aa','aa');
INSERT INTO funcionario (nome,cargo,login) VALUES ('John Doe Corin Test','Gerente',1);

-- Pré-cadastre as 10 mesas disponíveis
INSERT INTO mesa (numero) VALUES (1),(2),(3),(4),(5),(6),(7),(8),(9),(10);

-- Pré-cadastre produtos de diferentes tipos 
-- (OBS: todos começam com 0 quantia. fazer as movimentações no sistema)
INSERT INTO produto(nome,codigo,ean_13,categoria,medida,recebimento,quantidade_recebimento) 
VALUES ('Água s/ Gás','000001','4640948639618','externo','un','engradado',20);
INSERT INTO produto(nome,codigo,categoria,medida,quantidade_recebimento,recebimento) 
VALUES ('Tempero','000002','interno','un',50,'caixa');
INSERT INTO produto(nome,codigo,ean_13,categoria,medida,quantidade_recebimento,recebimento) 
VALUES ('Água c/ Gás','000003','2936181503079','externo','un',20,'engradado');
INSERT INTO produto(nome,codigo,categoria,medida,quantidade_recebimento,recebimento) 
VALUES ('Tomate','000004','interno','kg',10,'caixa');
INSERT INTO estoque(codigo_produto) VALUES ('000001'),('000003');
INSERT INTO estoque(codigo_produto) VALUES ('000002'),('000004');
INSERT INTO dispensa(codigo_produto) VALUES ('000001'),('000003');
INSERT INTO dispensa(codigo_produto) VALUES ('000002'),('000004');

-- não altere nada após esta linha /*****************EOF**********************/
