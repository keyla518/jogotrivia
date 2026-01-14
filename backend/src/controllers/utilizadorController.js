import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/* --------------------------------------------------------
   LISTAR TODOS OS UTILIZADORES (APENAS ADMIN)
-------------------------------------------------------- */
export const listarUtilizadores = async (req, res) => {
  try {
    const utilizadores = await prisma.utilizador.findMany({
      select: {
        usuarioID: true,
        nomeUsuario: true,
        email: true,
        role: true,
        moedas: true,
        pontos: true,
      },
    });

    res.json(utilizadores);
  } catch (error) {
    console.error("Erro ao listar utilizadores:", error);
    res.status(500).json({ error: "Erro ao carregar utilizadores" });
  }
};

/* --------------------------------------------------------
   EDITAR UTILIZADOR (NOME E EMAIL)
-------------------------------------------------------- */
export const editarUtilizador = async (req, res) => {
  const { id } = req.params;
  const { nomeUsuario, email } = req.body;

  try {
    const utilizador = await prisma.utilizador.update({
      where: { usuarioID: Number(id) },
      data: {
        nomeUsuario,
        email,
      },
      select: {
        usuarioID: true,
        nomeUsuario: true,
        email: true,
        role: true,
        moedas: true,
        pontos: true,
      },
    });

    res.json(utilizador);
  } catch (error) {
    console.error("Erro ao editar utilizador:", error);
    res.status(500).json({ error: "Erro ao editar utilizador" });
  }
};



