// src/controllers/workflows.controller.js
import pool from "../config/db.js";
import { sendNotificationInternal } from "./notifications.controller.js";
import { sendWhatsAppMessage } from "../services/whatsapp.js"; // <-- NEW IMPORT

// Safe JSON parse helper
const safeParse = (value) => {
  try {
    return typeof value === "string" ? JSON.parse(value) : value;
  } catch {
    return value || [];
  }
};

/* ============================================================
   CREATE WORKFLOW
============================================================ */
export const createWorkflow = async (req, res, next) => {
  try {
    const { name, steps, active } = req.body;

    const [result] = await pool.query(
      "INSERT INTO workflows (name, steps, active) VALUES (?, ?, ?)",
      [
        name,
        JSON.stringify(steps || []),
        active === undefined ? true : !!active,
      ]
    );

    const [rows] = await pool.query("SELECT * FROM workflows WHERE id = ?", [
      result.insertId,
    ]);

    rows[0].steps = safeParse(rows[0].steps);

    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
};

/* ============================================================
   GET ALL WORKFLOWS
============================================================ */
export const getWorkflows = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM workflows ORDER BY created_at DESC"
    );

    res.json(
      rows.map((r) => ({
        ...r,
        steps: safeParse(r.steps),
      }))
    );
  } catch (err) {
    next(err);
  }
};

/* ============================================================
   GET WORKFLOW BY ID
============================================================ */
export const getWorkflowById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query("SELECT * FROM workflows WHERE id = ?", [
      id,
    ]);

    if (!rows.length)
      return res.status(404).json({ error: "Workflow not found" });

    rows[0].steps = safeParse(rows[0].steps);

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

/* ============================================================
   UPDATE WORKFLOW
============================================================ */
export const updateWorkflow = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, steps, active } = req.body;

    await pool.query(
      "UPDATE workflows SET name = ?, steps = ?, active = ? WHERE id = ?",
      [
        name,
        JSON.stringify(steps || []),
        active === undefined ? true : !!active,
        id,
      ]
    );

    const [rows] = await pool.query("SELECT * FROM workflows WHERE id = ?", [
      id,
    ]);

    rows[0].steps = safeParse(rows[0].steps);

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

/* ============================================================
   DELETE WORKFLOW
============================================================ */
export const deleteWorkflow = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM workflows WHERE id = ?", [id]);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

/* ============================================================
   RUN WORKFLOW (Email + WhatsApp)
============================================================ */
export const runWorkflow = async (req, res, next) => {
  try {
    const { workflow_id, user_id, channel, variables } = req.body;

    // 1) Load workflow
    const [wfRows] = await pool.query("SELECT * FROM workflows WHERE id = ?", [
      workflow_id,
    ]);

    if (!wfRows.length) {
      return res.status(404).json({ error: "Workflow not found" });
    }

    const workflow = wfRows[0];
    const steps = safeParse(workflow.steps) || [];

    if (!Array.isArray(steps) || steps.length === 0) {
      return res.status(400).json({ error: "Workflow has no steps" });
    }

    // 2) Create workflow instance
    const [instResult] = await pool.query(
      "INSERT INTO workflow_instances (workflow_id, user_id, current_step, status, started_at) VALUES (?, ?, ?, ?, NOW())",
      [workflow_id, user_id, 0, "running"]
    );

    const instanceId = instResult.insertId;

    // 3) Execute steps SEQUENTIALLY (no delay yet)
    for (let index = 0; index < steps.length; index++) {
      const step = steps[index];

      console.log("Executing Step:", step);

      /* --------------------------------------------------------
         CASE 1: WhatsApp Step  (type = whatsapp)
      -------------------------------------------------------- */
      if (step.type === "whatsapp") {
        console.log("Sending WhatsApp via workflow...");

        await sendWhatsAppMessage(step.phone, step.message);

        // Save outgoing WhatsApp message
        await pool.query(
          "INSERT INTO conversations (user_id, direction, message, language) VALUES (?, 'outgoing', ?, 'unknown')",
          [user_id, step.message]
        );
      } else if (step.template_id) {

      /* --------------------------------------------------------
         CASE 2: Email Template Step
         (Your old logic for template-based workflow steps)
      -------------------------------------------------------- */
        await sendNotificationInternal({
          user_id,
          template_id: step.template_id,
          channel: channel || "email",
          override_message: null,
          variables: variables || {},
        });
      }

      // update workflow instance progress
      await pool.query(
        "UPDATE workflow_instances SET current_step = ?, last_run_at = NOW() WHERE id = ?",
        [index + 1, instanceId]
      );
    }

    // 4) Mark instance as completed
    await pool.query(
      "UPDATE workflow_instances SET status = 'completed', last_run_at = NOW() WHERE id = ?",
      [instanceId]
    );

    res.json({
      success: true,
      message: "Workflow executed successfully",
      workflow_instance_id: instanceId,
      steps_executed: steps.length,
    });
  } catch (err) {
    next(err);
  }
};
