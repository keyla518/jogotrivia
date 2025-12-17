import api from "./axiosConfig";

export const fetchNextQuestion = () => 
  api.get("/api/jogo/proxima-pergunta");

export const verifyAnswer = (data: {
  perguntaID: number;
  resposta: string;
}) => api.post("/api/jogo/verificar-resposta", data);

export const useHint = (data: { perguntaID: number }) =>
  api.post("/api/jogo/usar-pista", data);
