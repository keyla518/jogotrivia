import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /perguntas
export const getPerguntas = async (req, res) => {
  try {
    const perguntas = await prisma.pergunta.findMany({
      include: {
        regiao: true,
        categoria: true,
      },
    });
    res.json(perguntas);
  } catch (error) {
    console.error("Erro ao buscar perguntas:", error);
    res.status(500).json({ error: "Erro ao buscar perguntas" });
  }
};

// GET /regioes
export const getRegioes = async (req, res) => {
  try {
    const regioes = await prisma.regiao.findMany();
    res.json(regioes);
  } catch (error) {
    console.error("Erro ao buscar regiões:", error);
    res.status(500).json({ error: "Erro ao buscar regiões" });
  }
};

// GET /categorias
export const getCategorias = async (req, res) => {
  try {
    const categorias = await prisma.categoria.findMany();
    res.json(categorias);
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    res.status(500).json({ error: "Erro ao buscar categorias" });
  }
};
