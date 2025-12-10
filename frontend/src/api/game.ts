import api from "./axiosConfig";

export const fetchNextQuestion = () => 
  api.get("/jogo/proxima-pergunta");

export const verifyAnswer = (data: {
  perguntaID: number;
  resposta: string;
}) => api.post("/jogo/verificar-resposta", data);

export const useHint = (data: { perguntaID: number }) =>
  api.post("/jogo/usar-pista", data);
