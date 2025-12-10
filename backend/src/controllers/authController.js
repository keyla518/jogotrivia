import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const register = async (req, res) => {
  const { nomeUsuario, email, palavrapasse } = req.body;

  try {
    // 1️⃣ Verificar se o email já existe
    const existente = await prisma.utilizador.findUnique({ where: { email } });
    if (existente)
      return res.status(400).json({ error: "Email já está em uso." });

    // 2️⃣ Hash da senha
    const hash = await bcrypt.hash(palavrapasse, 10);

    // 3️⃣ Criar o novo usuário
    const novoUsuario = await prisma.utilizador.create({
      data: {
        nomeUsuario,
        email,
        palavrapasse: hash,
      },
    });

    // 4️⃣ Buscar todas as regiões e categorias
    const regioes = await prisma.regiao.findMany();
    const categorias = await prisma.categoria.findMany();

    // 5️⃣ Criar progresso inicial
    for (const reg of regioes) {
      for (const cat of categorias) {
        await prisma.progressoCategoriaRegiao.create({
          data: {
            usuarioID: novoUsuario.usuarioID,
            regiaoID: reg.regiaoID,
            categoriaID: cat.categoriaID,
            concluido: reg.nomeRegiao === "Algarve",
          },
        });
      }
    }

    delete novoUsuario.palavrapasse;

    return res.json({
      message: "Conta criada com sucesso! Progresso inicial configurado.",
      user: novoUsuario,
    });
  } catch (error) {
    console.log("Erro no register:", error);
    res.status(500).json({ error: "Erro ao criar conta" });
  }
};

export const login = async (req, res) => {
  const { email, palavrapasse } = req.body;

  try {
    // Buscar utilizador por email
    const user = await prisma.utilizador.findUnique({ where: { email } });
    if (!user)
      return res.status(400).json({ error: "Email ou senha incorretos" });

    // Verificar password
    const senhaValida = await bcrypt.compare(palavrapasse, user.palavrapasse);
    if (!senhaValida)
      return res.status(400).json({ error: "Email ou senha incorretos" });

    const token = jwt.sign(
      { usuarioID: user.usuarioID, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    //devolver token e role
    return res.json({
      message: "Login efetuado com sucesso",
      token,
      role: user.role,
    });
  } catch (error) {
    console.log("Erro no login:", error);
    res.status(500).json({ error: "Erro ao efetuar login" });
  }
};
