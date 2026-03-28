const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    const { name, email, password, skills } = req.body;
    if (!name || !email || !password)
        return res.status(400).json({ message: 'Name, email and password are required' });

    try {
        const existing = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existing.rows.length > 0)
            return res.status(400).json({ message: 'Email already registered' });

        const hashedPassword = bcrypt.hashSync(password, 10);
        await db.query(
            'INSERT INTO users (name, email, password, skills) VALUES ($1, $2, $3, $4)',
            [name, email, hashedPassword, skills || '']
        );
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Database error' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ message: 'Email and password are required' });

    try {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0)
            return res.status(400).json({ message: 'Invalid email or password' });

        const user = result.rows[0];
        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch)
            return res.status(400).json({ message: 'Invalid email or password' });

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
        res.status(200).json({
            message: 'Login successful',
            token,
            user: { id: user.id, name: user.name, email: user.email, skills: user.skills }
        });
    } catch (err) {
        res.status(500).json({ message: 'Database error' });
    }
};

module.exports = { register, login };
