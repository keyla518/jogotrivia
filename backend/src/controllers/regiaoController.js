import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const listarRegioes = async (req, res) => {
  try {
    const regioes = await prisma.regiao.findMany();
    res.json(regioes);
  } catch (error) {
    console.error("Erro ao listar regiões:", error);
    res.status(500).json({ error: "Erro ao carregar regiões" });
  }
};
