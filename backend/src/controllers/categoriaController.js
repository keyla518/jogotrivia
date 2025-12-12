import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const listarCategorias = async (req, res) => {
  try {
    const categorias = await prisma.categoria.findMany();
    res.json(categorias);
  } catch (error) {
    console.error("Erro ao listar categorias:", error);
    res.status(500).json({ error: "Erro ao carregar categorias" });
  }
};
