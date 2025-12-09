import express from "express";
import { autenticarToken } from "../middleware/auth.js";

import {
  proximaPergunta,
  verificarResposta,
  usarPista
} from "../controllers/gameController.js";

const router = express.Router();

router.get("/proxima-pergunta", autenticarToken, proximaPergunta);
router.post("/verificar-resposta", autenticarToken, verificarResposta);
router.post("/usar-pista", autenticarToken, usarPista);

export default router;
