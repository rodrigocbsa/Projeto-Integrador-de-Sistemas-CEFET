<?php
require_once 'vendor/autoload.php';
use phputil\router\Router;
use function phputil\cors\cors;

set_exception_handler('TratadoraDeExcecoes::handler');

$app = new Router();
$app->use(cors([ 'origin' => [ 'http://localhost:5173', 'http://localhost:8080' ] ] ));

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Host, Origin, Accept, Content-Type, Cookie, Authorization");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Expose-Headers: Content-Type, Content-Length, Set-Cookie");
 
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$pdo = Conexao::pdo();

require_once 'src/Middleware/middlewareIsGerenteouEstoquista.php';
require_once 'src/Middleware/middlewareIsGerente.php';
require_once 'src/Middleware/middlewareIsLogado.php';


/* Endpoints API de mesas */
require_once 'src/Mesa/Infra/Rotas.php';
/* Endpoints API de funcionários + extra cadastro de funcionários */
require_once 'src/Funcionario/Infra/Rotas.php';
/* Endpoints API de reservas */
require_once 'src/Reserva/Infra/Rotas.php';
/* Endpoints API de pedidos */
require_once 'src/Pedido/Infra/Rotas.php';
/* Endpoints API do dashboard (extra) */
require_once 'src/Dashboard/Infra/Rotas.php';
/* Endpoints API do estoque */
require_once 'src/Estoque/Infra/Rotas.php';



$app->listen();