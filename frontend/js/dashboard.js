const API_URL = 'http://127.0.0.1:3000/api';

const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));

if (!token || !user) {
    window.location.href = 'login.html';
} else {
    document.getElementById('profile-name').textContent = user.name;
    document.getElementById('profile-email').textContent = user.email;
    document.getElementById('profile-skills').textContent = user.skills || 'No skills added';
}

async function loadApplications() {
    try {
        const res = await fetch(`${API_URL}/my-applications`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const apps = await res.json();
        const list = document.getElementById('applications-list');
        if (apps.length === 0) {
            list.innerHTML = '<p class="no-jobs">You have not applied to any jobs yet.</p>';
            return;
        }
        list.innerHTML = apps.map(app => `
            <div class="application-item">
                <div class="job-info">
                    <h3>${app.title}</h3>
                    <p><strong>${app.company}</strong> | Skills: ${app.skills_required}</p>
                </div>
                <span class="status-badge status-${app.status}">${app.status}</span>
            </div>
        `).join('');
    } catch (err) {
        document.getElementById('applications-list').innerHTML = '<p class="no-jobs">Failed to load applications.</p>';
    }
}

loadApplications();
