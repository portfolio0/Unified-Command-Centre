// src/routes/workflows.routes.js
import express from "express";
import {
  createWorkflow,
  getWorkflows,
  getWorkflowById,
  updateWorkflow,
  deleteWorkflow,
  runWorkflow, // NEW
} from "../controllers/workflows.controller.js";

const router = express.Router();

router.post("/", createWorkflow);
router.get("/", getWorkflows);
router.get("/:id", getWorkflowById);
router.put("/:id", updateWorkflow);
router.delete("/:id", deleteWorkflow);

// NEW: run a workflow for a user
router.post("/run", runWorkflow);

export default router;
