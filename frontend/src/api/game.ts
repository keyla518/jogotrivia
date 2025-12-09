import api from "./axiosConfig";

export const fetchNextQuestion = () => api.get("/game/proxima-pergunta");

export const verifyAnswer = (data: {
  perguntaID: number;
  resposta: string;
}) => api.post("/game/verificar-resposta", data);

export const useHint = (data: { perguntaID: number }) =>
  api.post("/game/usar-pista", data);
