import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import userRoutes from "./routes/user.js";
import perguntaRoutes from "./routes/perguntaRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import gameRoutes from "./routes/game.js";
import adminRoutes from "./routes/adminRoutes.js";
import cartasRoutes from "./routes/cartas.js";
import trocasRoutes from "./routes/trocas.js"; // nova rota de trocas

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // mais tarde podes limitar para o teu frontend
  }
});

// Disponibilizar io para TODAS as rotas
app.set("io", io);

// Ao conectar socket
io.on("connection", (socket) => {
  console.log("🔥 Cliente conectado:", socket.id);

  // Associar o socket a um usuário
  socket.on("registrarUsuario", (usuarioID) => {
    socket.join(`user_${usuarioID}`);
    console.log(`📌 Usuário ${usuarioID} entrou na sala user_${usuarioID}`);
  });

  socket.on("disconnect", () => {
    console.log("❌ Cliente desconectado:", socket.id);
  });
});

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use("/user", userRoutes);
app.use("/auth", authRoutes);
app.use("/api/pergunta", perguntaRoutes);
app.use("/jogo", gameRoutes);
app.use("/cartas", cartasRoutes);
app.use("/trocas", trocasRoutes);
app.use("/admin", adminRoutes); // backoffice

// Rota teste
app.get("/", (req, res) => {
  res.send("Servidor está funcionando ✅");
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () =>
  console.log(`🚀 Servidor + Socket.IO rodando na porta ${PORT}`)
);
