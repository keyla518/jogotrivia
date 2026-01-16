import api from "./axiosConfig";

export const fetchUtilizadores = async () => {
  const response = await api.get("/utilizadores");
  return response.data;

};

export const updateUtilizador = async (
  id: number,
  data: { nomeUsuario: string; email: string }
) => {
  const response = await api.put(`/utilizadores/${id}`, data);
  return response.data;
};

