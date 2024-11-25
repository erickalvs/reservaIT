const jwt = require("jsonwebtoken");

function verificarAutenticacao(req, res, next) {
  // Obtém o token de autenticação do cabeçalho da requisição
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Token de autenticação não fornecido" });
  }

  // Verifica a validade do token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token inválido" });
    }

    // Adiciona as informações do usuário ao objeto req.user
    console.log("Decoded JWT:", decoded);
    req.user = decoded;

    // Prossegue para o próximo middleware ou controlador
    next();
  });
}

module.exports = verificarAutenticacao;
