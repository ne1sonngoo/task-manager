const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require('../db');

const router = express.Router();

/**
 * POST /auth/register
 * Body: { name, email, password }
 */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "name, email and password required" });
    }

    // check if email already exists
    const existing = await pool.query("SELECT id FROM users WHERE email=$1", [
      email,
    ]);

    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "email already exists" });
    }

    // hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // insert user into YOUR schema (name, email, password_hash)
    const result = await pool.query(
      "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, passwordHash]
    );

    return res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
});

/**
 * POST /auth/login
 * Body: { email, password }
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "email and password required" });
    }

    // find user by email
    const result = await pool.query(
      "SELECT id, name, email, password_hash FROM users WHERE email=$1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "invalid credentials" });
    }

    const user = result.rows[0];

    // if user exists but has no password set
    if (!user.password_hash) {
      return res
        .status(400)
        .json({ error: "user has no password set (password_hash is NULL)" });
    }

    // compare plain password to stored hash
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: "invalid credentials" });
    }

    // sign JWT (include what you want in payload)
    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    return res.json({ accessToken });
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
});

module.exports = router;
