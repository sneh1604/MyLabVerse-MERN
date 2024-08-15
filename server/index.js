const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const UserModel = require('./models/User');
const TestModel = require('./models/TestList'); // Import the Test model
const HemogramModel = require('./models/Hemogram'); // Import the Hemogram model

// Load environment variables from .env file
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(cookieParser());

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Failed to connect to MongoDB', err));

// User registration route
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    bcrypt.hash(password, 10)
    .then(hash => {
        UserModel.create({ name, email, password: hash })
        .then(user => {
            res.json({ message: 'Registration successful!' });
        })
        .catch(err => res.status(400).json({ error: err.message }));
    }).catch(error => res.status(500).json({ error: error.message }));
});

// User login route
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    UserModel.findOne({ email })
    .then(user => {
        if (user) {
            bcrypt.compare(password, user.password, (err, response) => {
                if (response) {
                    const token = jwt.sign({ email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
                    res.cookie('token', token, { httpOnly: true });
                    return res.json({ status: 'Success', role: user.role });
                } else {
                    return res.status(400).json({ message: 'Incorrect password' });
                }
            });
        } else {
            return res.status(404).json({ message: 'User not found' });
        }
    }).catch(err => res.status(500).json({ error: err.message }));
});

// Logout route
app.post('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({ message: 'Logout successful' });
});

// Middleware to verify if the user is authenticated
const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        } else {
            req.user = decoded; // Attach decoded token data to req.user
            next();
        }
    });
};

// Middleware to check admin role
const verifyAdmin = (req, res, next) => {
    if (req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ message: 'Access denied' });
    }
};

// Admin-only dashboard access
app.get('/dashboard', verifyUser, verifyAdmin, (req, res) => {
    res.json({ message: 'Welcome, Admin!' });
});

// Fetch all registered users (non-admins only)
app.get('/registered-users', verifyUser, verifyAdmin, (req, res) => {
    UserModel.find({ role: { $ne: 'admin' } })
    .then(users => res.json(users))
    .catch(err => res.status(500).json({ error: err.message }));
});

// Fetch all tests
app.get('/api/test-list', verifyUser, (req, res) => {
    TestModel.find()
    .then(tests => res.json(tests))
    .catch(err => res.status(500).json({ error: err.message }));
});

// Create a new test
app.post('/api/test-list', verifyUser, verifyAdmin, (req, res) => {
    const { name, description, cost, status, delete_flag } = req.body;
    TestModel.create({ name, description, cost, status, delete_flag })
    .then(test => res.json(test))
    .catch(err => res.status(400).json({ error: err.message }));
});

// Update an existing test
app.put('/api/test-list/:id', verifyUser, verifyAdmin, (req, res) => {
    const { id } = req.params;
    const { name, description, cost, status, delete_flag } = req.body;
    TestModel.findByIdAndUpdate(id, { name, description, cost, status, delete_flag, date_updated: new Date() }, { new: true })
    .then(test => res.json(test))
    .catch(err => res.status(400).json({ error: err.message }));
});

// Delete a test
app.delete('/api/test-list/:id', verifyUser, verifyAdmin, (req, res) => {
    const { id } = req.params;
    TestModel.findByIdAndDelete(id)
    .then(() => res.json({ message: 'Test deleted successfully' }))
    .catch(err => res.status(500).json({ error: err.message }));
});

// Create a new hemogram record
app.post('/api/hemogram', verifyUser, (req, res) => {
    HemogramModel.create(req.body)
    .then(data => res.json(data))
    .catch(err => res.status(400).json({ error: err.message }));
});

app.listen(4000, () => {
    console.log('Server is running on port 4000');
});
