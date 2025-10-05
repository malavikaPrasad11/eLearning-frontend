// backend/index.js

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
require("dotenv").config();

// Auth0
const { expressjwt: jwt } = require("express-jwt");
const jwksRsa = require("jwks-rsa");

const app = express();
const port = process.env.PORT || 3000;

// -------------------- Middleware -------------------- //
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// -------------------- SQLite Database -------------------- //
const dbPath = path.resolve(__dirname, "database.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error("❌ SQLite connection error:", err);
  else console.log("✅ Connected to database!");
});

// Create tables if they don't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS Users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS Payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      courseName TEXT,
      price REAL,
      paymentStatus TEXT,
      date DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS Feedbacks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      image TEXT,
      rating INTEGER,
      comment TEXT,
      date DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// -------------------- Routes -------------------- //

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString(), port });
});

// Save payment info
app.post("/payment/save", (req, res) => {
  const { courseName, price } = req.body;
  db.run(
    `INSERT INTO Payments (courseName, price, paymentStatus) VALUES (?, ?, ?)`,
    [courseName, price, "Success"],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: this.lastID });
    }
  );
});

// Add new feedback
app.post("/feedback/new", (req, res) => {
  const { name, image, rating, comment } = req.body;
  db.run(
    `INSERT INTO Feedbacks (name, image, rating, comment) VALUES (?, ?, ?, ?)`,
    [name, image || "default.png", rating, comment],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: this.lastID });
    }
  );
});

// Get all feedback
app.get("/feedback", (req, res) => {
  db.all(`SELECT * FROM Feedbacks ORDER BY date DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, data: rows });
  });
});

// Delete feedback by ID
app.delete("/feedback/:id", (req, res) => {
  db.run(`DELETE FROM Feedbacks WHERE id = ?`, [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, message: "Feedback deleted!" });
  });
});

// -------------------- Auth0 JWT -------------------- //

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: "https://dev-u7vek4cis1rwe2yw.us.auth0.com/.well-known/jwks.json",
  }),
  audience: "https://my-elearning-api", // your API identifier
  issuer: "https://dev-u7vek4cis1rwe2yw.us.auth0.com/",
  algorithms: ["RS256"],
});

// Protected route: create/update user in DB
app.post("/profile", checkJwt, (req, res) => {
  const { name, email } = req.body;

  db.get(`SELECT * FROM Users WHERE email = ?`, [email], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });

    if (!row) {
      db.run(`INSERT INTO Users (name, email) VALUES (?, ?)`, [name, email], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        return res.json({ message: "User saved successfully!" });
      });
    } else {
      return res.json({ message: "User already exists." });
    }
  });
});

// -------------------- Start Server -------------------- //
app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});