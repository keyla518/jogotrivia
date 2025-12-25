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
        pontos: true
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


// endpoint para buscar dados do utilizador:
export const obterDadosUsuario = async (req, res) => {
  const usuarioID = req.user.usuarioID;

  try {
    const usuario = await prisma.utilizador.findUnique({
      where: { usuarioID },
      select: { moedas: true, pontos: true, nomeUsuario: true }
    });

    if (!usuario) {
      return res.status(404).json({ error: "Utilizador não encontrado" });
    }

    res.json({
      moedas: usuario.moedas,
      pontos: usuario.pontos,
      nome: usuario.nomeUsuario
    });
  } catch (error) {
    console.log("Erro ao obter dados do utilizador:", error);
    res.status(500).json({ error: "Erro ao carregar dados" });
  }
};
