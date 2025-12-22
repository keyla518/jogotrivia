import api from "./axiosConfig";

type FetchNextQuestionParams = {
  regiaoID?: number;
};


export const fetchNextQuestion = async ({ regiaoID }: FetchNextQuestionParams = {}) => {
  return await api.get("/jogo/proxima-pergunta", { params: { regiaoID } });
};

export const verifyAnswer = (data: { perguntaID: number; resposta: string }) =>
  api.post("/jogo/verificar-resposta", data);


export const useHint = (data: { perguntaID: number }) =>
  api.post("/jogo/usar-pista", data);
