import axios from "axios";

const API = "http://localhost:3000/api";
const token = localStorage.getItem("token");

export const getRegioes = async () => {
  const res = await axios.get(`${API}/regioes`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
