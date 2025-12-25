import express from "express";
import { autenticarToken } from "../middleware/auth.js";
import { 
  obterProgressoMapa, 
  obterDetalhesRegiao 
} from "../controllers/mapaController.js";

const router = express.Router();

// GET /mapa/progresso - Retorna status de todas as regiões
router.get("/progresso", autenticarToken, obterProgressoMapa);

// GET /mapa/regiao/:regiaoID - Retorna detalhes de uma região específica (opcional)
router.get("/regiao/:regiaoID", autenticarToken, obterDetalhesRegiao);

export default router;