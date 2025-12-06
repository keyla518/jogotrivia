import express from "express";
import { PrismaClient } from "@prisma/client";
import { autenticarToken } from "../middleware/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

// Buscar próxima pergunta
router.get("/proxima", autenticarToken, async (req, res) => {
  const usuarioID = req.user.usuarioID;

  try {
    // Buscar usuário
    const usuario = await prisma.utilizador.findUnique({
      where: { usuarioID }
    });

    // Se nunca respondeu -> pega a primeira pergunta
    let proximaPergunta;

    if (!usuario.perguntaID) {
      proximaPergunta = await prisma.pergunta.findFirst();
    } else {
      // Pega a próxima pergunta com ID > última respondida
      proximaPergunta = await prisma.pergunta.findFirst({
        where: { perguntaID: { gt: usuario.perguntaID } }
      });
    }

    if (!proximaPergunta) {
      return res.json({ message: "Você finalizou todas as perguntas 🎉" });
    }

    // Atualiza progresso
    await prisma.utilizador.update({
      where: { usuarioID },
      data: { perguntaID: proximaPergunta.perguntaID }
    });

    res.json({
      perguntaID: proximaPergunta.perguntaID,
      texto: proximaPergunta.textoPergunta,
      opcoes: {
        A: proximaPergunta.opcaoA,
        B: proximaPergunta.opcaoB,
        C: proximaPergunta.opcaoC,
        D: proximaPergunta.opcaoD
      }
    });

  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar pergunta" });
  }
});

export default router;
