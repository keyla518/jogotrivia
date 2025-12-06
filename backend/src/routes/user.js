import express from "express";
import { autenticarToken } from "../middleware/auth.js";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/perfil", autenticarToken, async (req, res) => {
  const usuario = await prisma.utilizador.findUnique({
    where: { usuarioID: req.user.usuarioID },
    select: { usuarioID: true, nomeUsuario: true, email: true, moedas: true, xp: true }
  });

  res.json({ message: "Perfil carregado ✅", usuario });
});

export default router;
