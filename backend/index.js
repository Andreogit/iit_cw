const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const { Pool } = require('pg');
const fs = require('fs');

const PORT = process.env.PORT || 5000;
const app = express();
const SECRET_KEY = 'secret_key';

const db = new Pool({
  host: 'database-1.c74ws6kw0ai6.eu-north-1.rds.amazonaws.com',
  user: 'db_admin',
  password: 'master_password',
  database: 'students',
  port: 5432,
  ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync(__dirname + '/certs/global-bundle.pem').toString(),
  },
});

db.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('Connection error', err.stack));

// Middleware
app.use(cors());
app.use(express.json());

// Database Setup
(async () => {
    await db.query(`
      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        age INTEGER NOT NULL,
        grade INTEGER NOT NULL
      );
    `);
  
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `);
  })();


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
    if (!username || !password)
      return res.status(400).json({ message: 'Username and password are required' });
  
    const hashedPassword = await bcrypt.hash(password, 10);
  
    try {
      await db.query(
        'INSERT INTO users (username, password) VALUES ($1, $2)',
        [username, hashedPassword]
      );
      res.json({ message: 'User registered successfully' });
    } catch (err) {
      res.status(400).json({ message: 'User already exists' });
    }
  });
  
  app.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
      const user = result.rows[0];
  
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(402).json({ message: 'Invalid credentials' });
      }
  
      const accessToken = generateAccessToken({ id: user.id, username: user.username });
      const refreshToken = generateRefreshToken({ id: user.id, username: user.username });
  
      res.json({ accessToken, refreshToken });
    } catch (err) {
      res.status(500).json({ message: 'Login error' });
    }
  });
  
  app.post('/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) return res.status(401).send('Refresh token missing');
  
    jwt.verify(refreshToken, SECRET_KEY, (err, user) => {
      if (err) return res.status(403).send('Invalid refresh token');
  
      const newAccessToken = generateAccessToken({ id: user.id, username: user.username });
      res.json({ accessToken: newAccessToken });
    });
  });
  
  // Student Routes
  
  app.get('/students', authenticateToken, async (req, res) => {
    try {
      const result = await db.query('SELECT * FROM students');
      res.status(200).send(result.rows);
    } catch (err) {
      res.status(500).send({ error: 'Failed to retrieve students.' });
    }
  });
  
  app.post('/add', authenticateToken, async (req, res) => {
    const { name, age, grade } = req.body;
    if (!name || !age || !grade)
      return res.status(400).send({ error: 'Name, age, and grade are required.' });
  
    try {
      const result = await db.query(
        'INSERT INTO students (name, age, grade) VALUES ($1, $2, $3) RETURNING id',
        [name, age, grade]
      );
      res.status(201).send({ id: result.rows[0].id, name, age, grade });
    } catch (err) {
      res.status(500).send({ error: 'Failed to add student.' });
    }
  });
  
  app.get('/edit/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
      const result = await db.query('SELECT * FROM students WHERE id = $1', [id]);
      res.json({ student: result.rows[0] });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch student' });
    }
  });
  
  app.post('/edit/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { name, age, grade } = req.body;
  
    try {
      await db.query(
        'UPDATE students SET name = $1, age = $2, grade = $3 WHERE id = $4',
        [name, age, grade, id]
      );
      res.status(200).send({ message: 'Student updated successfully' });
    } catch (err) {
      res.status(500).send({ error: 'Failed to update student' });
    }
  });
  
  app.delete('/delete/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await db.query('DELETE FROM students WHERE id = $1', [id]);
  
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Student not found' });
      }
  
      res.status(200).json({ message: 'Student deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete student' });
    }
  });
  
  // Start Server
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });