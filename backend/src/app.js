// src/app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import usersRoutes from "./routes/users.routes.js";
import templatesRoutes from "./routes/templates.routes.js";
import workflowsRoutes from "./routes/workflows.routes.js";
import workflowinstancesRoutes from "./routes/workflowinstances.routes.js";
import notificationsRoutes from "./routes/notifications.routes.js";
import conversationsRoutes from "./routes/conversations.routes.js";
import { initWhatsApp } from "./services/whatsapp.js";
import whatsappRoutes from "./routes/whatsapp.routes.js";
import paymentsRoutes from "./routes/payments.routes.js";
const app = express();
app.use(cors());
app.use(express.json());

// health
app.get("/api/ping", (req, res) => res.json({ ok: true, time: Date.now() }));

// routes
app.use("/api/users", usersRoutes);
app.use("/api/templates", templatesRoutes);
app.use("/api/workflows", workflowsRoutes);
app.use("/api/workflow-instances", workflowinstancesRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/conversations", conversationsRoutes);
app.use("/api/whatsapp", whatsappRoutes);
app.use("/api/payments", paymentsRoutes);
// global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

//for audio format
//serve audio files
app.use("/uploads", express.static("uploads"));

initWhatsApp();

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
