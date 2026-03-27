function renderNavbar() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    const adminToken = localStorage.getItem('adminToken');
    const admin = JSON.parse(localStorage.getItem('admin'));

    const currentPage = window.location.pathname.split('/').pop();
    const isAdminPage = ['admin-dashboard.html', 'admin-login.html', 'admin-signup.html'].includes(currentPage);
    const isActive = (page) => currentPage === page ? 'active' : '';

    // ── NAV LINKS ──
    let navLinks = '';
    if (isAdminPage) {
        navLinks = `
            <li><a href="index.html" class="${isActive('index.html')}">Home</a></li>
            <li><a href="admin-login.html" class="${isActive('admin-login.html')}">Admin Login</a></li>
            <li><a href="admin-signup.html" class="${isActive('admin-signup.html')}">Admin Signup</a></li>
            ${adminToken ? `<li><a href="admin-dashboard.html" class="${isActive('admin-dashboard.html')}">Admin Panel</a></li>` : ''}`;
    } else {
        navLinks = `
            <li><a href="index.html" class="${isActive('index.html')}">Home</a></li>
            ${token ? `<li><a href="jobs.html" class="${isActive('jobs.html')}">Find Jobs</a></li>` : ''}
            ${token ? `<li><a href="dashboard.html" class="${isActive('dashboard.html')}">Dashboard</a></li>` : ''}
            <li class="admin-dropdown">
                <a href="#" onclick="toggleAdminDropdown(event)">Admin <i class="fa-solid fa-chevron-down" style="font-size:11px"></i></a>
                <div class="admin-drop-menu" id="admin-drop-menu">
                    ${adminToken && admin
                        ? `<a href="admin-dashboard.html"><i class="fa-solid fa-gauge" style="margin-right:8px;color:var(--primary)"></i>Admin Panel</a>`
                        : `<a href="admin-login.html"><i class="fa-solid fa-right-to-bracket" style="margin-right:8px;color:var(--primary)"></i>Login</a>
                           <a href="admin-signup.html"><i class="fa-solid fa-user-plus" style="margin-right:8px;color:var(--primary)"></i>Sign Up</a>`
                    }
                </div>
            </li>`;
    }

    // ── RIGHT ACTIONS ──
    let navActions = '';
    if (isAdminPage) {
        if (adminToken && admin) {
            navActions = `
                <div class="nav-user-info">
                    <span>👤 ${admin.username}</span>
                    <button class="btn-logout" onclick="logoutAdmin()">Logout</button>
                </div>`;
        } else {
            navActions = `
                <a href="admin-login.html" class="btn-ghost">Login</a>
                <a href="admin-signup.html" class="btn-fill">Sign Up</a>`;
        }
    } else {
        if (token && user) {
            navActions = `
                <div class="nav-user-info">
                    <span>👤 ${user.name}</span>
                    <button class="btn-logout" onclick="logoutUser()">Logout</button>
                </div>`;
        } else {
            navActions = `
                <a href="login.html" class="btn-ghost">Login</a>
                <a href="signup.html" class="btn-fill">Sign Up</a>`;
        }
    }

    const navHTML = `
        <nav class="navbar" id="navbar">
            <div class="nav-container">
                <a href="index.html" class="nav-logo"><i class="fa-solid fa-briefcase"></i> Job<span>Portal</span></a>
                <ul class="nav-links" id="navLinks">
                    ${navLinks}
                </ul>
                <div class="nav-actions">${navActions}</div>
                <button class="hamburger" id="hamburger" onclick="toggleMenu()"><i class="fa-solid fa-bars"></i></button>
            </div>
        </nav>`;

    document.body.insertAdjacentHTML('afterbegin', navHTML);

    // scroll effect
    window.addEventListener('scroll', () => {
        document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 10);
    });
}

function logoutUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

function logoutAdmin() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    window.location.href = 'index.html';
}

function toggleMenu() {
    document.getElementById('navLinks').classList.toggle('open');
}

function toggleAdminDropdown(e) {
    e.preventDefault();
    const menu = document.getElementById('admin-drop-menu');
    if (menu) menu.classList.toggle('open');
}

document.addEventListener('click', (e) => {
    if (!e.target.closest('.admin-dropdown')) {
        const menu = document.getElementById('admin-drop-menu');
        if (menu) menu.classList.remove('open');
    }
});

renderNavbar();
