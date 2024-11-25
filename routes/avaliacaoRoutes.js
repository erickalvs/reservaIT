const express = require("express");
const router = express.Router();
const avaliacaoController = require("../controllers/avaliacaoController");

// Rota para criar avaliação
router.post("/avaliacoes/criar", avaliacaoController.criarAvaliacao);

// Rota para buscar avaliação por reserva
router.get(
  "/avaliacoes/:idReserva",
  avaliacaoController.buscarAvaliacaoPorReserva
);

module.exports = router;
