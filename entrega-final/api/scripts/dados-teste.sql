-- Popular banco com dados de teste
-- (não alterar o que já foi escrito neste arquivo)
-- (apenas adicionar para mais testes, sem gerar conflitos!)

-- limpar dados
DELETE FROM g6_tests.funcionario_reserva;
ALTER TABLE g6_tests.funcionario_reserva AUTO_INCREMENT = 1;
DELETE FROM g6_tests.reserva;
ALTER TABLE g6_tests.reserva AUTO_INCREMENT = 1;

DELETE FROM g6_tests.pedido_item;
ALTER TABLE g6_tests.pedido_item AUTO_INCREMENT = 1;
DELETE FROM g6_tests.pedido;
ALTER TABLE g6_tests.pedido AUTO_INCREMENT = 1;
DELETE FROM g6_tests.item;
ALTER TABLE g6_tests.item AUTO_INCREMENT = 1;


-- reservas realizadas
INSERT INTO reserva
(reserva_concluida,nome_cliente,telefone,dia,hora,mesa,funcionario) VALUES 
(1,"Cliente Ciclano","22000099999","2025-01-01","11:00",1,1),
(1,"Cliente Ciclano","22000099999","2025-01-02","11:00",2,1),
(0,"Cliente Ciclano","22000099999","2025-01-20","11:00",4,1),
(0,"Cliente Ciclano","22000099999","2025-01-20","11:00",5,1);
-- (para o dia 01, o total deve dar 100; 02, 200; 20, 400)
-- (para o funcionario o total deve dar 700)

-- associações
INSERT INTO funcionario_reserva VALUES 
(1,1),
(1,2),
(1,3);

-- pedidos realizados pelas reservas
INSERT INTO pedido 
(total,mesa,pagamento) 
VALUES 
(50,1,'PIX'),
(50,1,'PIX'),
(200,2,'PIX'),
(400,4,'PIX');

INSERT INTO item (preco,descricao,categoria) 
VALUES 
(10.00,"Item 1","Principal"),
(10.00,"Item 2","Sobremesa"),
(100.00,"Item 3","Principal"),
(400.00,"Item 4","Principal");

-- associações
INSERT INTO pedido_item (pedido,item,quantidade) 
VALUES 
(1,1,5),
(2,2,5),
(3,3,2),
(4,4,1);
-- (para a categoria Principal, o total deverá ser 10 * 5 + 100 * 2 + 400 * 1 = 650.00)
-- (para a categoria Sobremesa, o total deverá ser 10 * 5 = 50.00)




-- reservas não realizadas
INSERT INTO reserva
(nome_cliente,telefone,dia,hora,mesa,funcionario) VALUES 
("Cliente Ciclano","22000099999","2025-01-29","11:00",10,1),
("Cliente Ciclano","22000099999","2025-01-29","11:00",9,1),
("Cliente Ciclano","22000099999","2025-01-31","11:00",10,1);

-- associações
INSERT INTO funcionario_reserva VALUES 
(1,5),
(1,6),
(1,7);
