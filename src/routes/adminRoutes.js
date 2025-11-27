import express from "express";
import {
  getQuestions,
  addQuestion,
  updateQuestion,
  deleteQuestion
} from "../controllers/adminController.js";

const router = express.Router();

// Rotas do administrador (agora em português)
router.get("/pergunta", getQuestions);          // Lista todas
router.post("/pergunta", addQuestion);          // Cria nova
router.put("/pergunta/:id", updateQuestion);    // Edita
router.delete("/pergunta/:id", deleteQuestion); // Deleta

export default router;
