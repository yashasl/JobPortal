const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const adminRegister = async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
        return res.status(400).json({ message: 'All fields are required' });

    try {
        const existing = await db.query('SELECT * FROM admin WHERE email = $1', [email]);
        if (existing.rows.length > 0)
            return res.status(400).json({ message: 'Email already registered' });

        const hashedPassword = bcrypt.hashSync(password, 10);
        await db.query(
            'INSERT INTO admin (username, email, password) VALUES ($1, $2, $3)',
            [username, email, hashedPassword]
        );
        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Database error' });
    }
};

const adminLogin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ message: 'Email and password are required' });

    try {
        const result = await db.query('SELECT * FROM admin WHERE email = $1', [email]);
        if (result.rows.length === 0)
            return res.status(400).json({ message: 'Invalid email or password' });

        const admin = result.rows[0];
        const isMatch = bcrypt.compareSync(password, admin.password);
        if (!isMatch)
            return res.status(400).json({ message: 'Invalid email or password' });

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
    } catch (err) {
        res.status(500).json({ message: 'Database error' });
    }
};

const getAllApplications = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT a.id, a.status, a.applied_at,
                   u.name AS user_name, u.email AS user_email, u.skills AS user_skills,
                   j.title AS job_title, j.company
            FROM applications a
            JOIN users u ON a.user_id = u.id
            JOIN jobs j ON a.job_id = j.id
            ORDER BY a.applied_at DESC
        `);
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ message: 'Database error' });
    }
};

const updateApplicationStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    if (!['accepted', 'rejected'].includes(status))
        return res.status(400).json({ message: 'Invalid status' });

    try {
        const result = await db.query(
            'UPDATE applications SET status = $1 WHERE id = $2',
            [status, id]
        );
        if (result.rowCount === 0)
            return res.status(404).json({ message: 'Application not found' });
        res.status(200).json({ message: `Application ${status} successfully` });
    } catch (err) {
        res.status(500).json({ message: 'Database error' });
    }
};

module.exports = { adminRegister, adminLogin, getAllApplications, updateApplicationStatus };
