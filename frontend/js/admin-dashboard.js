const API_URL = 'https://jobportal-api-xrb4.onrender.com/api';

const adminToken = localStorage.getItem('adminToken');
const admin = JSON.parse(localStorage.getItem('admin'));

if (!adminToken) {
    window.location.href = 'admin-login.html';
}

// Load all jobs
function loadJobs() {
    fetch(`${API_URL}/jobs`)
        .then(res => res.json())
        .then(jobs => {
            const jobsList = document.getElementById('jobs-list');
            if (jobs.length === 0) {
                jobsList.innerHTML = '<p class="no-jobs">No jobs added yet.</p>';
                return;
            }
            jobsList.innerHTML = jobs.map(job => `
                <div class="admin-job-item">
                    <div class="job-info">
                        <h3>${job.title}</h3>
                        <p>${job.company} | ${job.skills_required}</p>
                    </div>
                    <button class="delete-btn" onclick="deleteJob(${job.id})"><i class="fa-solid fa-trash"></i> Delete</button>
                </div>
            `).join('');
        })
        .catch(err => console.error('Error loading jobs:', err));
}

// Add job
document.getElementById('addJobForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const company = document.getElementById('company').value;
    const skills_required = document.getElementById('skills_required').value;
    const description = document.getElementById('description').value;

    try {
        const res = await fetch(`${API_URL}/add-job`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify({ title, company, skills_required, description })
        });
        const data = await res.json();
        if (res.ok) {
            document.getElementById('job-success').textContent = data.message;
            document.getElementById('job-error').textContent = '';
            document.getElementById('addJobForm').reset();
            loadJobs();
        } else {
            document.getElementById('job-error').textContent = data.message;
            document.getElementById('job-success').textContent = '';
        }
    } catch (err) {
        document.getElementById('job-error').textContent = 'Server error. Please try again.';
    }
});

// Delete job
async function deleteJob(id) {
    if (!confirm('Are you sure you want to delete this job?')) return;

    try {
        const res = await fetch(`${API_URL}/delete-job/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        const data = await res.json();
        if (res.ok) {
            loadJobs();
        } else {
            alert(data.message);
        }
    } catch (err) {
        alert('Server error. Please try again.');
    }
}

// Load all applications
async function loadApplications() {
    try {
        const res = await fetch(`${API_URL}/admin/applications`, {
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        const apps = await res.json();
        const list = document.getElementById('applications-list');

        if (apps.length === 0) {
            list.innerHTML = '<p class="no-jobs">No applications yet.</p>';
            return;
        }

        list.innerHTML = apps.map(app => `
            <div class="application-item">
                <div class="app-info">
                    <h3>${app.job_title} <span class="company-tag">${app.company}</span></h3>
                    <p><strong>Applicant:</strong> ${app.user_name} (${app.user_email})</p>
                    <p><strong>Skills:</strong> ${app.user_skills || 'N/A'}</p>
                    <p><strong>Applied:</strong> ${new Date(app.applied_at).toLocaleDateString()}</p>
                </div>
                <div class="app-actions">
                    <span class="status-badge status-${app.status}">${app.status}</span>
                    ${app.status === 'pending' ? `
                        <button class="accept-btn" onclick="updateStatus(${app.id}, 'accepted')">Accept</button>
                        <button class="reject-btn" onclick="updateStatus(${app.id}, 'rejected')">Reject</button>
                    ` : ''}
                </div>
            </div>
        `).join('');
    } catch (err) {
        document.getElementById('applications-list').innerHTML = '<p class="no-jobs">Failed to load applications.</p>';
    }
}

// Accept or reject application
async function updateStatus(id, status) {
    try {
        const res = await fetch(`${API_URL}/admin/applications/${id}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify({ status })
        });
        const data = await res.json();
        if (res.ok) loadApplications();
        else alert(data.message);
    } catch (err) {
        alert('Server error. Please try again.');
    }
}

loadJobs();
loadApplications();
