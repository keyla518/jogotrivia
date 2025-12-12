import axios from "axios";

const API_URL = "http://localhost:3000/api/utilizadores";

export async function fetchUtilizadores() {
  const token = localStorage.getItem("token");

  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return response.data;
}

export async function promoverUtilizador(id: number) {
  const token = localStorage.getItem("token");

  const response = await axios.put(`${API_URL}/${id}/promover`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return response.data;
}

export async function removerAdmin(id: number) {
  const token = localStorage.getItem("token");

  const response = await axios.put(`${API_URL}/${id}/remover-admin`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return response.data;
}
