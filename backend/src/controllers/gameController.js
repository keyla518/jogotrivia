import { PrismaClient } from "@prisma/client";
import { ordemRegioes } from "../config/regioesOrdem.js";

const prisma = new PrismaClient();
const XP_MINIMO = 50;

// -----------------------------
// 1. PRÓXIMA PERGUNTA
// -----------------------------
export const proximaPergunta = async (req, res) => {
  const usuarioID = req.user.usuarioID;

  try {
    // Buscar o próximo progresso não concluído
    const progresso = await prisma.progressoCategoriaRegiao.findFirst({
      where: { usuarioID, concluido: false },
      include: { regiao: true, categoria: true }
    });

    if (!progresso) {
      return res.json({
        message: "🎉 Parabéns! Completaste todas as regiões!"
      });
    }

    // Buscar perguntas da categoria/região atual
    const perguntas = await prisma.pergunta.findMany({
      where: {
        categoriaID: progresso.categoriaID,
        regiaoID: progresso.regiaoID
      }
    });

    if (perguntas.length === 0) {
      return res.status(404).json({
        error: "Não há perguntas para esta região/categoria."
      });
    }

    // Selecionar pergunta aleatória
    const pergunta =
      perguntas[Math.floor(Math.random() * perguntas.length)];

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
};



// -----------------------------
// 2. VERIFICAR RESPOSTA
// -----------------------------
export const verificarResposta = async (req, res) => {
  const { perguntaID, resposta } = req.body;
  const usuarioID = req.user.usuarioID;

  try {
    // Buscar ou criar registro de tentativa
    const tentativa = await prisma.tentativaResposta.upsert({
      where: {
        usuarioID_perguntaID: { usuarioID, perguntaID }
      },
      update: {},
      create: {
        usuarioID,
        perguntaID,
        tentativas: 1
      }
    });

    const tent = tentativa.tentativas;

    const pergunta = await prisma.pergunta.findUnique({
      where: { perguntaID }
    });

    if (!pergunta)
      return res.status(404).json({ error: "Pergunta não encontrada" });

    const respostaNormalizada = (resposta || "").trim().toUpperCase();
    const acertou = respostaNormalizada === pergunta.opcaoCerta;

    // ❌ RESPOSTA ERRADA
    if (!acertou) {
        const novoNumeroTentativas = tent + 1;
        
      await prisma.tentativaResposta.update({
        where: {
          usuarioID_perguntaID: { usuarioID, perguntaID }
        },
        data: { tentativas: novoNumeroTentativas }
      });

      return res.json({
        correta: false,
        tentativa: novoNumeroTentativas,
        message: "❌ Resposta errada! Tenta de novo!"
      });
    }

    // 🧹 Se acertou → deletar tentativas
    await prisma.tentativaResposta.delete({
      where: {
        usuarioID_perguntaID: { usuarioID, perguntaID }
      }
    });

    // ----------------------
    // 🎁 RECOMPENSAS
    // ----------------------
    let moedasGanhas = 0;
    let pontosGanhos = 0;

    if (tent === 1) { moedasGanhas = 10; pontosGanhos = 10; }
    else if (tent === 2) { moedasGanhas = 7; pontosGanhos = 7; }
    else if (tent === 3) { moedasGanhas = 5; pontosGanhos = 5; }
    else { moedasGanhas = 3; pontosGanhos = 3; }

    // Atualizar moedas e pontos
    await prisma.utilizador.update({
      where: { usuarioID },
      data: {
        moedas: { increment: moedasGanhas },
        pontos: { increment: pontosGanhos }
      }
    });

    // ----------------------
    // ATUALIZAR PROGRESSO
    // ----------------------
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

    // Categorias restantes da mesma região
    const restantes = await prisma.progressoCategoriaRegiao.findMany({
      where: {
        usuarioID,
        regiaoID: pergunta.regiaoID,
        concluido: false
      }
    });

    // REGION COMPLETA → desbloquear próxima
    if (restantes.length === 0) {
      const indexAtual = ordemRegioes.indexOf(pergunta.regiaoID);
      const proximaRegiaoID = ordemRegioes[indexAtual + 1];

      // Terminou TODAS
      if (!proximaRegiaoID) {
        return res.json({
          correta: true,
          message: "🏁 Acertaste! Terminaste TODAS as regiões!",
          moedasGanhas,
          pontosGanhos
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
        pontosGanhos
      });
    }

    // Caso normal
    return res.json({
      correta: true,
      message: "Resposta correta!",
      moedasGanhas,
      pontosGanhos
    });

  } catch (error) {
    console.log("Erro no endpoint verificar-resposta:", error);
    return res.status(500).json({ error: "Erro ao verificar resposta" });
  }
};



// -----------------------------
// 3. USAR PISTA
// -----------------------------
export const usarPista = async (req, res) => {
  const { perguntaID } = req.body;
  const usuarioID = req.user.usuarioID;

  try {
    const usuario = await prisma.utilizador.findUnique({
      where: { usuarioID },
      select: { moedas: true }
    });

    if (!usuario)
      return res.status(404).json({ error: "Usuário não encontrado." });

    if (usuario.moedas < 5)
      return res.status(400).json({
        error: "Moedas insuficientes.",
        moedasAtuais: usuario.moedas
      });

    const pergunta = await prisma.pergunta.findUnique({ where: { perguntaID } });

    if (!pergunta)
      return res.status(404).json({ error: "Pergunta não encontrada." });

    const opcoesErradas = ["A", "B", "C", "D"].filter(
      opc => opc !== pergunta.opcaoCerta
    );

    const removidas = opcoesErradas
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);

    const opcoesRestantes = {
      A: removidas.includes("A") ? null : pergunta.opcaoA,
      B: removidas.includes("B") ? null : pergunta.opcaoB,
      C: removidas.includes("C") ? null : pergunta.opcaoC,
      D: removidas.includes("D") ? null : pergunta.opcaoD
    };

    const usuarioAtualizado = await prisma.utilizador.update({
      where: { usuarioID },
      data: { moedas: { decrement: 5 } },
      select: { moedas: true }
    });

    return res.json({
      message: "Pista usada!",
      moedasRestantes: usuarioAtualizado.moedas,
      opcoesEliminadas: removidas,
      opcoesRestantes
    });

  } catch (error) {
    console.log("Erro no endpoint usar-pista:", error);
    return res.status(500).json({ error: "Erro ao usar pista" });
  }
};

