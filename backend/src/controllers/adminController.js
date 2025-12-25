import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


// -----------------------------
// Listar todas as perguntas com relações
// -----------------------------
export const getQuestions = async (req, res) => {
  try {
    const perguntas = await prisma.pergunta.findMany({
      include: {
        categoria: true,
        regiao: true,
        utilizadores: true
      }
    });
    res.status(200).json(perguntas);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar perguntas: " + err.message });
  }
};

// -----------------------------
// Adicionar nova pergunta
// -----------------------------
export const addQuestion = async (req, res) => {
  try {
    const { textoPergunta, opcaoA, opcaoB, opcaoC, opcaoD, opcaoCerta, categoriaID, regiaoID } = req.body;

    // Validação 
    if (!textoPergunta || !opcaoA || !opcaoB || !opcaoC || !opcaoD || !opcaoCerta || !categoriaID || !regiaoID) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios" });
    }

    const newPergunta = await prisma.pergunta.create({
      data: { textoPergunta, opcaoA, opcaoB, opcaoC, opcaoD, opcaoCerta, categoriaID, regiaoID },
      include: { categoria: true, regiao: true }
    });

    res.status(201).json(newPergunta);
  } catch (err) {
    res.status(500).json({ error: "Erro ao adicionar pergunta: " + err.message });
  }
};

// -----------------------------
// Editar pergunta existente
// -----------------------------
export const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { textoPergunta, opcaoA, opcaoB, opcaoC, opcaoD, opcaoCerta, categoriaID, regiaoID } = req.body;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: "ID da pergunta inválido" });
    }

    const updatedPergunta = await prisma.pergunta.update({
      where: { perguntaID: Number(id) },
      data: { textoPergunta, opcaoA, opcaoB, opcaoC, opcaoD, opcaoCerta, categoriaID, regiaoID },
      include: { categoria: true, regiao: true }
    });

    res.status(200).json(updatedPergunta);
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar pergunta: " + err.message });
  }
};

// -----------------------------
// Deletar pergunta
// -----------------------------
export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: "ID da pergunta inválido" });
    }

    await prisma.pergunta.delete({
      where: { perguntaID: Number(id) }
    });

    res.status(200).json({ message: "Pergunta deletada com sucesso" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao deletar pergunta: " + err.message });
  }
};
