require("dotenv").config();
const express = require("express");
const app = express();
const pool = require("./DB/dbController.js");

const PORT = process.env.PORT || 8040;
const USER = process.env.USER;
const HOST = process.env.HOST;
const DATABASE = process.env.DATABASE;
const PASSWORD = process.env.PASSWORD;

app.use(express.json());

// // { USERS DB CRUD Operation } // //
// Get all users //
app.get("/v1/api/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (error) {
    res.sendStatus(500).json({ error: "Internal Server Error" });
  }
});

// Get one user with id //
app.get("/v1/api/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM users WHERE id=$1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found " });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.sendStatus(500).json({ error: "Internal Server Error" });
  }
});

// Post a new user //
app.post("/v1/api/users", async (req, res) => {
  const { first_name, last_name, age, active } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO users(first_name, last_name, age, active) VALUES ($1, $2, $3, $4) RETURNING *",
      [first_name, last_name, age, active],
    );
    res.status(201).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Updating a user with PUT request //
app.put("/v1/api/users/:id", async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, age, active } = req.body;
  try {
    const result = await pool.query(
      "UPDATE users SET first_name = $1, last_name = $2, age = $3, active = $4 WHERE id = $5 RETURNING *",
      [first_name, last_name, age, active, id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(result.rows[4]);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a user from the DB //
app.delete("/v1/api/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM users WHERE id=$1 RETURNING *",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// // {ORDERS DB CRUD Operation } // //
// Get all orders //
app.get("/v1/api/orders", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM orders");
    res.json(result.rows);
  } catch (error) {
    res.sendStatus(500).json({ error: "Internal Server Error" });
  }
});

// Get one order with with the id //
app.get("/v1/api/orders/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM orders WHERE id=$1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST a new order //
app.post("/v1/api/orders", async (req, res) => {
  const { price, date, user_id } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO orders (price, date, user_id) VALUES ($1, $2, $3) RETURNING *",
      [price, date, user_id],
    );
    res.status(201).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// PUT modify an order //
app.put("/v1/api/orders/:id", async (req, res) => {
  const { id } = req.params;
  const { price, date, user_id } = req.body;
  try {
    const result = await pool.query(
      "UPDATE orders SET price=$1, date=$2, user_id=$3 WHERE id=$4 RETURNING *",
      [price, date, user_id, id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(201).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE an order fro DB //
app.delete("/v1/api/orders/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM orders WHERE id=$1 RETURNING *",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Starting the server on PORT 8040 //
app.listen(PORT, console.log(`listening on http://localhost:${PORT}`));
