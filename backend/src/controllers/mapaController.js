import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const ordemRegioes = [1, 2, 3, 4, 5,6,7]; 

export const obterProgressoMapa = async (req, res) => {
  const usuarioID = req.user.usuarioID;

  try {
    const progresso = await prisma.progressoCategoriaRegiao.findMany({
      where: { usuarioID }
    });

    // Mapear cada região para seu status
    const regioes = ordemRegioes.map(regiaoID => {
      const categorias = progresso.filter(p => p.regiaoID === regiaoID);

      // Região ainda não iniciada = locked
      if (categorias.length === 0) {
        return { id: regiaoID, status: "locked" };
      }

      // Região concluída = completed
      if (categorias.every(c => c.concluido)) {
        return { id: regiaoID, status: "completed" };
      }

      // Região em progresso = current
      return { id: regiaoID, status: "current" };
    });

    const regiaoAtual = regioes.find(r => r.status === "current")?.id || null;

    res.json({ regioes, regiaoAtual });
  } catch (error) {
    console.error("Erro ao obter progresso do mapa:", error);
    res.status(500).json({ error: "Erro ao obter progresso do mapa" });
  }
};

export const obterDetalhesRegiao = async (req, res) => {
  const usuarioID = req.user.usuarioID;
  const { regiaoID } = req.params;

  try {
    const progresso = await prisma.progressoCategoriaRegiao.findMany({
      where: { 
        usuarioID,
        regiaoID: parseInt(regiaoID)
      },
      include: {
        categoria: true
      }
    });

    const regiao = await prisma.regiao.findUnique({
      where: { regiaoID: parseInt(regiaoID) }
    });

    const totalCategorias = progresso.length;
    const categoriasCompletas = progresso.filter(p => p.concluido).length;
    const percentagem = totalCategorias > 0 
      ? Math.round((categoriasCompletas / totalCategorias) * 100) 
      : 0;

    res.json({
      regiao: regiao?.nomeRegiao,
      totalCategorias,
      categoriasCompletas,
      percentagem,
      categorias: progresso.map(p => ({
        nome: p.categoria.nomeCategoria,
        concluida: p.concluido
      }))
    });
  } catch (error) {
    console.error("Erro ao obter detalhes da região:", error);
    res.status(500).json({ error: "Erro ao obter detalhes da região" });
  }
};