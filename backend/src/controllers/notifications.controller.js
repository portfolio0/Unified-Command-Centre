// server/src/controllers/notifications.controller.js
import pool from "../config/db.js";
import { sendEmail } from "../services/email.service.js";

/**
 * Utility: Replace {variables} in a message string
 */
const applyTemplateVariables = (templateBody, varsData = {}) => {
  if (!templateBody) return "";
  return templateBody.replace(/\{([^}]+)\}/g, (full, key) => {
    const k = key.trim();
    return varsData[k] !== undefined && varsData[k] !== null
      ? String(varsData[k])
      : `{${k}}`;
  });
};

/**
 * =====================================================
 * INTERNAL HELPER: sendNotificationInternal
 * =====================================================
 * This can be used by:
 * - /api/notifications/send
 * - workflow runner
 */
export const sendNotificationInternal = async ({
  user_id,
  template_id,
  channel,
  override_message,
  variables,
}) => {
  // 1) Load user
  const [users] = await pool.query("SELECT * FROM users WHERE id = ?", [
    user_id,
  ]);
  if (!users.length) {
    throw new Error("User not found");
  }
  const user = users[0];

  // 2) Load template (optional)
  let template = null;
  if (template_id) {
    const [trows] = await pool.query("SELECT * FROM templates WHERE id = ?", [
      template_id,
    ]);
    if (!trows.length) {
      throw new Error("Template not found");
    }
    template = trows[0];
    try {
      template.variables = template.variables
        ? JSON.parse(template.variables)
        : {};
    } catch {
      template.variables = {};
    }
  }

  // 3) Merge variables
  const varsData = {
    name: user.name || "",
    phone: user.phone || "",
    email: user.email || "",
    language: user.language || "",
    ...(variables || {}),
  };

  // 4) Compose final message
  let finalMessage = "";
  if (override_message && override_message.trim()) {
    finalMessage = applyTemplateVariables(override_message, varsData);
  } else if (template) {
    finalMessage = applyTemplateVariables(template.body, varsData);
  } else {
    throw new Error("template_id or override_message is required");
  }

  // 5) Channel-specific: email
  if (channel === "email") {
    if (!user.email) {
      console.warn("User email missing. Skipping email sending.");
    } else {
      try {
        await sendEmail(user.email, "Notification Update", finalMessage);
      } catch (err) {
        console.error("Email send failed:", err);
      }
    }
  }

  // (in future, you can add WhatsApp, Voice etc here)

  // 6) Save to conversations
  const [convResult] = await pool.query(
    "INSERT INTO conversations (user_id, direction, message, language) VALUES (?, ?, ?, ?)",
    [user_id, "outgoing", finalMessage, user.language || null]
  );
  const conversationId = convResult.insertId;

  // 7) Save to notifications
  const [notifResult] = await pool.query(
    "INSERT INTO notifications (user_id, workflow_instance_id, channel, message, status) VALUES (?, ?, ?, ?, ?)",
    [user_id, null, channel, finalMessage, "sent"]
  );
  const notificationId = notifResult.insertId;

  const [[savedConv]] = await pool.query(
    "SELECT * FROM conversations WHERE id = ?",
    [conversationId]
  );
  const [[savedNotif]] = await pool.query(
    "SELECT * FROM notifications WHERE id = ?",
    [notificationId]
  );

  return {
    notification: savedNotif,
    conversation: savedConv,
  };
};

/**
 * =====================================================
 * EXISTING CRUD ENDPOINTS
 * =====================================================
 */

export const createNotification = async (req, res, next) => {
  try {
    const { user_id, workflow_instance_id, channel, message, status } =
      req.body;

    const [result] = await pool.query(
      "INSERT INTO notifications (user_id, workflow_instance_id, channel, message, status) VALUES (?, ?, ?, ?, ?)",
      [
        user_id,
        workflow_instance_id || null,
        channel,
        message,
        status || "sent",
      ]
    );

    const [rows] = await pool.query(
      "SELECT * FROM notifications WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
};

export const getNotifications = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM notifications ORDER BY id DESC"
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

export const updateNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { channel, message, status } = req.body;

    await pool.query(
      "UPDATE notifications SET channel = ?, message = ?, status = ? WHERE id = ?",
      [channel, message, status, id]
    );

    const [rows] = await pool.query(
      "SELECT * FROM notifications WHERE id = ?",
      [id]
    );

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

export const deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM notifications WHERE id = ?", [id]);

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

/**
 * =====================================================
 * HTTP ENDPOINT: POST /api/notifications/send
 * =====================================================
 */
export const sendNotification = async (req, res, next) => {
  try {
    const { user_id, template_id, channel, override_message, variables } =
      req.body;

    const result = await sendNotificationInternal({
      user_id,
      template_id,
      channel,
      override_message,
      variables,
    });

    res.status(201).json({
      success: true,
      message: "Notification sent",
      ...result,
    });
  } catch (err) {
    next(err);
  }
};
