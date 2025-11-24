import express from "express";
import { getWorkflowinstances } from "../controllers/workflowinstances.controller.js";

const router = express.Router();
router.get("/", getWorkflowinstances);

export default router;
