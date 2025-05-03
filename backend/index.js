const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const PORT = 3060;
const app = express();
const SECRET_KEY = 'secret_key';
const db = new sqlite3.Database('./db/db.sqlite');

// Middleware
app.use(cors());
app.use(express.json());

// Database Setup
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            age INTEGER NOT NULL,
            grade INTEGER NOT NULL
        )
    `);

    db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
    )
`);
});


function generateAccessToken(user) {
    return jwt.sign(user, SECRET_KEY, { expiresIn: '1h' });
}

function generateRefreshToken(user) {
    return jwt.sign(user, SECRET_KEY, { expiresIn: '7d' });
}


const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Bearer <token>

  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};


app.get('/data', (req, res) => {
  res.json({ message: 'Hello from backend!' });
});

// Register Route
app.post('/signUp', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [username, hashedPassword],
        (err) => {
            if (err) {
                return res.status(400).json({ message: 'User already exists' });
            }
            res.json({ message: 'User registered successfully'});
        }
    );
});

// Login Route
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
        if (err || !user || !(await bcrypt.compare(password, user.password))) {
            return res.status(402).json({ message: 'Invalid credentials' });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        res.json({ accessToken, refreshToken });
    });
});

app.post('/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken;

    if (!refreshToken) return res.status(401).send('Refresh token missing');

    jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, user) => {
        if (err) return res.status(403).send('Invalid refresh token');

        const newAccessToken = generateAccessToken({ id: user.id, username: user.username });
        res.json({ accessToken: newAccessToken });
    });
});


// Routes
// Home Page - List Students
app.get('/students', authenticateToken, (req, res) => {
    const query = `SELECT * FROM students`;
    db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).send({ error: 'Failed to retrieve students.' });
    }
    res.status(200).send(rows);
  });
});


// Add Student Logic
app.post('/add', authenticateToken, (req, res) => {
    const { name, age, grade } = req.body;

    if (!name || !age || !grade) {
        return res.status(400).send({ error: 'Name, age, and grade are required.' });
    }

    const query = `INSERT INTO students (name, age, grade) VALUES (?, ?, ?)`;

    db.run(
        query,
        [name, age, grade],
        (err) => {
            if (err) {
      return res.status(500).send({ error: 'Failed to add student.' });
    }
    res.status(201).send({ id: this.lastID, name, age, grade });
        }
    );
});

// Edit Student Form
app.get('/edit/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM students WHERE id = ?', [id], (err, row) => {
        if (err) return console.error(err.message);
        res.json({student: row });
    });
});

// Update Student Logic
app.post('/edit/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { name, age, grade } = req.body;
    db.run(
        'UPDATE students SET name = ?, age = ?, grade = ? WHERE id = ?',
        [name, age, grade, id],
        (err) => {
            if (err) return console.error(err.message);
            res.redirect('/');
        }
    );
});

// Delete Student
app.delete('/delete/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM students WHERE id = ?';

    db.run(query, [id], function (err) {
    if (err) {
            console.error('Error deleting student:', err.message);
            return res.status(500).json({ error: 'Failed to delete student' });
        }

        if (this.changes === 0) {
            // No rows affected means the student was not found
            return res.status(404).json({ error: 'Student not found' });
        }

        // Success response
        res.status(200).json({ message: 'Student deleted successfully' });
        });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
