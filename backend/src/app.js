require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());

const cors = require("cors");



const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const taskRoutes = require('./routes/tasks');

const authenticateToken = require('./middleware/authenticateToken');

// Auth endpoints:
app.use(cors({ origin: "http://localhost:5173" }));

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/tasks', authenticateToken, taskRoutes);

app.get('/', (req, res) => res.json({ ok: true }));

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
