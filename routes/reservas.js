const express = require("express");
const router = express.Router();
const reservaController = require("../controllers/reservaController");
const verificarAutenticacao = require("../middlewares/verificarAutenticacao");
const db = require("../config/db");
const adminController = require("../controllers/adminController");
const Reserva = require("../models/Reserva");

router.post("/criar", reservaController.criarReserva);
router.get("/listar", reservaController.listarReservas);
router.delete("/deletar/:id", reservaController.deletarReserva);
router.get("/mesas/listar", reservaController.listarMesas);
router.put("/atualizar/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { dataReserva, horaReserva, observacao, idMesa } = req.body;

    console.log("Recebendo dados para atualização:", {
      idReserva: id,
      dataReserva,
      horaReserva,
      observacao,
      idMesa,
    });

    if (!dataReserva || !horaReserva || !observacao || !idMesa) {
      return res.status(400).json({ message: "Dados incompletos!" });
    }

    const resultado = await reservaController.atualizarReserva(
      {
        params: { idReserva: id },
        body: { dataReserva, horaReserva, observacao, idMesa },
      },
      res
    );

    return resultado;
  } catch (error) {
    console.error("Erro ao atualizar reserva:", error);
    res.status(500).json({ message: "Erro interno no servidor." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [reservas] = await db.execute(
      "SELECT * FROM Reserva WHERE idReserva = ?",
      [id]
    );

    // Verifica se a reserva foi encontrada
    if (reservas.length === 0) {
      return res.status(404).json({ message: "Reserva não encontrada!" });
    }

    const reserva = reservas[0]; // Aqui pegamos o primeiro item do array
    res.status(200).json(reserva);
  } catch (error) {
    console.error("Erro ao buscar reserva:", error);
    res.status(500).json({ message: "Erro interno no servidor." });
  }
});



module.exports = router;
