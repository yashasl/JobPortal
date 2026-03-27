const db = require('../config/db');

const addJob = (req, res) => {
    const { title, company, skills_required, description } = req.body;

    if (!title || !company || !skills_required || !description) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    db.query(
        'INSERT INTO jobs (title, company, skills_required, description) VALUES (?, ?, ?, ?)',
        [title, company, skills_required, description],
        (err, result) => {
            if (err) return res.status(500).json({ message: 'Error adding job' });
            res.status(201).json({ message: 'Job added successfully' });
        }
    );
};

const getJobs = (req, res) => {
    db.query('SELECT * FROM jobs', (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.status(200).json(results);
    });
};

const getJobById = (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM jobs WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        if (results.length === 0) return res.status(404).json({ message: 'Job not found' });
        res.status(200).json(results[0]);
    });
};

const deleteJob = (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM jobs WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error deleting job' });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Job not found' });
        res.status(200).json({ message: 'Job deleted successfully' });
    });
};

const applyJob = (req, res) => {
    const { job_id } = req.body;
    const user_id = req.user.id;

    if (!job_id) return res.status(400).json({ message: 'Job ID is required' });

    db.query(
        'SELECT * FROM applications WHERE user_id = ? AND job_id = ?',
        [user_id, job_id],
        (err, results) => {
            if (err) return res.status(500).json({ message: 'Database error' });
            if (results.length > 0) return res.status(400).json({ message: 'You have already applied for this job' });

            db.query(
                'INSERT INTO applications (user_id, job_id, status) VALUES (?, ?, ?)',
                [user_id, job_id, 'pending'],
                (err, result) => {
                    if (err) return res.status(500).json({ message: 'Error submitting application' });
                    res.status(201).json({ message: 'Application submitted successfully' });
                }
            );
        }
    );
};

const getUserApplications = (req, res) => {
    const user_id = req.user.id;
    db.query(
        'SELECT a.id, a.job_id, a.status, a.applied_at, j.title, j.company, j.skills_required, j.description FROM applications a JOIN jobs j ON a.job_id = j.id WHERE a.user_id = ?',
        [user_id],
        (err, results) => {
            if (err) return res.status(500).json({ message: 'Database error' });
            res.status(200).json(results);
        }
    );
};

module.exports = { addJob, getJobs, getJobById, deleteJob, applyJob, getUserApplications };
