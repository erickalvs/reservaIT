const Reserva = require("../models/Reserva");
const connectbd = require("../config/db");

exports.criarReserva = async (req, res) => {
  console.log("Corpo da requisição recebido:", req.body);

  const observacao = req.body.objetivoReserva || "Sem observação";
  const { email, dataReserva, horaReserva, idMesa, statusReserva } = req.body;

  if (!email || !dataReserva || !horaReserva || !idMesa || !statusReserva) {
    return res.status(400).json({
      message: "Todos os campos obrigatórios devem ser preenchidos.",
    });
  }

  try {
    const [usuarios] = await connectbd.query(
      "SELECT cpf FROM usuario WHERE email = ?",
      [email]
    );

    if (usuarios.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    const cpf = usuarios[0].cpf;

    // Criando reserva utilizando o modelo
    await Reserva.criarReserva(
      cpf,
      idMesa,
      statusReserva,
      horaReserva,
      dataReserva,
      observacao
    );

    res.status(201).json({ message: "Reserva criada com sucesso." });
  } catch (error) {
    console.error("Erro ao criar reserva:", error);
    res
      .status(500)
      .json({ message: "Erro ao criar reserva.", error: error.message });
  }
};

exports.listarReservas = async (req, res) => {
  try {
    const email = req.query.email;

    if (!email) {
      return res.status(400).json({ error: "Email não fornecido." });
    }

    const [usuario] = await connectbd.query(
      "SELECT cpf FROM Usuario WHERE email = ?",
      [email]
    );

    if (usuario.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    const cpf = usuario[0].cpf;

    const reservas = await Reserva.listarReservas(cpf);

    if (reservas.length === 0) {
      return res.status(404).json({ message: "Nenhuma reserva encontrada." });
    }

    res.status(200).json(reservas);
  } catch (error) {
    console.error("Erro ao listar reservas:", error);
    res.status(500).json({ message: "Erro no servidor ao listar reservas." });
  }
};

exports.atualizarReserva = async (req, res) => {
  try {
    const { idReserva } = req.params;
    const { dataReserva, horaReserva, observacao, idMesa } = req.body;

    if (!idReserva || !dataReserva || !horaReserva || !observacao || !idMesa) {
      return res
        .status(400)
        .json({ error: "Dados incompletos ou inválidos para atualização." });
    }

    const result = await Reserva.atualizarReserva(
      idReserva,
      dataReserva,
      horaReserva,
      observacao,
      idMesa
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Reserva não encontrada." });
    }

    res.status(200).json({ message: "Reserva atualizada com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar reserva:", error);
    return res.status(500).json({ error: "Erro ao atualizar reserva." });
  }
};

exports.deletarReserva = async (req, res) => {
  try {
    const reservaId = req.params.id;

    if (!reservaId) {
      return res.status(400).json({ error: "ID da reserva não fornecido." });
    }

    const result = await Reserva.deletarReserva(reservaId);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "Reserva não encontrada para exclusão." });
    }

    res.status(200).json({ message: "Reserva deletada com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar reserva:", error);
    res.status(500).json({ message: "Erro no servidor ao deletar reserva." });
  }
};

exports.listarMesas = async (req, res) => {
  try {
    const [mesas] = await connectbd.execute(
      "SELECT idMesa, descricao, localizacao, numCadeiras, status FROM Mesa"
    );

    res.status(200).json(mesas);
  } catch (error) {
    console.error("Erro ao listar mesas:", error);
    res.status(500).json({ message: "Erro no servidor ao listar mesas." });
  }
};

exports.buscarReservaPorId = async (idReserva) => {
  try {
    const reserva = await Reserva.buscarReservaPorId(idReserva);
    return reserva;
  } catch (error) {
    console.error("Erro ao buscar reserva por ID:", error);
    throw error;
  }
};
