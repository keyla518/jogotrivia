import express from "express";
import { PrismaClient } from "@prisma/client";
import { autenticarToken } from "../middleware/auth.js";
import { ordemRegioes } from "../config/regioesOrdem.js"; // IDs inteiros

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
  const { perguntaID, resposta } = req.body;
  const usuarioID = req.user.usuarioID;

  try {
    const pergunta = await prisma.pergunta.findUnique({ where: { perguntaID } });
    if (!pergunta) return res.status(404).json({ error: "Pergunta não encontrada" });

    // Normalizar resposta (trim + maiúscula)
    const respostaNormalizada = resposta.trim().toUpperCase();

    if (respostaNormalizada === pergunta.opcaoCerta) {
      // Verifica se o progresso existe
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
      } else {
        console.log("Progresso não encontrado para este usuário/pergunta!");
      }

      // Verifica se ainda há categorias não concluídas na mesma região
      const restantes = await prisma.progressoCategoriaRegiao.findMany({
        where: {
          usuarioID,
          regiaoID: pergunta.regiaoID,
          concluido: false
        }
      });

      // Se não restam → avança região
      if (restantes.length === 0) {
        const indexAtual = ordemRegioes.indexOf(pergunta.regiaoID);
        const proximaRegiaoID = ordemRegioes[indexAtual + 1];

        if (proximaRegiaoID) {
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
            message: "🎉 Região concluída! Próxima região desbloqueada!"
          });
        }

        // Jogo concluído
        return res.json({
          message: "🏁 Parabéns! Completaste todas as regiões!"
        });
      }

      return res.json({ message: "✅ Resposta correta!" });
    }

    // ❌ Resposta errada
    return res.json({ message: "❌ Resposta errada! Tenta outra pergunta!" });

  } catch (error) {
    console.log("Erro no endpoint verificar-resposta:", error);
    res.status(500).json({ error: "Erro ao verificar resposta" });
  }
});

export default router;
