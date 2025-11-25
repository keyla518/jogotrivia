import express from "express";
import { PrismaClient } from "@prisma/client";
import { autenticarToken } from "../middleware/auth.js";
import { ordemRegioes } from "../config/regioesOrdem.js"; // IDs inteiros

const XP_MINIMO = 50; //Para passar de nivel
const router = express.Router();
const prisma = new PrismaClient();

// -----------------
// ROTA: próxima pergunta
// -----------------
router.get("/proxima-pergunta", autenticarToken, async (req, res) => {
  const usuarioID = req.user.usuarioID;

  try {
    const progresso = await prisma.progressoCategoriaRegiao.findFirst({
      where: { usuarioID, concluido: false },
      include: { regiao: true, categoria: true }
    });

    if (!progresso) {
      return res.json({ message: "🎉 Parabéns! Completaste todas as regiões!" });
    }

    const perguntas = await prisma.pergunta.findMany({
      where: {
        categoriaID: progresso.categoriaID,
        regiaoID: progresso.regiaoID
      }
    });

    if (perguntas.length === 0) {
      return res.status(404).json({ error: "Não há perguntas para esta região/categoria." });
    }

    const pergunta = perguntas[Math.floor(Math.random() * perguntas.length)];

    res.json({
      message: "Pergunta carregada ✅",
      regiao: progresso.regiao.nomeRegiao,
      categoria: progresso.categoria.nomeCategoria,
      pergunta: {
        id: pergunta.perguntaID,
        texto: pergunta.textoPergunta,
        opcoes: {
          A: pergunta.opcaoA,
          B: pergunta.opcaoB,
          C: pergunta.opcaoC,
          D: pergunta.opcaoD
        }
      }
    });

  } catch (error) {
    console.log("Erro ao carregar próxima pergunta:", error);
    res.status(500).json({ error: "Erro a carregar pergunta" });
  }
});

// -----------------
// ROTA: verificar resposta
// -----------------
router.post("/verificar-resposta", autenticarToken, async (req, res) => {
  const { perguntaID, resposta, tentativa } = req.body;
  const usuarioID = req.user.usuarioID;

  // Segurança: garantir que tentativa é válida
  const tent = Math.max(1, Math.min(parseInt(tentativa || 1), 10));

  try {
    const pergunta = await prisma.pergunta.findUnique({ where: { perguntaID } });
    if (!pergunta) return res.status(404).json({ error: "Pergunta não encontrada" });

    const respostaNormalizada = resposta.trim().toUpperCase();

    const acertou = respostaNormalizada === pergunta.opcaoCerta;

    if (!acertou) {
      return res.json({
        correta: false,
        message: "❌ Resposta errada! Tenta de novo!",
      });
    }

    // ---------------------------
    // 🎁 RECOMPENSAS AO ACERTAR
    // ---------------------------
    let moedasGanhas = 0;

    if (tent === 1) moedasGanhas = 10;
    else if (tent === 2) moedasGanhas = 7;
    else if (tent === 3) moedasGanhas = 5;
    else moedasGanhas = 3;

    const xpGanho = 15;

    // Atualizar moedas e XP do usuário
    await prisma.utilizador.update({
      where: { usuarioID },
      data: {
        moedas: { increment: moedasGanhas },
        xp: { increment: xpGanho }
      }
    });

    // ---------------------------
    // ATUALIZAR PROGRESSO
    // ---------------------------
    const progresso = await prisma.progressoCategoriaRegiao.findUnique({
      where: {
        usuarioID_regiaoID_categoriaID: {
          usuarioID,
          regiaoID: pergunta.regiaoID,
          categoriaID: pergunta.categoriaID
        }
      }
    });

    if (progresso) {
      await prisma.progressoCategoriaRegiao.update({
        where: {
          usuarioID_regiaoID_categoriaID: {
            usuarioID,
            regiaoID: pergunta.regiaoID,
            categoriaID: pergunta.categoriaID
          }
        },
        data: { concluido: true }
      });
    }

    // Verificar se faltam categorias na região
    const restantes = await prisma.progressoCategoriaRegiao.findMany({
      where: {
        usuarioID,
        regiaoID: pergunta.regiaoID,
        concluido: false
      }
    });

    // Se acabou → tentar avançar região (com XP mínimo)
    if (restantes.length === 0) {
      const indexAtual = ordemRegioes.indexOf(pergunta.regiaoID);
      const proximaRegiaoID = ordemRegioes[indexAtual + 1];

      // Buscar XP do usuário
      const usuario = await prisma.utilizador.findUnique({
        where: { usuarioID },
        select: { xp: true }
      });

      // 1️⃣ Não há próxima região (jogo finalizado)
      if (!proximaRegiaoID) {
        return res.json({
          correta: true,
          message: "🏁 Acertaste! E terminaste TODAS as regiões!",
          moedasGanhas,
          xpGanho
        });
      }

      // 2️⃣ Verificar XP mínimo
      if (usuario.xp < XP_MINIMO) {
        return res.json({
          correta: true,
          message: "⚠️ Região concluída, mas precisas de mais XP para avançar!",
          moedasGanhas,
          xpGanho,
          xpAtual: usuario.xp,
          xpNecessario: XP_MINIMO,
          falta: XP_MINIMO - usuario.xp
        });
      }

      // 3️⃣ XP suficiente — desbloqueia próxima região
      const categorias = await prisma.categoria.findMany();
      for (const cat of categorias) {
        await prisma.progressoCategoriaRegiao.create({
          data: {
            usuarioID,
            regiaoID: proximaRegiaoID,
            categoriaID: cat.categoriaID
          }
        });
      }

      return res.json({
        correta: true,
        message: "🎉 Acertaste e concluíste a região! Próxima desbloqueada!",
        moedasGanhas,
        xpGanho
      });
    }

    // Caso apenas acertou e continua na mesma região
    return res.json({
      correta: true,
      message: "✅ Resposta correta!",
      moedasGanhas,
      xpGanho
    });

    } catch (error) {
    console.log("Erro no endpoint verificar-resposta:", error);
    res.status(500).json({ error: "Erro ao verificar resposta" });
  }
});

