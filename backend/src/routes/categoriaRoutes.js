import express from "express";
import { listarCategorias } from "../controllers/categoriaController.js";
import { autenticarToken } from "../middleware/auth.js";
import { verificarAdmin } from "../middleware/admin.js";

const router = express.Router();

// GET /api/categorias  (admin)
router.get("/", autenticarToken, verificarAdmin, listarCategorias);

export default router;
