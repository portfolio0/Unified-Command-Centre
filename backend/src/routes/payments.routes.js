import express from "express";
import { generateUpiLink } from "../controllers/payments.controller.js";

const router = express.Router();

router.get("/upi", generateUpiLink);

export default router;
