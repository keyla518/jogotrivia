import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const router = express.Router();
const prisma = new PrismaClient();

// ----------------------
// ROTA: REGISTO + PROGRESSO INICIAL
// ----------------------
router.post("/register", async (req, res) => {
  const { nomeUsuario, email, palavrapasse } = req.body;

  try {
    const existente = await prisma.utilizador.findUnique({ where: { email } });
    if (existente) return res.status(400).json({ error: "Email já está em uso." });

    const hash = await bcrypt.hash(palavrapasse, 10);

    const novoUsuario = await prisma.utilizador.create({
      data: {
        nomeUsuario,
        email,
        palavrapasse: hash
      }
    });

    // Criar progresso inicial
    const regioes = await prisma.regiao.findMany();
    const categorias = await prisma.categoria.findMany();

    for (const reg of regioes) {
      for (const cat of categorias) {
        await prisma.progressoCategoriaRegiao.create({
          data: {
            usuarioID: novoUsuario.usuarioID,
            regiaoID: reg.regiaoID,
            categoriaID: cat.categoriaID,

            // CORRIGIDO: Algarve = desbloqueado
            concluido: reg.nomeRegiao === "Algarve"
          }
        });
      }
    }

    res.json({
      message: "Conta criada com sucesso ✅ Progresso inicial configurado!",
      user: novoUsuario
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro ao criar conta" });
  }
});

// ----------------------
// ROTA: LOGIN
// ----------------------
router.post("/login", async (req, res) => {
  const { email, palavrapasse } = req.body;

  try {
    const user = await prisma.utilizador.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: "Email ou senha incorretos" });

    const senhaValida = await bcrypt.compare(palavrapasse, user.palavrapasse);
    if (!senhaValida) return res.status(400).json({ error: "Email ou senha incorretos" });

    const token = jwt.sign(
      { usuarioID: user.usuarioID, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({ message: "Login efetuado com sucesso ✅", token });

  } catch (error) {
    res.status(500).json({ error: "Erro ao efetuar login" });
  }
});

// EXPORTAR O ROUTER
export default router;
