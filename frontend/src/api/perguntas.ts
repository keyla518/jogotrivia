import api from "./axiosConfig";

// GET
export const getPerguntas = async () => {
  const res = await api.get("/perguntas");
  return res.data;
};

export const getRegioes = async () => {
  const res = await api.get("/regioes");
  return res.data;
};

export const getCategorias = async () => {
  const res = await api.get("/categorias");
  return res.data;
};

// POST
export const criarPergunta = async (data: any) => {
  const res = await api.post("/perguntas", data);
  return res.data;
};

// PUT
export const editarPergunta = async (id: number, data: any) => {
  const res = await api.put(`/perguntas/${id}`, data);
  return res.data;
};

// DELETE
export const deletarPerguntaApi = async (id: number) => {
  const res = await api.delete(`/perguntas/${id}`);
  return res.data;
};
