import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;
import qrcode from "qrcode-terminal";
import pool from "../config/db.js"; // <-- IMPORTANT

let whatsappClient = null;

export const initWhatsApp = () => {
  console.log("Starting WhatsApp...");

  whatsappClient = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
      headless: true,
      args: ["--no-sandbox"],
    },
  });

  // Show QR code
  whatsappClient.on("qr", (qr) => {
    console.log("\nSCAN THIS QR CODE:\n");
    qrcode.generate(qr, { small: true });
  });

  // WhatsApp connected
  whatsappClient.on("ready", () => {
    console.log("\n🔥 WhatsApp Connected Successfully!\n");
  });

  // INCOMING MESSAGE HANDLER
  whatsappClient.on("message", async (msg) => {
    console.log("Incoming WhatsApp Message:", msg.from, msg.body);

    // WhatsApp formats sender like "919876543210@c.us"
    const senderNumber = msg.from.replace("@c.us", "");

    try {
      // Find user by phone number
      const [rows] = await pool.query("SELECT id FROM users WHERE phone = ?", [
        senderNumber,
      ]);

      if (rows.length === 0) {
        console.log("⚠ User not found for number:", senderNumber);
        return;
      }

      const userId = rows[0].id;

      // Save into CONVERSATIONS
      await pool.query(
        "INSERT INTO conversations (user_id, direction, message, language, intent, sentiment) VALUES (?, 'incoming', ?, 'unknown', NULL, NULL)",
        [userId, msg.body]
      );

      console.log("✔ Incoming WhatsApp saved to conversations");
    } catch (error) {
      console.error("❌ DB Error saving WhatsApp message:", error);
    }
  });

  whatsappClient.initialize();
};

// SEND MESSAGES OUTGOING
export const sendWhatsAppMessage = async (number, message) => {
  if (!whatsappClient) throw new Error("WhatsApp not initialized");

  const formatted = `${number}@c.us`;
  return whatsappClient.sendMessage(formatted, message);
};
