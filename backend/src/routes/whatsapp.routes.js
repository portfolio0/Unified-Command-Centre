import express from "express";
import { sendWhatsAppMessage } from "../services/whatsapp.js";

const router = express.Router();

// Send WhatsApp message
router.post("/send", async (req, res) => {
  try {
    const { number, message } = req.body;

    if (!number || !message) {
      return res.status(400).json({ error: "Number and message are required" });
    }

    await sendWhatsAppMessage(number, message);

    res.json({ success: true, message: "WhatsApp message sent!" });
  } catch (err) {
    console.error("WhatsApp Error:", err);
    res.status(500).json({ error: "Failed to send WhatsApp message" });
  }
});

export default router;
