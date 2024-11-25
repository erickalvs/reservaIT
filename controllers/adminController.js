const Reserva = require("../models/Reserva");
const Mesa = require("../models/Mesa"); // Você precisará criar esse modelo
const User = require("../models/User"); // A correção para o modelo de Usuário

// Listar todas as reservas (admin)
exports.listarReservasAdmin = async (req, res) => {
  try {
    const isAdminModule = req.originalUrl.includes("/admin"); // Verifica se a URL contém '/admin'

    // Se for no módulo admin, não passa CPF, caso contrário, passa o CPF do usuário
    const reservas = isAdminModule
      ? await Reserva.listarReservasAdmin() // Chama a função para o admin
      : await Reserva.listarReservas(req.user.cpf); // Chama a função para o usuário normal

    res.status(200).json(reservas); // Retorna as reservas como resposta
  } catch (error) {
    console.error("Erro ao listar reservas:", error);
    res.status(500).json({ message: "Erro ao listar reservas." });
  }
};

exports.atualizarReservaComStatusAdmin = async (req, res) => {
  console.log("Parâmetros recebidos:", req.params);
  const { id } = req.params;
  const { dataReserva, horaReserva, observacao, idMesa, status } = req.body;

  console.log("id reserva: ", id);
  try {
    // Se algum dado essencial estiver faltando, retorna erro
    if (!dataReserva || !horaReserva || !idMesa || !status) {
      return res.status(400).json({ message: "Dados incompletos." });
    }

    // Chama o método do modelo para atualizar a reserva com status
    const reservaAtualizada = await Reserva.atualizarReservaComStatus(id, {
      dataReserva,
      horaReserva,
      observacao,
      idMesa,
      status,
    });

    if (reservaAtualizada) {
      return res.json({ message: "Reserva e status atualizados com sucesso!" });
    } else {
      return res.status(404).json({ message: "Reserva não encontrada." });
    }
  } catch (error) {
    console.error("Erro ao atualizar reserva com status:", error);
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
};

exports.deletarReservaAdmin = async (req, res) => {
  const { id } = req.params;
  console.log("idReserva recebido:", id); // Verificando se o id está correto

  try {
    const resultado = await Reserva.deletarReserva(id);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: "Reserva não encontrada." });
    }

    res.status(200).json({ message: "Reserva deletada com sucesso." });
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar reserva." });
  }
};

// Listar todas as mesas (admin)
exports.listarMesasAdmin = async (req, res) => {
  try {
    const mesas = await Mesa.listarMesas(); // Criar o método listarMesas em Mesa.js
    res.status(200).json(mesas);
  } catch (error) {
    console.error("Erro ao listar mesas:", error);
    res.status(500).json({ message: "Erro ao listar mesas." });
  }
};

