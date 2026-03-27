const API_URL = 'https://jobportal-api-xrb4.onrender.com/api';
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));
const adminToken = localStorage.getItem('adminToken');
const admin = JSON.parse(localStorage.getItem('admin'));

// ── NAVBAR ──
const navActions = document.getElementById('nav-actions');
const navJobsLink = document.getElementById('nav-jobs-link');

if (token && user) {
    navJobsLink.href = 'jobs.html';
    navActions.innerHTML = `
        <div class="nav-user-info">
            <span>👤 ${user.name}</span>
            <button class="btn-logout" onclick="logoutUser()">Logout</button>
        </div>`;
} else {
    navJobsLink.href = 'login.html';
    navActions.innerHTML = `
        <a href="login.html" class="btn-ghost">Login</a>
        <a href="signup.html" class="btn-fill">Sign Up</a>`;
}

// ── ADMIN DROPDOWN ──
const adminDropMenu = document.getElementById('admin-drop-menu');
if (adminToken && admin) {
    adminDropMenu.innerHTML = `<a href="admin-dashboard.html"><i class="fa-solid fa-gauge" style="margin-right:8px;color:var(--primary)"></i>Admin Panel</a>`;
} else {
    adminDropMenu.innerHTML = `
        <a href="admin-login.html"><i class="fa-solid fa-right-to-bracket" style="margin-right:8px;color:var(--primary)"></i>Login</a>
        <a href="admin-signup.html"><i class="fa-solid fa-user-plus" style="margin-right:8px;color:var(--primary)"></i>Sign Up</a>`;
}

function toggleAdminDropdown(e) {
    e.preventDefault();
    adminDropMenu.classList.toggle('open');
}
document.addEventListener('click', (e) => {
    if (!e.target.closest('.admin-dropdown')) adminDropMenu.classList.remove('open');
});

// ── HERO ACTIONS ──
const heroActions = document.getElementById('hero-actions');
if (token) {
    heroActions.innerHTML = `<a href="dashboard.html" class="hero-btn-primary">Go to Dashboard</a>`;
} else {
    heroActions.innerHTML = `
        <a href="signup.html" class="hero-btn-primary">Get Started Free</a>
        <a href="login.html" class="hero-btn-secondary">Login</a>`;
}

// ── HERO SEARCH ──
function heroSearch() {
    const q = document.getElementById('hero-search-input').value.trim();
    if (token) {
        window.location.href = `jobs.html${q ? '?q=' + encodeURIComponent(q) : ''}`;
    } else {
        window.location.href = 'login.html';
    }
}
document.getElementById('hero-search-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') heroSearch();
});

// ── JOB PREVIEW ──
async function loadPreviewJobs() {
    const grid = document.getElementById('preview-jobs-grid');
    const ctaDiv = document.getElementById('preview-cta');
    try {
        const res = await fetch(`${API_URL}/jobs`);
        const jobs = await res.json();
        if (!jobs.length) {
            grid.innerHTML = '<p class="no-jobs-msg">No jobs available yet. Check back soon!</p>';
            return;
        }
        const preview = jobs.slice(0, 6);
        grid.innerHTML = preview.map(job => `
            <div class="job-preview-card">
                <h3>${job.title}</h3>
                <p class="job-company"><i class="fa-solid fa-building"></i> ${job.company}</p>
                <p class="job-skills"><i class="fa-solid fa-code"></i> ${job.skills_required}</p>
                <p class="job-desc-preview">${job.description}</p>
                <div class="job-card-footer">
                    ${token
                        ? `<a href="job-apply.html?jobId=${job.id}" class="view-btn">View & Apply</a>`
                        : `<a href="login.html" class="view-btn">Login to Apply</a>`
                    }
                </div>
            </div>`).join('');

        if (jobs.length > 6) {
            ctaDiv.innerHTML = token
                ? `<a href="jobs.html">View All ${jobs.length} Jobs &rarr;</a>`
                : `<a href="login.html">View All Jobs &rarr;</a>`;
        }
    } catch (err) {
        grid.innerHTML = '<p class="no-jobs-msg">Could not load jobs. Make sure the server is running.</p>';
    }
}

// ── CTA BUTTONS ──
const ctaBtns = document.getElementById('cta-btns');
if (token) {
    ctaBtns.innerHTML = `<a href="jobs.html" class="cta-btn-white">Browse Jobs</a>`;
} else {
    ctaBtns.innerHTML = `
        <a href="signup.html" class="cta-btn-white">Create Free Account</a>
        <a href="login.html" class="cta-btn-outline">Login</a>`;
}

// ── FOOTER LINKS ──
const footerSeekers = document.getElementById('footer-seekers');
if (token) {
    footerSeekers.innerHTML = `
        <li><a href="jobs.html">Browse Jobs</a></li>
        <li><a href="dashboard.html">My Dashboard</a></li>`;
} else {
    footerSeekers.innerHTML = `
        <li><a href="login.html">Login</a></li>
        <li><a href="signup.html">Sign Up</a></li>
        <li><a href="jobs.html">Browse Jobs</a></li>`;
}

// ── LOGOUT ──
function logoutUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// ── NAVBAR SCROLL ──
window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 10);
});

// ── HAMBURGER ──
function toggleMenu() {
    document.getElementById('navLinks').classList.toggle('open');
}

loadPreviewJobs();
