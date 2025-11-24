// server/src/routes/notifications.routes.js
import express from "express";
import {
  createNotification,
  getNotifications,
  updateNotification,
  deleteNotification,
  sendNotification, // add this export
} from "../controllers/notifications.controller.js";

const router = express.Router();

router.post("/", createNotification);
router.get("/", getNotifications);
router.put("/:id", updateNotification);
router.delete("/:id", deleteNotification);

// NEW endpoint to send notification (compose + save conversation)
router.post("/send", sendNotification);

export default router;