export default router;




// -----------------
// ROTA: usar pista (custa 5 moedas)
// -----------------
router.post("/usar-pista", autenticarToken, async (req, res) => {
  const { perguntaID } = req.body;
  const usuarioID = req.user.usuarioID;

  try {
    // Buscar usuário
    const usuario = await prisma.utilizador.findUnique({
      where: { usuarioID }
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    // Verificar moedas suficientes
    if (usuario.moedas < 5) {
      return res.status(400).json({ error: "Moedas insuficientes para usar pista." });
    }

    // Buscar pergunta
    const pergunta = await prisma.pergunta.findUnique({
      where: { perguntaID }
    });

    if (!pergunta) {
      return res.status(404).json({ error: "Pergunta não encontrada." });
    }

    // Lista das opções erradas
    const opcoesErradas = ["A", "B", "C", "D"].filter(
      opc => opc !== pergunta.opcaoCerta
    );

    // Escolher aleatoriamente 2 opções para remover
    const removidas = opcoesErradas.sort(() => 0.5 - Math.random()).slice(0, 2);

    // Criar novo objeto de opções restantes
    const opcoesRestantes = {
      A: removidas.includes("A") ? null : pergunta.opcaoA,
      B: removidas.includes("B") ? null : pergunta.opcaoB,
      C: removidas.includes("C") ? null : pergunta.opcaoC,
      D: removidas.includes("D") ? null : pergunta.opcaoD
    };

    // Descontar 5 moedas
    await prisma.utilizador.update({
      where: { usuarioID },
      data: { moedas: usuario.moedas - 5 }
    });

    return res.json({
      message: "Pista usada! Foram removidas duas opções erradas.",
      removidas,
      opcoesRestantes
    });

  } catch (error) {
    console.log("Erro no endpoint /usar-pista:", error);
    return res.status(500).json({ error: "Erro ao usar pista." });
  }
});
