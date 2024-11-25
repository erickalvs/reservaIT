const connectbd = require("../config/db");

const Reserva = {
  // Criar reserva
  criarReserva: async (
    cpf,
    idMesa,
    statusReserva,
    horaReserva,
    dataReserva,
    observacao
  ) => {
    try {
      const query = `
        INSERT INTO Reserva (idReserva, cpf, idMesa, statusReserva, horaReserva, dataReserva, observacao)
        VALUES (UUID(), ?, ?, ?, ?, ?, ?)
      `;
      const values = [
        cpf,
        idMesa,
        statusReserva,
        horaReserva,
        dataReserva,
        observacao || null,
      ];
      await connectbd.execute(query, values);
    } catch (error) {
      throw new Error("Erro ao criar reserva: " + error.message);
    }
  },

  // Listar reservas por CPF
  listarReservas: async (cpf) => {
    try {
      const query = `
        SELECT r.idReserva, r.dataReserva, r.horaReserva, r.observacao, 
        m.descricao AS mesaDescricao, u.nome AS nomeCliente
        FROM Reserva r
        JOIN Mesa m ON r.idMesa = m.idMesa
        JOIN Usuario u ON r.cpf = u.cpf
        WHERE u.cpf = ?
      `;
      const [rows] = await connectbd.execute(query, [cpf]);
      return rows;
    } catch (error) {
      throw new Error("Erro ao listar reservas: " + error.message);
    }
  },

  // Atualizar reserva
  atualizarReserva: async (
    idReserva,
    dataReserva,
    horaReserva,
    observacao,
    idMesa
  ) => {
    try {
      const query = `
        UPDATE Reserva
        SET dataReserva = ?, horaReserva = ?, observacao = ?, idMesa = ?
        WHERE idReserva = ?
      `;
      const values = [dataReserva, horaReserva, observacao, idMesa, idReserva];
      const [result] = await connectbd.execute(query, values);
      return result;
    } catch (error) {
      throw new Error("Erro ao atualizar reserva: " + error.message);
    }
  },

  // Deletar reserva
  deletarReserva: async (idReserva) => {
    try {
      const query = "DELETE FROM Reserva WHERE idReserva = ?";
      const [result] = await connectbd.execute(query, [idReserva]);
      return result;
    } catch (error) {
      throw new Error("Erro ao deletar reserva: " + error.message);
    }
  },

  // Buscar reserva por ID
  buscarReservaPorId: async (idReserva) => {
    try {
      const query = "SELECT * FROM Reserva WHERE idReserva = ?";
      const [rows] = await connectbd.execute(query, [idReserva]);
      return rows[0];
    } catch (error) {
      throw new Error("Erro ao buscar reserva por ID: " + error.message);
    }
  },

  // Função para listar reservas para o admin (sem filtro de CPF)
  listarReservasAdmin: async () => {
    try {
      const query = `
        SELECT r.idReserva, r.dataReserva, r.horaReserva, r.observacao, 
        m.descricao AS mesaDescricao, u.nome AS nomeCliente, r.statusReserva
        FROM Reserva r
        JOIN Mesa m ON r.idMesa = m.idMesa
        JOIN Usuario u ON r.cpf = u.cpf
      `;
      const [rows] = await connectbd.execute(query); // Executa a query sem filtro de CPF
      return rows;
    } catch (error) {
      throw new Error("Erro ao listar reservas para o admin: " + error.message);
    }
  },

  async atualizarReservaComStatus(idReserva, dadosAtualizados) {
    try {
      // Aqui, o código que busca a reserva no banco com base no id
      const reserva = await connectbd.query(
        "SELECT * FROM reserva WHERE idReserva = ?",
        [idReserva]
      );

      if (!reserva.length) {
        // Caso a reserva não seja encontrada
        return null;
      }

      // Atualiza a reserva
      await connectbd.query(
        `UPDATE reserva SET 
          dataReserva = ?, horaReserva = ?, observacao = ?, idMesa = ?, statusReserva = ? 
        WHERE idReserva = ?`,
        [
          dadosAtualizados.dataReserva,
          dadosAtualizados.horaReserva,
          dadosAtualizados.observacao,
          dadosAtualizados.idMesa,
          dadosAtualizados.status,
          idReserva,
        ]
      );

      // Retorna a reserva atualizada
      return true;
    } catch (error) {
      console.error("Erro ao atualizar reserva:", error);
      throw error;
    }
  },

  async buscarTodasReservas() {
    try {
      const [reservas] = await connectbd.execute("SELECT * FROM reserva");
      return reservas;
    } catch (error) {
      console.error("Erro ao buscar reservas:", error);
      throw error;
    }
  },

  async buscarReservasPorData(data) {
    let query = "SELECT * FROM reserva";
    let params = [];

    if (data) {
      query += " WHERE DATE(dataReserva) = ?";
      params.push(data);
    }

    return connectbd.execute(query, params);
  },

  // Buscar reservas de um usuário específico
  async buscarReservasPorUsuario(cpfUsuario) {
    const query = `
      SELECT idReserva, cpf, idMesa, statusReserva, dataReserva, horaReserva, observacao
      FROM reserva
      WHERE cpf = ?
      ORDER BY dataReserva DESC;
    `;

    try {
      const [reservas] = await connectbd.execute(query, [cpfUsuario]);

      console.log("Resultados no modelo:", reservas);

      return reservas; // Sempre retorna um array
    } catch (error) {
      console.error("Erro ao buscar reservas do usuário:", error);
      throw error;
    } // Retorna todas as reservas em um array
  },

  async buscarClientesPorReservas() {
    const sql = `
      SELECT 
        u.cpf,
        u.nome,
        COUNT(r.idReserva) AS totalReservas
      FROM 
        usuario u
      LEFT JOIN 
        reserva r 
      ON 
        u.cpf = r.cpf
      GROUP BY 
        u.cpf, u.nome
      ORDER BY 
        totalReservas DESC
    `;
    return connectbd.query(sql);
  },

  // Buscar usuário com mais reservas
  buscarUsuarioMaisReservas: () => {
    return connectbd.execute(
      "SELECT cpf, COUNT(*) AS qtdReservas FROM reserva GROUP BY cpf ORDER BY qtdReservas DESC LIMIT 1"
    );
  },
};

module.exports = Reserva;
