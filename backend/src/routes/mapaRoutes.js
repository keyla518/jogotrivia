import express from "express";
import { autenticarToken } from "../middleware/auth.js";
import { obterProgressoMapa } from "../controllers/mapaController.js";

const router = express.Router();

router.get("/progresso", autenticarToken, obterProgressoMapa);

export default router;
