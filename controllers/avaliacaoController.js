const avaliacaoModel = require("../models/Avaliacao");

// Criar avaliação
exports.criarAvaliacao = async (req, res) => {
  try {
    const { idReserva, nivel, comentario } = req.body;

    if (!idReserva || !nivel) {
      return res.status(400).json({ message: "Dados insuficientes." });
    }

    await Avaliacao.criarAvaliacao(idReserva, nivel, comentario);
    res.status(201).json({ message: "Avaliação criada com sucesso!" });
  } catch (error) {
    console.error("Erro ao criar avaliação:", error);
    res.status(500).json({ message: "Erro ao criar avaliação." });
  }
};

// Buscar avaliação por reserva
function buscarAvaliacaoPorReserva(req, res) {
  const { idReserva } = req.params;

  avaliacaoModel.buscarAvaliacaoPorReserva(idReserva, (err, result) => {
    if (err) {
      return res.status(500).json({ mensagem: "Erro ao buscar avaliação." });
    }
    res.json(result);
  });
}

module.exports = { criarAvaliacao, buscarAvaliacaoPorReserva };
