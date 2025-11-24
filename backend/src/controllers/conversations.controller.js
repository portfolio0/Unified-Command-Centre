// backend/src/controllers/conversations.controller.js
import pool from "../config/db.js";
import { sendWhatsAppMessage } from "../services/whatsapp.js";

// -------------------------------
// GET ALL CONVERSATIONS / USER CHAT
// -------------------------------
export const getConversations = async (req, res, next) => {
  try {
    const { userId } = req.query;

    if (userId) {
      const [rows] = await pool.query(
        "SELECT * FROM conversations WHERE user_id = ? ORDER BY timestamp ASC",
        [userId]
      );
      return res.json(rows);
    }

    const [rows] = await pool.query(
      "SELECT * FROM conversations ORDER BY timestamp DESC LIMIT 500"
    );
    res.json(rows);
  } catch (err) {
    console.error("Get conversations error:", err);
    next(err);
  }
};

// -------------------------------
// CREATE CONVERSATION (SEND MESSAGE)
// Handles outgoing WhatsApp + DB save
// -------------------------------
export const createConversation = async (req, res, next) => {
  try {
    const { user_id, direction, message, channel } = req.body;

    // 1) OUTGOING MESSAGE
    if (direction === "outgoing" && channel === "whatsapp") {
      const [u] = await pool.query("SELECT phone FROM users WHERE id = ?", [
        user_id,
      ]);

      if (!u.length)
        return res.status(404).json({ error: "User not found for WhatsApp" });

      const phone = u[0].phone;
      await sendWhatsAppMessage(phone, message);

      console.log("📤 WhatsApp message sent:", phone, message);
    }

    // 2) SAVE TO DB
    const [result] = await pool.query(
      "INSERT INTO conversations (user_id, direction, message, language, intent, sentiment) VALUES (?, ?, ?, 'English', NULL, NULL)",
      [user_id, direction, message]
    );

    const [rows] = await pool.query(
      "SELECT * FROM conversations WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("Create conversation error:", err);
    next(err);
  }
};

// -------------------------------
// DELETE A CONVERSATION ROW
// -------------------------------
export const deleteConversation = async (req, res, next) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM conversations WHERE id = ?", [id]);

    res.json({ success: true });
  } catch (err) {
    console.error("Delete conversation error:", err);
    next(err);
  }
};
