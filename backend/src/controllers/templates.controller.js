// src/controllers/templates.controller.js
import pool from "../config/db.js";

export const createTemplate = async (req, res, next) => {
  try {
    const { title, body, language, variables } = req.body;
    const vars = variables ? JSON.stringify(variables) : null;
    const [result] = await pool.query(
      "INSERT INTO templates (title, body, language, variables) VALUES (?, ?, ?, ?)",
      [title, body, language, vars]
    );
    const [rows] = await pool.query("SELECT * FROM templates WHERE id = ?", [
      result.insertId,
    ]);
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
};

export const getTemplates = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM templates ORDER BY updated_at DESC"
    );
    // parse JSON variables
    const parsed = rows.map((r) => ({
      ...r,
      variables: r.variables ? JSON.parse(r.variables) : null,
    }));
    res.json(parsed);
  } catch (err) {
    next(err);
  }
};

export const getTemplateById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM templates WHERE id = ?", [
      id,
    ]);
    if (!rows.length)
      return res.status(404).json({ error: "Template not found" });
    const t = rows[0];
    t.variables = t.variables ? JSON.parse(t.variables) : null;
    res.json(t);
  } catch (err) {
    next(err);
  }
};

export const updateTemplate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, body, language, variables } = req.body;
    const vars = variables ? JSON.stringify(variables) : null;
    await pool.query(
      "UPDATE templates SET title = ?, body = ?, language = ?, variables = ? WHERE id = ?",
      [title, body, language, vars, id]
    );
    const [rows] = await pool.query("SELECT * FROM templates WHERE id = ?", [
      id,
    ]);
    const t = rows[0];
    t.variables = t.variables ? JSON.parse(t.variables) : null;
    res.json(t);
  } catch (err) {
    next(err);
  }
};

export const deleteTemplate = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM templates WHERE id = ?", [id]);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
