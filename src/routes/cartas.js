import express from "express";
import { PrismaClient } from "@prisma/client";
import { autenticarToken } from "../middleware/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

// ---------------------
// GET /cartas/colecao (listar coleção de cartas do usuário)
// --------------------

router.get("/cartas/colecao", autenticarToken, async (req, res) => {
  try {
    const usuarioID = req.user.usuarioID;

    // 1️⃣ Todas as cartas do jogo
    const todasCartas = await prisma.carta.findMany({
      orderBy: { cartaID: "asc" }
    });

    // 2️⃣ Inventário do jogador
    const inventario = await prisma.usuarioCarta.findMany({
      where: { usuarioID },
      select: {
        cartaID: true,
        quantidade: true
      }
    });

    const mapaInventario = {};
    inventario.forEach(item => {
      mapaInventario[item.cartaID] = item.quantidade;
    });

    // 3️⃣ Resposta final para o frontend
    const colecao = todasCartas.map(carta => ({
      cartaID: carta.cartaID,
      nome: carta.nomeCarta,
      raridade: carta.raridade,
      descricao: carta.descricao,
      possui: mapaInventario[carta.cartaID] > 0,
      quantidade: mapaInventario[carta.cartaID] || 0
    }));

    // 4️⃣ Progresso
    const totalCartas = todasCartas.length;
    const cartasObtidas = inventario.length;
    const progresso = ((cartasObtidas / totalCartas) * 100).toFixed(1);

    return res.json({
      totalCartas,
      cartasObtidas,
      progresso: progresso + "%",
      colecao
    });

  } catch (error) {
    console.log("Erro no endpoint /cartas/colecao:", error);
    res.status(500).json({ error: "Erro ao carregar coleção" });
  }
});

// ---------------------
// GET /cartas/:cartaID - apenas cartas desbloqueadas
// ---------------------

router.get("/cartas/:cartaID", autenticarToken, async (req, res) => {
  try {
    const usuarioID = req.user.usuarioID;
    const cartaID = parseInt(req.params.cartaID);

    // Verificar se o jogador possui a carta
    const usuarioCarta = await prisma.usuarioCarta.findUnique({
      where: {
        usuarioID_cartaID: { usuarioID, cartaID }
      }
    });

    if (!usuarioCarta) {
      return res.status(404).json({ error: "Carta não desbloqueada ❌" });
    }

    // Buscar dados da carta
    const carta = await prisma.carta.findUnique({
      where: { cartaID }
    });

    if (!carta) {
      return res.status(404).json({ error: "Carta não encontrada" });
    }

    return res.json({
      cartaID: carta.cartaID,
      nome: carta.nomeCarta,
      raridade: carta.raridade,
      descricao: carta.descricao,
      imagem: carta.imagem,
      quantidade: usuarioCarta.quantidade
    });

  } catch (error) {
    console.log("Erro no endpoint /cartas/:cartaID:", error);
    res.status(500).json({ error: "Erro ao carregar carta" });
  }
});

export default router;