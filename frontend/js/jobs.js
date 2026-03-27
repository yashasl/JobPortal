const API_URL = 'http://127.0.0.1:3000/api';

const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));

if (!token || !user) window.location.href = 'login.html';

let allJobs = [];
let appliedJobIds = [];

function getUserSkills() {
    return (user.skills || '').toLowerCase().split(',').map(s => s.trim()).filter(Boolean);
}

function isSkillMatch(jobSkills) {
    const userSkills = getUserSkills();
    if (!userSkills.length) return false;
    return jobSkills.toLowerCase().split(',').map(s => s.trim()).some(s => userSkills.includes(s));
}

function renderJobs(jobs) {
    const jobsList = document.getElementById('jobs-list');
    if (jobs.length === 0) {
        jobsList.innerHTML = '<p class="no-jobs">No jobs found.</p>';
        return;
    }
    jobsList.innerHTML = jobs.map(job => {
        const matched = isSkillMatch(job.skills_required);
        const alreadyApplied = appliedJobIds.includes(job.id);
        return `
        <div class="job-item ${matched ? 'skill-match' : ''}">
            <div class="job-info">
                <h3>${job.title} ${matched ? '<span class="match-badge">Skill Match</span>' : ''}</h3>
                <p><strong>${job.company}</strong></p>
                <p class="skills-tag">Skills: ${job.skills_required}</p>
                <p class="job-desc">${job.description}</p>
            </div>
            <button class="apply-btn ${alreadyApplied ? 'applied' : ''}" onclick="goToApply(${job.id})" ${alreadyApplied ? 'disabled' : ''}>
                ${alreadyApplied ? 'Applied' : 'Apply Now'}
            </button>
        </div>`;
    }).join('');
}

function filterJobs() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const filtered = allJobs.filter(job =>
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query)
    );
    renderJobs(filtered);
}

function goToApply(jobId) {
    window.location.href = `job-apply.html?jobId=${jobId}`;
}

async function loadApplications() {
    try {
        const res = await fetch(`${API_URL}/my-applications`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const apps = await res.json();
        appliedJobIds = apps.map(a => a.job_id);
    } catch (err) {}
}

async function loadJobs() {
    try {
        const res = await fetch(`${API_URL}/jobs`);
        allJobs = await res.json();
        renderJobs(allJobs);
    } catch (err) {
        document.getElementById('jobs-list').innerHTML = '<p class="no-jobs">Failed to load jobs.</p>';
    }
}

async function init() {
    await loadApplications();
    await loadJobs();
}

init();
