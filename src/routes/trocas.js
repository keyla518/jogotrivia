import express from "express";
import { PrismaClient } from "@prisma/client";
import { autenticarToken } from "../middleware/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

// 🔥 Helper: remover uma carta de um jogador
async function removerCarta(usuarioID, cartaID) {
  const existente = await prisma.usuarioCarta.findUnique({
    where: { usuarioID_cartaID: { usuarioID, cartaID } }
  });

  if (!existente) return false;

  if (existente.quantidade > 1) {
    await prisma.usuarioCarta.update({
      where: { usuarioID_cartaID: { usuarioID, cartaID } },
      data: { quantidade: { decrement: 1 } }
    });
  } else {
    await prisma.usuarioCarta.delete({
      where: { usuarioID_cartaID: { usuarioID, cartaID } }
    });
  }
  return true;
}

// 🔥 Helper: adicionar carta a um jogador
async function adicionarCarta(usuarioID, cartaID) {
  const existente = await prisma.usuarioCarta.findUnique({
    where: { usuarioID_cartaID: { usuarioID, cartaID } }
  });

  if (existente) {
    await prisma.usuarioCarta.update({
      where: { usuarioID_cartaID: { usuarioID, cartaID } },
      data: { quantidade: { increment: 1 } }
    });
  } else {
    await prisma.usuarioCarta.create({
      data: {
        usuarioID,
        cartaID,
        quantidade: 1
      }
    });
  }
}

// --------------------------------------------------
// 📌 1. Criar pedido de troca
// --------------------------------------------------
router.post("/criar", autenticarToken, async (req, res) => {
  const { usuarioParaID, cartaOferecidaID, cartaPedidaID } = req.body;
  const usuarioDeID = req.user.usuarioID;

  try {
    if (usuarioDeID === usuarioParaID) {
      return res.status(400).json({ error: "Não podes trocar contigo mesmo." });
    }

    // ✔ Verificar se o jogador tem a carta oferecida
    const possuiCarta = await prisma.usuarioCarta.findUnique({
      where: {
        usuarioID_cartaID: { usuarioID: usuarioDeID, cartaID: cartaOferecidaID }
      }
    });

    if (!possuiCarta) {
      return res.status(400).json({ error: "Não tens essa carta para oferecer." });
    }

    // Criar troca
    const troca = await prisma.troca.create({
      data: {
        usuarioDeID,
        usuarioParaID,
        cartaOferecidaID,
        cartaPedidaID,
        status: "pendente"
      }
    });

    // 🔥 Notificar jogador alvo
    const io = req.app.get("io");
    io.to(`user_${usuarioParaID}`).emit("novaTroca", {
      message: "Recebeste um pedido de troca!",
      trocaID: troca.trocaID
    });

    return res.json({
      message: "Pedido de troca enviado!",
      troca
    });

  } catch (e) {
    console.log("Erro ao criar troca:", e);
    return res.status(500).json({ error: "Erro ao criar troca." });
  }
});

// --------------------------------------------------
// 📌 2. Aceitar troca
// --------------------------------------------------
router.post("/aceitar/:trocaID", autenticarToken, async (req, res) => {
  const trocaID = parseInt(req.params.trocaID);
  const usuarioID = req.user.usuarioID;

  try {
    const troca = await prisma.troca.findUnique({
      where: { trocaID }
    });

    if (!troca) return res.status(404).json({ error: "Troca não encontrada." });

    if (troca.usuarioParaID !== usuarioID) {
      return res.status(403).json({ error: "Não tens permissão para aceitar esta troca." });
    }

    if (troca.status !== "pendente") {
      return res.status(400).json({ error: "Esta troca já foi concluída." });
    }

    // ✔ Verificar se o jogador tem a carta pedida
    const possuiCarta = await prisma.usuarioCarta.findUnique({
      where: {
        usuarioID_cartaID: {
          usuarioID: usuarioID,
          cartaID: troca.cartaPedidaID
        }
      }
    });

    if (!possuiCarta) {
      return res.status(400).json({ error: "Não tens a carta pedida para completar a troca." });
    }

    // 🔄 PROCESSO DA TROCA
    await removerCarta(troca.usuarioDeID, troca.cartaOferecidaID);
    await removerCarta(troca.usuarioParaID, troca.cartaPedidaID);

    await adicionarCarta(troca.usuarioDeID, troca.cartaPedidaID);
    await adicionarCarta(troca.usuarioParaID, troca.cartaOferecidaID);

    // Atualizar status
    await prisma.troca.update({
      where: { trocaID },
      data: { status: "aceita" }
    });

    // 🔥 Notificar criador da troca
    const io = req.app.get("io");
    io.to(`user_${troca.usuarioDeID}`).emit("trocaAceita", {
      message: "A tua troca foi aceite! 🎉",
      trocaID
    });

    return res.json({ message: "Troca aceite com sucesso!" });

  } catch (e) {
    console.log("Erro ao aceitar troca:", e);
    return res.status(500).json({ error: "Erro ao aceitar troca." });
  }
});

// --------------------------------------------------
// 📌 3. Rejeitar troca
// --------------------------------------------------
router.post("/rejeitar/:trocaID", autenticarToken, async (req, res) => {
  const trocaID = parseInt(req.params.trocaID);
  const usuarioID = req.user.usuarioID;

  try {
    const troca = await prisma.troca.findUnique({
      where: { trocaID }
    });

    if (!troca) return res.status(404).json({ error: "Troca não encontrada." });

    if (troca.usuarioParaID !== usuarioID) {
      return res.status(403).json({ error: "Não tens permissão para rejeitar." });
    }

    if (troca.status !== "pendente") {
      return res.status(400).json({ error: "A troca já foi concluída." });
    }

    await prisma.troca.update({
      where: { trocaID },
      data: { status: "rejeitada" }
    });

    // Notificar criador
    const io = req.app.get("io");
    io.to(`user_${troca.usuarioDeID}`).emit("trocaRejeitada", {
      message: "A tua troca foi rejeitada ❌",
      trocaID
    });

    return res.json({ message: "Troca rejeitada." });

  } catch (e) {
    console.log("Erro ao rejeitar troca:", e);
    return res.status(500).json({ error: "Erro ao rejeitar troca." });
  }
});

// --------------------------------------------------
// 📌 4. Listar trocas pendentes recebidas
// --------------------------------------------------
router.get("/pendentes", autenticarToken, async (req, res) => {
  const usuarioID = req.user.usuarioID;

  try {
    const trocas = await prisma.troca.findMany({
      where: {
        usuarioParaID: usuarioID,
        status: "pendente"
      },
      include: {
        cartaOferecida: true,
        cartaPedida: true,
        usuarioDe: { select: { nome: true } }
      }
    });

    return res.json(trocas);

  } catch (e) {
    console.log("Erro ao buscar trocas:", e);
    return res.status(500).json({ error: "Erro ao buscar trocas pendentes." });
  }
});

export default router;
