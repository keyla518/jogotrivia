import express from "express";
import { getPerguntas, getRegioes, getCategorias } from "../controllers/perguntasController.js";
import { autenticarToken } from "../middleware/auth.js";
import { verificarAdmin } from "../middleware/admin.js";
const router = express.Router();


router.get("/perguntas", autenticarToken, verificarAdmin, getPerguntas);
router.get("/regioes", autenticarToken, verificarAdmin, getRegioes);
router.get("/categorias", autenticarToken, verificarAdmin, getCategorias);

export default router;
