import api from "./axiosConfig";

type FetchNextQuestionParams = {
  regiaoID?: number;
};


export const fetchNextQuestion = async ({ regiaoID }: FetchNextQuestionParams = {}) => {
  return await api.get("/api/jogo/proxima-pergunta", { params: { regiaoID } });
};

export const verifyAnswer = (data: { perguntaID: number; resposta: string }) =>
  api.post("/api/jogo/verificar-resposta", data);


export const useHint = (data: { perguntaID: number }) =>
  api.post("/api/jogo/usar-pista", data);
