// src/routes/templates.routes.js
import express from "express";
import {
  createTemplate,
  getTemplates,
  getTemplateById,
  updateTemplate,
  deleteTemplate,
} from "../controllers/templates.controller.js";

const router = express.Router();
router.post("/", createTemplate);
router.get("/", getTemplates);
router.get("/:id", getTemplateById);
router.put("/:id", updateTemplate);
router.delete("/:id", deleteTemplate);

export default router;
