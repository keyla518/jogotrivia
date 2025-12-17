import api from "./axiosConfig";

export const getRegioes = async () => {
  const res = await api.get("/regioes");
  return res.data;
};
