import api from "./axiosConfig";

export const getProfile = () => api.get("/utilizador/perfil");

export const updateProfile = (data: { nomeUsuario?: string; email?: string }) => 
  api.put("/utilizador/perfil", data);