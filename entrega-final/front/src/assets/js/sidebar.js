
const aside = document.createElement('aside');
aside.classList.add('sidebar-nav-wrapper');
aside.innerHTML = `
      <div class="navbar-logo">
        <a href="dashboard.html">
          <img src="../assets/images/logo/logo.svg" alt="logo" />
        </a>
      </div>
      <nav class="sidebar-nav">
        <ul>
            <li class="nav-item nav-item-has-children">
                <a
                href="#0"
                data-bs-toggle="collapse"
                data-bs-target="#ddmenu_1"
                aria-controls="ddmenu_1"
                aria-expanded="false"
                aria-label="Toggle navigation"
                >
                    <span class="icon">
                        <i data-feather="pie-chart"></i>
                    </span>
                    <span class="text">Home</span>
                </a>
                <ul id="ddmenu_1" class="collapse dropdown-nav">
                    <li>
                        <a href="dashboard.html"> Página Inicial </a>
                        <a href="relatorios.html"> Relatórios (Gerente) </a>
                        <a href="funcionarios.html"> Cadastrar Funcionários (Gerente) </a>
                    </li>
                </ul>
            </li>

            <span class="divider">
                <hr />
            </span>

            <li class="nav-item nav-item-has-children">
                <a href="#0" class="collapsed" data-bs-toggle="collapse" data-bs-target="#ddmenu_5" aria-controls="ddmenu_5"
                aria-expanded="false" aria-label="Toggle navigation">
                <span class="icon">
                    <i data-feather="file-text"></i>
                </span>
                <span class="text"> Reservas </span>
                </a>
                <ul id="ddmenu_5" class="collapse dropdown-nav">
                <li>
                    <a href="reservas.html"> Cadastro </a>
                    <a href="pedidos.html"> Adicionar pedido </a>
                </li>
                </ul>
            </li>

            <span class="divider">
                <hr />
            </span>

            <li class="nav-item nav-item-has-children">
                <a href="#0" class="collapsed" data-bs-toggle="collapse" data-bs-target="#ddmenu_5" aria-controls="ddmenu_5"
                aria-expanded="false" aria-label="Toggle navigation">
                <span class="icon">
                    <i data-feather="database"></i>
                </span>
                <span class="text"> Estoque </span>
                </a>
                <ul id="ddmenu_5" class="collapse dropdown-nav">
                <li>
                    <a href="estoque-entrada.html"> Entrada </a>
                    <a href="estoque-saida.html"> Saída </a>
                    <a href="historico.html"> Histórico </a>
                    <a href="controle.html"> Controle </a>
                </li>
                </ul>
            </li>

            </ul>
        </nav>
`;
document.getElementById('sidebar-div').appendChild(aside);
