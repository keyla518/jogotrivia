import express from "express";
import { getPerguntas, getRegioes, getCategorias, criarPergunta, editarPergunta, deletarPergunta } from "../controllers/perguntasController.js";
import { autenticarToken } from "../middleware/auth.js";
import { verificarAdmin } from "../middleware/admin.js";

const router = express.Router();

router.get("/", autenticarToken, verificarAdmin, getPerguntas, getRegioes, getCategorias);  // GET /api/perguntas

router.post("/", criarPergunta);
router.put("/:id", editarPergunta);
router.delete("/:id", deletarPergunta);

export default router;