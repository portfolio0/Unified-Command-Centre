import pool from "../config/db.js";

export const getWorkflowinstances = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT wi.*, 
        u.name AS user_name, 
        w.name AS workflow_name
       FROM workflow_instances wi
       LEFT JOIN users u ON wi.user_id = u.id
       LEFT JOIN workflows w ON wi.workflow_id = w.id
       ORDER BY wi.started_at DESC`
    );

    res.json(rows);
  } catch (err) {
    console.error("Error loading workflow instances:", err);
    res.status(500).json({ error: "Failed to load workflow instances" });
  }
};
