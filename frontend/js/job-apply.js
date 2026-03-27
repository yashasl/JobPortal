const API_URL = 'http://127.0.0.1:3000/api';

const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));

if (!token || !user) window.location.href = 'login.html';

const params = new URLSearchParams(window.location.search);
const jobId = params.get('jobId');

if (!jobId) window.location.href = 'dashboard.html';

async function loadJobDetails() {
    try {
        const res = await fetch(`${API_URL}/jobs/${jobId}`);
        if (!res.ok) { window.location.href = 'dashboard.html'; return; }
        const job = await res.json();

        document.getElementById('job-details').innerHTML = `
            <h3>${job.title}</h3>
            <p><strong>Company:</strong> ${job.company}</p>
            <p><strong>Skills Required:</strong> ${job.skills_required}</p>
            <p><strong>Description:</strong> ${job.description}</p>
        `;
    } catch (err) {
        window.location.href = 'dashboard.html';
    }
}

document.getElementById('applyForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const cover_letter = document.getElementById('cover_letter').value;

    try {
        const res = await fetch(`${API_URL}/apply`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ job_id: jobId, cover_letter })
        });
        const data = await res.json();
        if (res.ok) {
            document.getElementById('success-msg').textContent = data.message;
            document.getElementById('error-msg').textContent = '';
            document.getElementById('applyForm').style.display = 'none';
            setTimeout(() => window.location.href = 'dashboard.html', 2000);
        } else {
            document.getElementById('error-msg').textContent = data.message;
            document.getElementById('success-msg').textContent = '';
        }
    } catch (err) {
        document.getElementById('error-msg').textContent = 'Server error. Please try again.';
    }
});

loadJobDetails();
