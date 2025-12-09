import { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { registerUser } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [nomeUsuario, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [palavrapasse, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await registerUser({ nomeUsuario, email, palavrapasse });
      setSuccess(res.data.message || "Conta criada com sucesso!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao registrar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-sm mx-auto">
      <h2 className="text-xl mb-3">Criar conta</h2>

      {error && <p className="text-red-600 mb-2">{error}</p>}
      {success && <p className="text-green-600 mb-2">{success}</p>}

      <Input placeholder="Nome" onChange={(e) => setNome(e.target.value)} value={nomeUsuario} />
      <Input placeholder="Email" onChange={(e) => setEmail(e.target.value)} value={email} />
      <Input
        type="password"
        placeholder="Palavra-passe"
        onChange={(e) => setSenha(e.target.value)}
        value={palavrapasse}
      />

      <Button onClick={handleRegister} disabled={loading}>
        {loading ? "Registrando..." : "Registrar"}
      </Button>
    </div>
  );
}
