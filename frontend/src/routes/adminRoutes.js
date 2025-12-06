import express from "express";
import { autenticarToken } from "../middleware/auth.js";
import { verificarAdmin } from "../middleware/admin.js";
import { getQuestions, addQuestion, updateQuestion, deleteQuestion } from "../controllers/adminController.js";

const router = express.Router();

router.get("/pergunta", getQuestions);          // Lista todas
router.post("/pergunta", addQuestion);          // Cria nova
router.put("/pergunta/:id", updateQuestion);    // Edita
router.delete("/pergunta/:id", deleteQuestion); // Deleta

export default router;
