import { useEffect, useState } from "react";
import { getProfile } from "../api/user";

export default function Profile() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    getProfile().then((res) => setUser(res.data.usuario));
  }, []);

  if (!user) return <p>Carregando...</p>;

  return (
    <div className="p-4">
      <h2>Perfil</h2>
      <p>Nome: {user.nomeUsuario}</p>
      <p>Email: {user.email}</p>
      <p>Moedas: {user.moedas}</p>
      <p>XP: {user.xp}</p>
    </div>
  );
}
