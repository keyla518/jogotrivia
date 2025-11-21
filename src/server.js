import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

import userRoutes from "./routes/user.js";
import perguntaRoutes from "./routes/perguntaRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import gameRoutes from "./routes/game.js"; // ✅ IMPORTANTE

dotenv.config();
const app = express();
const prisma = new PrismaClient();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use("/user", userRoutes);
app.use("/auth", authRoutes);
app.use("/api/pergunta", perguntaRoutes);
app.use("/jogo", gameRoutes); // ✅ AGORA PROXIMA-PERGUNTA FUNCIONA

// Rota teste
app.get("/", (req, res) => {
  res.send("Servidor está funcionando ✅");
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
