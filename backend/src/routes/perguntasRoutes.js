import express from "express";
import { getPerguntas } from "../controllers/perguntasController.js";
import { autenticarToken } from "../middleware/auth.js";
import { verificarAdmin } from "../middleware/admin.js";

const router = express.Router();

router.get("/", autenticarToken, verificarAdmin, getPerguntas);  // GET /api/perguntas

export default router;