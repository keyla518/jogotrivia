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

// POST /perguntas
export const criarPergunta = async (req, res) => {
  const { textoPergunta, opcaoA, opcaoB, opcaoC, opcaoD, opcaoCerta, regiaoID, categoriaID } = req.body;

  try {
    const pergunta = await prisma.pergunta.create({
      data: {
        textoPergunta,
        opcaoA,
        opcaoB,
        opcaoC,
        opcaoD,
        opcaoCerta,
        regiaoID: Number(regiaoID),
        categoriaID: Number(categoriaID),
      },
    });
    res.status(201).json(pergunta);
  } catch (error) {
    console.error("Erro ao criar pergunta:", error);
    res.status(500).json({ error: "Erro ao criar pergunta" });
  }
};


// PUT /perguntas/:id
export const editarPergunta = async (req, res) => {
  const { id } = req.params;
  const { textoPergunta, opcaoA, opcaoB, opcaoC, opcaoD, opcaoCerta, regiaoID, categoriaID } = req.body;

  try {
    const pergunta = await prisma.pergunta.update({
      where: { perguntaID: Number(id) },
      data: {
        textoPergunta,
        opcaoA,
        opcaoB,
        opcaoC,
        opcaoD,
        opcaoCerta,
        regiaoID: Number(regiaoID),
        categoriaID: Number(categoriaID),
      },
    });
    res.json(pergunta);
  } catch (error) {
    console.error("Erro ao editar pergunta:", error);
    res.status(500).json({ error: "Erro ao editar pergunta" });
  }
};

// DELETE /perguntas/:id
export const deletarPergunta = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.pergunta.delete({
      where: { perguntaID: Number(id) },
    });
    res.json({ message: "Pergunta deletada com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar pergunta:", error);
    res.status(500).json({ error: "Erro ao deletar pergunta" });
  }
};

