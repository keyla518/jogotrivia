import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Listar todas as perguntas com respostas
export const getQuestions = async (req, res) => {
  try {
    const perguntas = await prisma.pergunta.findMany({
      include: {
        categoria: true,
        regiao: true,
        utilizadores: true
      }
    });
    res.json(perguntas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Adicionar pergunta
export const addQuestion = async (req, res) => {
  try {
    const { textoPergunta, opcaoA, opcaoB, opcaoC, opcaoD, opcaoCerta, categoriaID, regiaoID } = req.body;

    const newPergunta = await prisma.pergunta.create({
      data: {
        textoPergunta,
        opcaoA,
        opcaoB,
        opcaoC,
        opcaoD,
        opcaoCerta,
        categoriaID,
        regiaoID
      },
      include: { categoria: true, regiao: true }
    });

    res.json(newPergunta);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Editar pergunta
export const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { textoPergunta, opcaoA, opcaoB, opcaoC, opcaoD, opcaoCerta, categoriaID, regiaoID } = req.body;

    const updatedPergunta = await prisma.pergunta.update({
      where: { perguntaID: Number(id) },
      data: { textoPergunta, opcaoA, opcaoB, opcaoC, opcaoD, opcaoCerta, categoriaID, regiaoID }
    });

    res.json(updatedPergunta);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Deletar pergunta
export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.pergunta.delete({
      where: { perguntaID: Number(id) }
    });

    res.json({ message: "Pergunta deletada" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
