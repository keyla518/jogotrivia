import api from "./axiosConfig";

export const registerUser = (data: {
  nomeUsuario: string;
  email: string;
  palavrapasse: string;
}) => api.post("api/auth/register", data);

export const loginUser = (data: {
  email: string;
  palavrapasse: string;
}) => api.post("api/auth/login", data);
