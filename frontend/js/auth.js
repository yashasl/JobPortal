const API_URL = 'https://jobportal-api-xrb4.onrender.com/api';

// Signup
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const skills = document.getElementById('skills').value;

        try {
            const res = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, skills })
            });
            const data = await res.json();
            if (res.ok) {
                document.getElementById('success-msg').textContent = data.message;
                document.getElementById('error-msg').textContent = '';
                setTimeout(() => window.location.href = 'login.html', 1500);
            } else {
                document.getElementById('error-msg').textContent = data.message;
                document.getElementById('success-msg').textContent = '';
            }
        } catch (err) {
            document.getElementById('error-msg').textContent = 'Server error. Please try again.';
        }
    });
}

// Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const res = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                document.getElementById('success-msg').textContent = 'Login successful! Redirecting...';
                document.getElementById('error-msg').textContent = '';
                setTimeout(() => window.location.href = 'dashboard.html', 1500);
            } else {
                document.getElementById('error-msg').textContent = data.message;
                document.getElementById('success-msg').textContent = '';
            }
        } catch (err) {
            document.getElementById('error-msg').textContent = 'Server error. Please try again.';
        }
    });
}
