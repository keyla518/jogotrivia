import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import perguntasRoutes from "./routes/perguntasRoutes.js";
import regiaoRoutes from "./routes/regiaoRoutes.js";
import categoriaRoutes from "./routes/categoriaRoutes.js";
import utilizadorRoutes from "./routes/utilizadorRoutes.js";




dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());




// Rotas principais do jogo
app.use("/api/auth", authRoutes);

// utilizador autenticado
app.use("/api/utilizador", userRoutes);

// administração (admin)
app.use("/api/utilizadores", utilizadorRoutes);

// jogo
app.use("/api/jogo", gameRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/perguntas", perguntasRoutes);
app.use("/api/regioes", regiaoRoutes);
app.use("/api/categorias", categoriaRoutes);

// app.use("/user", userRoutes);
// app.use("/auth", authRoutes);
// app.use("/jogo", gameRoutes);
// app.use("/admin", adminRoutes);
// app.use("/api", perguntasRoutes);
// app.use("/api/regioes", regiaoRoutes);
// app.use("/api/categorias", categoriaRoutes);
// app.use("/api/utilizadores", utilizadorRoutes);
// app.use("/api/utilizador", userRoutes);



// Rota teste
app.get("/", (req, res) => {
  res.send("Servidor esta a funcionar");
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
