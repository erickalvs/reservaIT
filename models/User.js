const connectbd = require("../config/db");
const bcrypt = require("bcrypt");

class User {
  // Função para criar um novo usuário no banco de dados
  static async create({ cpf, nome, telefone, email, dataNasc, senha }) {
    const hashedPassword = await bcrypt.hash(senha, 10);
    const tipoUsuario = "C"; // Define o tipo de usuário como comum por padrão

    return connectbd.execute(
      "INSERT INTO Usuario (cpf, nome, telefone, email, dataNasc, tipoUsuario, senha) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [cpf, nome, telefone, email, dataNasc, tipoUsuario, hashedPassword]
    );
  }

  // Função para buscar um usuário pelo email
  static async findByEmail(email) {
    const [rows] = await connectbd.execute(
      "SELECT * FROM Usuario WHERE email = ?",
      [email]
    );
    return rows[0];
  }

  static async buscarTodosUsuarios() {
    try {
      const [usuarios] = await connectbd.execute("SELECT * FROM usuario");
      return usuarios;
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      throw error;
    }
  }

  static async buscarUsuarioComMaisReservas() {
    try {
      const [usuariosComReservas] = await connectbd.execute(`
        SELECT usuario.cpf, usuario.nome, COUNT(reserva.idReserva) AS numReservas
        FROM usuario
        LEFT JOIN reserva ON usuario.cpf = reserva.cpf
        GROUP BY usuario.cpf
        ORDER BY numReservas DESC
        LIMIT 1
      `);

      return usuariosComReservas[0]; // Retorna o usuário com mais reservas
    } catch (error) {
      console.error("Erro ao buscar usuário com mais reservas:", error);
      throw new Error("Erro ao buscar usuário com mais reservas");
    }
  }
}

module.exports = User;
