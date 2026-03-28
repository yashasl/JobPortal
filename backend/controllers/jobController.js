const db = require('../config/db');

const addJob = async (req, res) => {
    const { title, company, skills_required, description } = req.body;
    if (!title || !company || !skills_required || !description)
        return res.status(400).json({ message: 'All fields are required' });

    try {
        await db.query(
            'INSERT INTO jobs (title, company, skills_required, description) VALUES ($1, $2, $3, $4)',
            [title, company, skills_required, description]
        );
        res.status(201).json({ message: 'Job added successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error adding job' });
    }
};

const getJobs = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM jobs');
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ message: 'Database error' });
    }
};

const getJobById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('SELECT * FROM jobs WHERE id = $1', [id]);
        if (result.rows.length === 0)
            return res.status(404).json({ message: 'Job not found' });
        res.status(200).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Database error' });
    }
};

const deleteJob = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM jobs WHERE id = $1', [id]);
        if (result.rowCount === 0)
            return res.status(404).json({ message: 'Job not found' });
        res.status(200).json({ message: 'Job deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting job' });
    }
};

const applyJob = async (req, res) => {
    const { job_id } = req.body;
    const user_id = req.user.id;
    if (!job_id) return res.status(400).json({ message: 'Job ID is required' });

    try {
        const existing = await db.query(
            'SELECT * FROM applications WHERE user_id = $1 AND job_id = $2',
            [user_id, job_id]
        );
        if (existing.rows.length > 0)
            return res.status(400).json({ message: 'You have already applied for this job' });

        await db.query(
            'INSERT INTO applications (user_id, job_id, status) VALUES ($1, $2, $3)',
            [user_id, job_id, 'pending']
        );
        res.status(201).json({ message: 'Application submitted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error submitting application' });
    }
};

const getUserApplications = async (req, res) => {
    const user_id = req.user.id;
    try {
        const result = await db.query(
            `SELECT a.id, a.job_id, a.status, a.applied_at,
                    j.title, j.company, j.skills_required, j.description
             FROM applications a
             JOIN jobs j ON a.job_id = j.id
             WHERE a.user_id = $1`,
            [user_id]
        );
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ message: 'Database error' });
    }
};

module.exports = { addJob, getJobs, getJobById, deleteJob, applyJob, getUserApplications };
