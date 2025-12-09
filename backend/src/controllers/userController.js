import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const obterPerfil = async (req, res) => {
  try {
    const usuario = await prisma.utilizador.findUnique({
      where: { usuarioID: req.user.usuarioID },
      select: {
        usuarioID: true,
        nomeUsuario: true,
        email: true,
        moedas: true,
        xp: true
      }
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.json({
      message: "Perfil carregado ✅",
      usuario
    });

  } catch (error) {
    console.log("Erro ao carregar perfil:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};
