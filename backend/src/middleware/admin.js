export const verificarAdmin = (req, res, next) => {
  // Assume que o token já foi autenticado e que req.user existe
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Acesso negado. Apenas administradores." });
  }
  next();
};
