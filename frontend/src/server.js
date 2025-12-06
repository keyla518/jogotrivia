import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import userRoutes from "./routes/user.js";
import perguntaRoutes from "./routes/perguntaRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import gameRoutes from "./routes/game.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas principais do jogo
app.use("/user", userRoutes);
app.use("/auth", authRoutes);
app.use("/api/pergunta", perguntaRoutes);
app.use("/jogo", gameRoutes);
app.use("/admin", adminRoutes);

// Rota teste
app.get("/", (req, res) => {
  res.send("Servidor está funcionando ✅");
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