// Atualizar mesa (admin)
exports.atualizarMesaAdmin = async (req, res) => {
  try {
    const { idMesa } = req.params;
    const { descricao, localizacao, numCadeiras, status } = req.body;

    const mesa = await Mesa.atualizarMesa(
      idMesa,
      descricao,
      localizacao,
      numCadeiras,
      status
    ); // Criar método de atualizar em Mesa.js

    if (!mesa) {
      return res.status(404).json({ message: "Mesa não encontrada!" });
    }

    res.status(200).json({ message: "Mesa atualizada com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar mesa:", error);
    res.status(500).json({ message: "Erro ao atualizar mesa." });
  }
};

// Deletar mesa (admin)
exports.deletarMesaAdmin = async (req, res) => {
  try {
    const { idMesa } = req.params;
    const mesa = await Mesa.deletarMesa(idMesa); // Criar método de deletar em Mesa.js

    if (!mesa) {
      return res.status(404).json({ message: "Mesa não encontrada!" });
    }

    res.status(200).json({ message: "Mesa excluída com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar mesa:", error);
    res.status(500).json({ message: "Erro ao deletar mesa." });
  }
};

// Listar todos os usuários (admin)
exports.listarUsuariosAdmin = async (req, res) => {
  try {
    const usuarios = await User.listarUsuarios(); // Criar o método listarUsuarios em User.js
    res.status(200).json(usuarios);
  } catch (error) {
    console.error("Erro ao listar usuários:", error);
    res.status(500).json({ message: "Erro ao listar usuários." });
  }
};

// Deletar usuário (admin)
exports.deletarUsuarioAdmin = async (req, res) => {
  try {
    const { idUsuario } = req.params;
    const usuario = await User.deletarUsuario(idUsuario); // Criar método de deletar em User.js

    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado!" });
    }

    res.status(200).json({ message: "Usuário excluído com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    res.status(500).json({ message: "Erro ao deletar usuário." });
  }
};

exports.buscarUsuario = async (req, res) => {
  const { cpf } = req.params;

  try {
    const usuario = await Mesa.buscarUsuarioPorCpf(cpf); // Chama a função do modelo

    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    res.status(200).json(usuario);
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    res.status(500).json({ message: "Erro ao buscar usuário" });
  }
};

// Função para atualizar status de administrador
exports.atualizarUsuario = async (req, res) => {
  const { cpf } = req.params;
  const { tipoUsuario } = req.body;

  try {
    const sucesso = await Mesa.atualizarStatusUsuario(cpf, tipoUsuario); // Chama a função do modelo

    if (!sucesso) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    res.status(200).json({ message: "Status atualizado com sucesso" });
  } catch (error) {
    console.error("Erro ao atualizar status do usuário:", error);
    res.status(500).json({ message: "Erro ao atualizar status do usuário" });
  }
};

//GERAR RELATORIOS

exports.gerarRelatorioUsuarios = async (req, res) => {
  try {
    const usuarios = await User.buscarTodosUsuarios(); // Chama o modelo para buscar usuários

    if (!usuarios.length) {
      return res.status(404).json({ message: "Nenhum usuário encontrado" });
    }

    res.status(200).json(usuarios); // Retorna os usuários encontrados
  } catch (error) {
    console.error("Erro ao gerar relatório de usuários:", error);
    res.status(500).json({ message: "Erro ao gerar relatório de usuários" });
  }
};

// Função para gerar relatório de reservas
exports.gerarRelatorioReservas = async (req, res) => {
  try {
    const reservas = await Reserva.buscarTodasReservas(); // Chama a função no model
    res.json(reservas); // Retorna os dados como JSON
  } catch (error) {
    console.error("Erro ao gerar relatório de reservas:", error);
    res.status(500).json({ message: "Erro ao gerar relatório de reservas" });
  }
};

exports.gerarRelatorioReservas = async (req, res) => {
  const { data } = req.query; // Obtém a data passada na query string

  try {
    const [reservas] = await Reserva.buscarReservasPorData(data);
    res.json(reservas);
  } catch (error) {
    console.error("Erro ao gerar relatório de reservas:", error);
    res.status(500).json({ message: "Erro ao gerar relatório de reservas" });
  }
};

// Gerar Relatório de Reservas de um Usuário Específico
exports.gerarRelatorioReservasUsuario = async (req, res) => {
  const { cpfUsuario } = req.params;

  console.log("cpfss:", cpfUsuario);

  try {
    const reservas = await Reserva.buscarReservasPorUsuario(cpfUsuario);
    console.log("Reservas encontradas:", reservas);

    if (!reservas || reservas.length === 0) {
      return res.json([]);
    }

    res.json(reservas);
  } catch (error) {
    console.error("Erro ao gerar relatório de reservas do usuário:", error);
    res
      .status(500)
      .json({ message: "Erro ao gerar relatório de reservas do usuário" });
  }
};

// Gerar Relatório de Usuário com Mais Reservas
exports.gerarRelatorioUsuarioMaisReservas = async (req, res) => {
  try {
    const usuarioComMaisReservas = await User.buscarUsuarioComMaisReservas();

    if (!usuarioComMaisReservas) {
      return res.status(404).json({ message: "Nenhum usuário encontrado." });
    }

    res.json(usuarioComMaisReservas);
  } catch (error) {
    console.error(
      "Erro ao gerar relatório de usuário com mais reservas:",
      error
    );
    res.status(500).json({
      message: "Erro ao gerar relatório de usuário com mais reservas",
    });
  }
};

exports.gerarRelatorioClientes = async (req, res) => {
  try {
    const [clientes] = await Reserva.buscarClientesPorReservas();
    if (clientes.length === 0) {
      return res.status(404).json({ message: "Nenhum cliente encontrado." });
    }
    res.json(clientes);
  } catch (error) {
    console.error("Erro ao gerar relatório de clientes:", error);
    res.status(500).json({ message: "Erro ao gerar relatório de clientes." });
  }
};
