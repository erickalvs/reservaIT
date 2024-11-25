const db = require("../config/db");

const Avaliacao = {
  verificarAvaliacaoExistente: async (idReserva) => {
    try {
      const query = `SELECT * FROM avaliacao WHERE idReserva = ?`;
      const [rows] = await db.execute(query, [idReserva]);
      return rows.length > 0; // Retorna true se já houver avaliação
    } catch (error) {
      console.error("Erro ao verificar avaliação existente:", error);
      throw new Error("Erro ao verificar avaliação existente");
    }
  },

  criarAvaliacao: async (idReserva, nivel, comentario) => {
    try {
      const query = `
        INSERT INTO avaliacao (idAvaliacao, idReserva, nivel, comentario)
        VALUES (UUID(), ?, ?, ?)
      `;
      const values = [idReserva, nivel, comentario || null];
      await db.execute(query, values);
    } catch (error) {
      throw new Error("Erro ao criar avaliação: " + error.message);
    }
  },
};

function buscarAvaliacaoPorReserva(idReserva, callback) {
  const sql = "SELECT * FROM avaliacao WHERE idReserva = ?";
  db.query(sql, [idReserva], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
}

module.exports = { Avaliacao, buscarAvaliacaoPorReserva };
