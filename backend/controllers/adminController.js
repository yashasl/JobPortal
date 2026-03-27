const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const adminRegister = (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    db.query('SELECT * FROM admin WHERE email = ?', [email], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        if (results.length > 0) return res.status(400).json({ message: 'Email already registered' });

        const hashedPassword = bcrypt.hashSync(password, 10);

        db.query(
            'INSERT INTO admin (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword],
            (err, result) => {
                if (err) return res.status(500).json({ message: 'Error creating admin' });
                res.status(201).json({ message: 'Admin registered successfully' });
            }
        );
    });
};

const adminLogin = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    db.query('SELECT * FROM admin WHERE email = ?', [email], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        if (results.length === 0) return res.status(400).json({ message: 'Invalid email or password' });

        const admin = results[0];
        const isMatch = bcrypt.compareSync(password, admin.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

        const token = jwt.sign(
            { id: admin.id, email: admin.email, role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            admin: { id: admin.id, username: admin.username, email: admin.email }
        });
    });
};

const getAllApplications = (req, res) => {
    db.query(
        `SELECT a.id, a.status, a.applied_at,
                u.name AS user_name, u.email AS user_email, u.skills AS user_skills,
                j.title AS job_title, j.company
         FROM applications a
         JOIN users u ON a.user_id = u.id
         JOIN jobs j ON a.job_id = j.id
         ORDER BY a.applied_at DESC`,
        (err, results) => {
            if (err) return res.status(500).json({ message: 'Database error' });
            res.status(200).json(results);
        }
    );
};

const updateApplicationStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    db.query('UPDATE applications SET status = ? WHERE id = ?', [status, id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Application not found' });
        res.status(200).json({ message: `Application ${status} successfully` });
    });
};

module.exports = { adminRegister, adminLogin, getAllApplications, updateApplicationStatus };
