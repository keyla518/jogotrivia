import express from "express";
import { autenticarToken } from "../middleware/auth.js";
import { obterPerfil, obterDadosUsuario } from "../controllers/userController.js";

const router = express.Router();

router.get("/perfil", autenticarToken, obterPerfil);
router.get("/dados", autenticarToken, obterDadosUsuario);

export default router;
