// server/src/controllers/users.controller.js
import pool from "../config/db.js";

// Create user
export const createUser = async (req, res, next) => {
  try {
    const { name, phone, email, language } = req.body;

    const [result] = await pool.query(
      "INSERT INTO users (name, phone, email, language) VALUES (?, ?, ?, ?)",
      [name, phone, email, language]
    );

    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [
      result.insertId,
    ]);

    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
};

// Get all users
export const getUsers = async (req, res, next) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

// Update user
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, phone, email, language } = req.body;

    await pool.query(
      "UPDATE users SET name = ?, phone = ?, email = ?, language = ? WHERE id = ?",
      [name, phone, email, language, id]
    );

    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

// Delete user
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM users WHERE id = ?", [id]);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
