const header = document.createElement('header');
header.classList.add('header');
header.innerHTML = 
`
        <div class="container-fluid">
            <div class="row">
                <div class="col-lg-5 col-md-5 col-6">
                <div class="header-left d-flex align-items-center">
                    <div class="menu-toggle-btn" style="margin: 0 5vw;">
                    <button id="menu-toggle" class="main-btn primary-btn btn-hover">
                        <i data-feather="menu"></i>
                    </button>
                    </div>
                </div>
                </div>
                <div class="col-lg-7 col-md-7 col-6">
                <div class="header-right">
                    <!-- profile start -->
                    <div class="profile-box ml-15">
                    <button class="dropdown-toggle bg-transparent border-0" type="button" id="profile"
                        data-bs-toggle="dropdown" aria-expanded="false">
                        <div class="profile-info">
                        <div class="info">
                            <div class="image">
                            <img src="../assets/images/profile/profile-image.png" alt="" />
                            </div>
                            <div>
                            <h6 class="fw-500">${sessionStorage.getItem('nome')}</h6>
                            <p>@${sessionStorage.getItem('usuario')} | ${sessionStorage.getItem('cargo')}</p>
                            </div>
                        </div>
                        </div>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="profile">
                        <li>
                        <div class="author-info flex items-center !p-1">
                            <div class="image">
                                <img src="../assets/images/profile/profile-image.png" alt="image">
                            </div>
                            <div class="content">
                                <h4 class="text-sm">${sessionStorage.getItem('nome')}</h4>
                                <a class="text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white text-xs">#${sessionStorage.getItem('id')}</a>
                            </div>
                        </div>
                        </li>
                        <li class="divider"></li>
                        <li>
                        <a href="funcionarios.html" name="Cadastrar Funcionários"> <i class="lni lni-exit"></i> Cadastrar Funcionários </a>
                        </li>
                        <li>
                        <form action="http://localhost:8080/logout" method="post">
                            <a id="sair" onclick="sessionStorage.clear();this.closest('form').submit();return false;">Sair<i class="ml-10" data-feather="log-out"></i></a>
                        </form>
                        </li>
                    </ul>
                    </div>
                    <!-- profile end -->
                </div>
                </div>
            </div>
        </div>
`;
document.getElementById('header-div').appendChild(header);
feather.replace();