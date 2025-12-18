import api from "./axiosConfig";

export const getMapaProgresso = async () => {
  const res = await api.get("/mapa/progresso");
  return res.data;
};
