import jwt from "jsonwebtoken";

export function autenticarToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer token

  if (!token) {
    return res.status(401).json({ error: "Token não fornecido ❌" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Agora podemos acessar usuarioID e role
    next();
  } catch {
    return res.status(403).json({ error: "Token inválido ❌" });
  }
}
