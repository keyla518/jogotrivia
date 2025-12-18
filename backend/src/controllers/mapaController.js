import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const obterProgressoMapa = async (req, res) => {
  const usuarioID = req.user.usuarioID;

  try {
    const progresso = await prisma.progressoCategoriaRegiao.findMany({
      where: { usuarioID }
    });

    const regioes = ordemRegioes.map(regiaoID => {
      const categorias = progresso.filter(p => p.regiaoID === regiaoID);

      if (categorias.length === 0) {
        return { id: regiaoID, status: "locked" };
      }

      if (categorias.every(c => c.concluido)) {
        return { id: regiaoID, status: "completed" };
      }

      return { id: regiaoID, status: "current" };
    });

    const regiaoAtual =
      regioes.find(r => r.status === "current")?.id || null;

    res.json({ regioes, regiaoAtual });
  } catch (error) {
    res.status(500).json({ error: "Erro ao obter progresso do mapa" });
  }
};
