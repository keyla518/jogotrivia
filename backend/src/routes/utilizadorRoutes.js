import express from "express";
import {
  listarUtilizadores,
  editarUtilizador
} from "../controllers/utilizadorController.js";

import { autenticarToken } from "../middleware/auth.js";
import { verificarAdmin } from "../middleware/admin.js";


const router = express.Router();

// LISTAR todos os utilizadores
router.get("/", autenticarToken, verificarAdmin, listarUtilizadores);

// EDITAR utilizador (ADMIN)
router.put("/:id", autenticarToken, verificarAdmin, editarUtilizador);


export default router;
