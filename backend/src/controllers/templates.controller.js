// src/controllers/templates.controller.js
import pool from "../config/db.js";

// helper: safe JSON parse
const safeParse = (value) => {
  if (!value) return null;

  if (typeof value === "object") return value;

  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }

  return null;
};

export const createTemplate = async (req, res, next) => {
  try {
    const { title, body, language, variables } = req.body;

    const vars =
      variables && typeof variables === "object"
        ? JSON.stringify(variables)
        : null;

    const [result] = await pool.query(
      "INSERT INTO templates (title, body, language, variables) VALUES (?, ?, ?, ?)",
      [title, body, language, vars]
    );

    const [rows] = await pool.query("SELECT * FROM templates WHERE id = ?", [
      result.insertId,
    ]);

    rows[0].variables = safeParse(rows[0].variables);
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

    const parsed = rows.map((r) => ({
      ...r,
      variables: safeParse(r.variables),
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

    if (!rows.length) {
      return res.status(404).json({ error: "Template not found" });
    }

    rows[0].variables = safeParse(rows[0].variables);
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

export const updateTemplate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, body, language, variables } = req.body;

    const vars =
      variables && typeof variables === "object"
        ? JSON.stringify(variables)
        : null;

    await pool.query(
      "UPDATE templates SET title = ?, body = ?, language = ?, variables = ? WHERE id = ?",
      [title, body, language, vars, id]
    );

    const [rows] = await pool.query("SELECT * FROM templates WHERE id = ?", [
      id,
    ]);

    rows[0].variables = safeParse(rows[0].variables);
    res.json(rows[0]);
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
