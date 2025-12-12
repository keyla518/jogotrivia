import express from "express";
import {
  listarUtilizadores,
  promoverAdmin,
  removerAdmin,
} from "../controllers/utilizadorController.js";

import { autenticarToken } from "../middleware/auth.js";
import { verificarAdmin } from "../middleware/admin.js";

const router = express.Router();

// LISTAR todos os utilizadores
router.get("/", autenticarToken, verificarAdmin, listarUtilizadores);

// PROMOVER a administrador
router.put("/:id/promover", autenticarToken, verificarAdmin, promoverAdmin);

// REMOVER admin → jogador
router.put("/:id/remover-admin", autenticarToken, verificarAdmin, removerAdmin);


export default router;
