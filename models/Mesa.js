// models/mesa.js
const db = require("../config/db"); // Supondo que você tenha um arquivo de configuração para o banco de dados

// Função para listar todas as mesas
const listarMesas = () => {
  return db.execute("SELECT * FROM mesa");
};

// Função para obter detalhes de uma mesa específica
const obterMesa = (idMesa) => {
  return db.execute("SELECT * FROM mesa WHERE idMesa = ?", [idMesa]);
};

// Função para adicionar uma nova mesa
const adicionarMesa = (idMesa, status, descricao, localizacao, numCadeiras) => {
  const query =
    "INSERT INTO mesa (idMesa, status, descricao, localizacao, numCadeiras) VALUES (?, ?, ?, ?, ?)";
  return db.execute(query, [
    idMesa,
    status,
    descricao,
    localizacao,
    numCadeiras,
  ]);
};

// Função para atualizar informações de uma mesa
const atualizarMesa = (idMesa, status, descricao, localizacao, numCadeiras) => {
  status = status === undefined ? null : status;
  descricao = descricao === undefined ? null : descricao;
  localizacao = localizacao === undefined ? null : localizacao;
  numCadeiras = numCadeiras === undefined ? null : numCadeiras;
  console.log("toaqui");
  return db.execute(
    "UPDATE mesa SET status = ?, descricao = ?, localizacao = ?, numCadeiras = ? WHERE idMesa = ?",
    [status, descricao, localizacao, numCadeiras, idMesa]
  );
};

// Função para excluir uma mesa
const excluirMesa = (idMesa) => {
  return db.execute("DELETE FROM mesa WHERE idMesa = ?", [idMesa]);
};

const buscarUsuarioPorCpf = async (cpf) => {
  try {
    const [usuario] = await db.execute("SELECT * FROM usuario WHERE cpf = ?", [
      cpf,
    ]);
    return usuario.length ? usuario[0] : null;
  } catch (error) {
    throw new Error("Erro ao buscar usuário: " + error.message);
  }
};

// Função para atualizar o status de administrador de um usuário
const atualizarStatusUsuario = async (cpf, tipoUsuario) => {
  try {
    const [result] = await db.execute(
      "UPDATE usuario SET tipoUsuario = ? WHERE cpf = ?",
      [tipoUsuario, cpf]
    );
    return result.affectedRows > 0; // Retorna true se o usuário foi encontrado e atualizado
  } catch (error) {
    throw new Error("Erro ao atualizar status do usuário: " + error.message);
  }
};

module.exports = {
  listarMesas,
  obterMesa,
  adicionarMesa,
  atualizarMesa,
  excluirMesa,
  buscarUsuarioPorCpf,
  atualizarStatusUsuario,
};
