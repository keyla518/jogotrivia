import api from "./axiosConfig";

export const fetchUtilizadores = async () => {
  const response = await api.get("/utilizadores");
  return response.data;
};

export const promoverUtilizador = async (id: number) => {
  const response = await api.put(`/utilizadores/${id}/promover`);
  return response.data;
};

export const removerAdmin = async (id: number) => {
  const response = await api.put(`/utilizadores/${id}/remover-admin`);
  return response.data;
};
