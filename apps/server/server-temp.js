// Simple Express server with JWT auth (temporary workaround)
const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

app.disable('x-powered-by');

app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

// Login endpoint
app.post('/auth/login', (req, res) => {
    const { email, password } = req.body;

    const user = USERS[email];
    if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
        { email: user.email, sub: user.id, role: user.role },
        JWT_SECRET,
        { expiresIn: '1h' }
    );

    res.json({
        access_token: token,
        user: {
            id: user.id,
            email: user.email,
            role: user.role
        }
    });
});

// Protected profile endpoint
app.get('/auth/profile', (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.substring(7);

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        res.json(decoded);
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('\nTest credentials:');
    console.log('Email: admin@test.com');
    console.log('Password: password123');
    console.log('\nEndpoints:');
    console.log('- POST /auth/login');
    console.log('- GET /auth/profile (requires Bearer token)');
    console.log('- GET /health');
});
