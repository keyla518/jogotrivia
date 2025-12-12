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
   PROMOVER UTILIZADOR A ADMIN
-------------------------------------------------------- */
export const promoverAdmin = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.utilizador.update({
      where: { usuarioID: Number(id) },
      data: { role: "administrador" },
    });

    res.json({
      message: "Utilizador promovido para administrador.",
      user
    });
  } catch (error) {
    console.error("Erro ao promover:", error);
    res.status(500).json({ error: "Erro ao promover utilizador" });
  }
};

/* --------------------------------------------------------
   DESPROMOVER ADMIN → JOGADOR
-------------------------------------------------------- */
export const removerAdmin = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.utilizador.update({
      where: { usuarioID: Number(id) },
      data: { role: "jogador" },
    });

    res.json({
      message: "Administrador despromovido para jogador.",
      user
    });
  } catch (error) {
    console.error("Erro ao remover admin:", error);
    res.status(500).json({ error: "Erro ao remover administrador" });
  }
};

/* --------------------------------------------------------
   BLOQUEAR / DESBLOQUEAR (Opcional)
   Requiere un campo "ativo" en tu tabela, si quieres usarlo.
-------------------------------------------------------- */
export const bloquearUtilizador = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.utilizador.update({
      where: { usuarioID: Number(id) },
      data: { ativo: false },
    });

    res.json({ message: "Utilizador bloqueado.", user });
  } catch (error) {
    console.error("Erro ao bloquear:", error);
    res.status(500).json({ error: "Erro ao bloquear utilizador" });
  }
};

export const desbloquearUtilizador = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.utilizador.update({
      where: { usuarioID: Number(id) },
      data: { ativo: true },
    });

    res.json({ message: "Utilizador desbloqueado.", user });
  } catch (error) {
    console.error("Erro ao desbloquear:", error);
    res.status(500).json({ error: "Erro ao desbloquear utilizador" });
  }
};
