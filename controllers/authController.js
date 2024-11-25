const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const connectbd = require("../config/db");
const path = require("path");
require("dotenv").config();

// Função para cadastro de usuário
exports.register = async (req, res) => {
  const { cpf, nome, telefone, email, dataNasc, senha } = req.body;

  try {
    if (!cpf || !nome || !telefone || !email || !dataNasc || !senha) {
      return res
        .status(400)
        .json({ message: "Todos os campos são obrigatórios!" });
    }

    // Criptografa a senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(senha, salt);

    // Define o tipo de usuário como "C" (comum) por padrão
    const tipoUsuario = "C";

    // Insere o usuário no banco de dados
    await connectbd.execute(
      "INSERT INTO Usuario (cpf, nome, telefone, email, dataNasc, tipoUsuario, senha) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [cpf, nome, telefone, email, dataNasc, tipoUsuario, hashedPassword]
    );

    res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erro no servidor, tente novamente mais tarde." });
  }
};

// Função para login de usuário
exports.login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const rows = await connectbd.execute(
      "SELECT * FROM usuario WHERE email = ?",
      [email]
    );
    console.log("rows", rows[0][0]);

    if (rows.length === 0) {
      console.log("Usuário não encontrado");
      return res.status(400).json({ message: "Credenciais inválidas!" });
    }

    const user = rows[0][0];
    console.log("Usuário encontrado: ", user); // Adicionando log para verificar os dados do usuário
    console.log("comparação", senha, user.senha);
    const isPasswordValid = await bcrypt.compare(senha, user.senha);
    //console.log("Senha válida: ", isPasswordValid); // Verificar se a comparação está retornando true ou false
    console.log(isPasswordValid);
    if (isPasswordValid) {
      return res.status(200).json({ message: "Credenciais válidas" });
    }

    const token = jwt.sign(
      {
        id: user.cpf,
        nome: user.nome,
        email: user.email,
        tipo_usuario: user.tipoUsuario,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login bem-sucedido!", token });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erro no servidor, tente novamente mais tarde." });
  }
};

// Controller para mostrar o formulário de login
exports.showLoginForm = (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "login.html"));
};
