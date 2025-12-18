import { exec } from "child_process";
import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;
import qrcode from "qrcode-terminal";
import pool from "../config/db.js";

import fs from "fs";
import path from "path";

let whatsappClient = null;

export const initWhatsApp = () => {
  console.log("🚀 Starting WhatsApp...");

  whatsappClient = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
      headless: true,
      args: ["--no-sandbox"],
    },
  });

  // ==========================
  // QR CODE
  // ==========================
  whatsappClient.on("qr", (qr) => {
    console.log("\n📱 Scan this QR:\n");
    qrcode.generate(qr, { small: true });
  });

  // ==========================
  // READY
  // ==========================
  whatsappClient.on("ready", () => {
    console.log("✅ WhatsApp connected");
  });

  // ==========================
  // INCOMING MESSAGE HANDLER
  // ==========================
  whatsappClient.on("message", async (msg) => {
    try {
      const senderNumber = msg.from.replace("@c.us", "");

      // 1️⃣ Find user
      const [users] = await pool.query("SELECT id FROM users WHERE phone = ?", [
        senderNumber,
      ]);

      if (!users.length) {
        console.log("⚠ User not found:", senderNumber);
        return;
      }

      const userId = users[0].id;

      // =====================================================
      // 🎙️ VOICE MESSAGE (PTT)
      // =====================================================
      if (msg.hasMedia && msg.type === "ptt") {
        const media = await msg.downloadMedia();
        if (!media?.data) return;

        const uploadDir = "uploads";
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

        const fileName = `voice_${Date.now()}.ogg`;
        const filePath = path.join(uploadDir, fileName);

        fs.writeFileSync(filePath, media.data, "base64");

        // 2️⃣ Save conversation (NO reply to WhatsApp)
        await pool.query(
          `INSERT INTO conversations
           (user_id, direction, message, message_type, media_url, language)
           VALUES (?, 'incoming', 'Voice message', 'audio', ?, 'unknown')`,
          [userId, `/uploads/${fileName}`]
        );

        console.log("🎙 Voice saved:", fileName);

        // 3️⃣ Whisper transcription (APP ONLY)
        exec(
          `python scripts/transcribe.py "${filePath}"`,
          async (err, stdout) => {
            if (err) {
              console.error("❌ Whisper failed:", err);
              return;
            }

            const transcription = stdout.trim();

            await pool.query(
              `UPDATE conversations
             SET transcription = ?
             WHERE media_url = ?`,
              [transcription, `/uploads/${fileName}`]
            );

            console.log("📝 Transcription stored (no WhatsApp reply)");
          }
        );

        return; // 🚫 IMPORTANT: stop here
      }

      // =====================================================
      // 💬 TEXT MESSAGE
      // =====================================================
      await pool.query(
        `INSERT INTO conversations
         (user_id, direction, message, message_type, language)
         VALUES (?, 'incoming', ?, 'text', 'unknown')`,
        [userId, msg.body]
      );

      console.log("💬 Text message saved");
    } catch (error) {
      console.error("❌ WhatsApp handler error:", error);
    }
  });

  whatsappClient.initialize();
};

// =====================================================
// SEND MESSAGE (ONLY when YOU click Send in dashboard)
// =====================================================
export const sendWhatsAppMessage = async (number, message) => {
  if (!whatsappClient) {
    throw new Error("WhatsApp not initialized");
  }

  const formatted = `${number}@c.us`;
  return whatsappClient.sendMessage(formatted, message);
};
