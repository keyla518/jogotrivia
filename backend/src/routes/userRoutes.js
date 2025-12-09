import express from "express";
import { autenticarToken } from "../middleware/auth.js";
import { obterPerfil } from "../controllers/userController.js";

const router = express.Router();

router.get("/perfil", autenticarToken, obterPerfil);

export default router;
