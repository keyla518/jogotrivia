import axios from "axios";

const API = "http://localhost:3000/api";
const token = localStorage.getItem("token");

export const getCategorias = async () => {
  const res = await axios.get(`${API}/categorias`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
