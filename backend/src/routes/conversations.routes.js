// src/routes/conversations.routes.js
import express from "express";
import {
  createConversation,
  getConversations,
  deleteConversation,
} from "../controllers/conversations.controller.js";

const router = express.Router();
router.post("/", createConversation);
router.get("/", getConversations);
router.delete("/:id", deleteConversation);

export default router;
