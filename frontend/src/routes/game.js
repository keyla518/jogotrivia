import express from "express";
import { PrismaClient } from "@prisma/client";
import { autenticarToken } from "../middleware/auth.js";
import { ordemRegioes } from "../config/regioesOrdem.js"; 

const router = express.Router();
const prisma = new PrismaClient();
const XP_MINIMO = 50; //Para passar de nivel


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
  const { perguntaID, resposta, tentativa, replay = false } = req.body;
  const usuarioID = req.user.usuarioID;
  const tent = Math.max(1, Math.min(parseInt(tentativa || 1), 10));

  try {
    const pergunta = await prisma.pergunta.findUnique({
      where: { perguntaID }
    });

    if (!pergunta) {
      return res.status(404).json({ error: "Pergunta não encontrada" });
    }

    const respostaNormalizada = (resposta || "").trim().toUpperCase();
    const acertou = respostaNormalizada === pergunta.opcaoCerta;

    if (!acertou) {
      return res.json({
        correta: false,
        message: "❌ Resposta errada! Tenta de novo!"
      });
    }

    // ---------------------------
    //  RECOMPENSAS AO ACERTAR
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
    // ATUALIZAR PROGRESSO (se não for replay)
    // ---------------------------
    if (!replay) {
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

    // Verificar se faltam categorias por concluir na mesma região
    const restantes = await prisma.progressoCategoriaRegiao.findMany({
      where: {
        usuarioID,
        regiaoID: pergunta.regiaoID,
        concluido: false
      }
    });

    // ---------------------------
    // Se acabou → tentar avançar região
    // ---------------------------
    if (restantes.length === 0) {
      const indexAtual = ordemRegioes.indexOf(pergunta.regiaoID);
      const proximaRegiaoID = ordemRegioes[indexAtual + 1];

      const usuario = await prisma.utilizador.findUnique({
        where: { usuarioID },
        select: { xp: true }
      });

      // TERMINOU TODAS AS REGIÕES
      if (!proximaRegiaoID) {
        return res.json({
          correta: true,
          message: "🏁 Acertaste! Terminaste TODAS as regiões! Parabéns 🎉",
          moedasGanhas,
          xpGanho
        });
      }

      // Verificar XP necessário para avançar
      if (usuario.xp < XP_MINIMO) {
        return res.json({
          correta: true,
          message:
            "⚠️ Região concluída, mas precisas de mais XP para avançar!",
          moedasGanhas,
          xpGanho,
          xpAtual: usuario.xp,
          xpNecessario: XP_MINIMO,
          falta: XP_MINIMO - usuario.xp
        });
      }

      // Criar progresso da próxima região
      const categorias = await prisma.categoria.findMany();

      await prisma.progressoCategoriaRegiao.createMany({
        data: categorias.map(cat => ({
          usuarioID,
          regiaoID: proximaRegiaoID,
          categoriaID: cat.categoriaID
        })),
        skipDuplicates: true
      });

      return res.json({
        correta: true,
        message: "🎉 Região concluída! Próxima região desbloqueada!",
        moedasGanhas,
        xpGanho
      });
    }

    // Caso normal: acertou mas ainda há categorias para terminar
    return res.json({
      correta: true,
      message: "Resposta correta!",
      moedasGanhas,
      xpGanho
    });

  } catch (error) {
    console.log("Erro no endpoint verificar-resposta:", error);
    return res.status(500).json({ error: "Erro ao verificar resposta" });
  }
});



// -----------------
// ROTA: usar pista (custa 5 moedas)
// -----------------
router.post("/usar-pista", autenticarToken, async (req, res) => {
  const { perguntaID } = req.body;
  const usuarioID = req.user.usuarioID;

  try {
    // 1️⃣ Buscar usuário
    const usuario = await prisma.utilizador.findUnique({
      where: { usuarioID },
      select: { moedas: true }
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    // 2️⃣ Verificar moedas suficientes
    if (usuario.moedas < 5) {
      return res.status(400).json({
        error: "Moedas insuficientes para usar pista.",
        moedasAtuais: usuario.moedas
      });
    }

    // 3️⃣ Buscar pergunta
    const pergunta = await prisma.pergunta.findUnique({
      where: { perguntaID }
    });

    if (!pergunta) {
      return res.status(404).json({ error: "Pergunta não encontrada." });
    }

    // 4️⃣ Encontrar opções erradas
    const opcoesErradas = ["A", "B", "C", "D"].filter(
      opc => opc !== pergunta.opcaoCerta
    );

    // 5️⃣ Remover 2 opções aleatórias
    const removidas = opcoesErradas
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);

    // 6️⃣ Criar opções restantes
    const opcoesRestantes = {
      A: removidas.includes("A") ? null : pergunta.opcaoA,
      B: removidas.includes("B") ? null : pergunta.opcaoB,
      C: removidas.includes("C") ? null : pergunta.opcaoC,
      D: removidas.includes("D") ? null : pergunta.opcaoD
    };

    // 7️⃣ Descontar moedas (seguro contra race conditions)
    const usuarioAtualizado = await prisma.utilizador.update({
      where: { usuarioID },
      data: { moedas: { decrement: 5 } },
      select: { moedas: true }
    });

    // 8️⃣ Resposta final
    return res.json({
      message: "Pista usada! Duas opções erradas foram removidas.",
      moedasRestantes: usuarioAtualizado.moedas,
      opcoesEliminadas: removidas,
      opcoesRestantes
    });

  } catch (error) {
    console.log("Erro no endpoint /usar-pista:", error);
    return res.status(500).json({ error: "Erro ao usar pista." });
  }
});


// -----------------
// ROTA: perguntas de uma região específica (REPLAY)
// -----------------
router.get("/perguntas-regiao/:regiaoID", autenticarToken, async (req, res) => {
  const usuarioID = req.user.usuarioID;
  const regiaoID = parseInt(req.params.regiaoID);

  try {
    // 1️⃣ Garantir que a região está desbloqueada para o jogador
    const desbloqueada = await prisma.progressoCategoriaRegiao.findFirst({
      where: { usuarioID, regiaoID }
    });

    if (!desbloqueada) {
      return res.status(403).json({
        error: "Não tens acesso a esta região ainda!"
      });
    }

    // 2️⃣ Buscar todas as perguntas da região
    const perguntas = await prisma.pergunta.findMany({
      where: { regiaoID }
    });

    if (perguntas.length === 0) {
      return res.status(404).json({
        error: "Nenhuma pergunta encontrada nesta região."
      });
    }

    // 3️⃣ Selecionar pergunta aleatória
    const pergunta = perguntas[Math.floor(Math.random() * perguntas.length)];

    // 4️⃣ Resposta final (replay = true → NÃO avança progresso)
    return res.json({
      replay: true,
      message: "Pergunta carregada para ganhar XP!",
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
    console.log("Erro ao buscar perguntas de replay:", error);
    return res.status(500).json({
      error: "Erro ao carregar perguntas da região."
    });
  }
});

export default router;