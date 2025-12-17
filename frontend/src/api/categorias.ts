import api from "./axiosConfig";

export const getCategorias = async () => {
  const res = await api.get("/categorias");
  return res.data;
};
