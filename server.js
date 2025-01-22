// server.js (Main backend file)
require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const crypto = require('crypto');
const session = require('express-session');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'passmenot_secret', resave: false, saveUninitialized: true }));
app.set('view engine', 'ejs');

// Store encrypted passwords (Temp memory store for demo purposes)
const passwordStore = new Map();

// Generate one-time secure link
app.get('/', (req, res) => {
    res.render('index');
});

app.post('/generate', (req, res) => {
    const { password } = req.body;
    if (!password) return res.status(400).send('Password required');
    
    const id = crypto.randomBytes(8).toString('hex');
    const encryptedPass = crypto.createHash('sha256').update(password).digest('hex');
    passwordStore.set(id, encryptedPass);
    
    res.render('generated', { link: `${req.protocol}://${req.get('host')}/access/${id}` });
});

// Access shared password
app.get('/access/:id', (req, res) => {
    const id = req.params.id;
    const password = passwordStore.get(id);
    
    if (!password) return res.status(404).send('Link expired or invalid');
    passwordStore.delete(id); // Remove after access
    
    res.render('access', { password });
});

// Serve TailwindCSS integration
app.get('/tailwind.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'tailwind.css'));
});

server.listen(3000, () => console.log('Server running on http://localhost:3000'));
