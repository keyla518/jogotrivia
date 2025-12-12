import express from "express";
import { listarRegioes } from "../controllers/regiaoController.js";
import { autenticarToken } from "../middleware/auth.js";
import { verificarAdmin } from "../middleware/admin.js";

const router = express.Router();

// GET /api/regioes ( admin)
router.get("/", autenticarToken, verificarAdmin, listarRegioes);

export default router;
