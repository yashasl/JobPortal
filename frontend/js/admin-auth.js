const API_URL = 'http://127.0.0.1:3000/api';

// Admin Signup
const adminSignupForm = document.getElementById('adminSignupForm');
if (adminSignupForm) {
    adminSignupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const res = await fetch(`${API_URL}/admin/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });
            const data = await res.json();
            if (res.ok) {
                document.getElementById('success-msg').textContent = data.message;
                document.getElementById('error-msg').textContent = '';
                setTimeout(() => window.location.href = 'admin-login.html', 1500);
            } else {
                document.getElementById('error-msg').textContent = data.message;
                document.getElementById('success-msg').textContent = '';
            }
        } catch (err) {
            document.getElementById('error-msg').textContent = 'Server error. Please try again.';
        }
    });
}

// Admin Login
const adminLoginForm = document.getElementById('adminLoginForm');
if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const res = await fetch(`${API_URL}/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('adminToken', data.token);
                localStorage.setItem('admin', JSON.stringify(data.admin));
                document.getElementById('success-msg').textContent = 'Login successful! Redirecting...';
                document.getElementById('error-msg').textContent = '';
                setTimeout(() => window.location.href = 'admin-dashboard.html', 1500);
            } else {
                document.getElementById('error-msg').textContent = data.message;
                document.getElementById('success-msg').textContent = '';
            }
        } catch (err) {
            document.getElementById('error-msg').textContent = 'Server error. Please try again.';
        }
    });
}
