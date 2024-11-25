const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const mesaController = require("../controllers/mesaController");

// Reservas
router.get("/listarReservasAdmin", adminController.listarReservasAdmin);
router.put(
  "/atualizarReservaAdmin/:id",
  adminController.atualizarReservaComStatusAdmin
);
router.delete("/deletarReservaAdmin/:id", adminController.deletarReservaAdmin);

router.get("/usuarios", adminController.listarUsuariosAdmin);
router.delete("/usuarios/:id", adminController.deletarUsuarioAdmin);

router.get("/buscarUsuario/:cpf", adminController.buscarUsuario);
// Definindo a rota PUT para atualizar o tipo de usuário
router.put("/atualizarUsuario/:cpf", adminController.atualizarUsuario);

// Rota para gerar relatório de usuários
router.get("/relatorio/usuarios", adminController.gerarRelatorioUsuarios);

// Rota para gerar relatório de reservas
router.get("/relatorio/reservas", adminController.gerarRelatorioReservas);

router.get(
  "/relatorio/reservas/usuario/:cpfUsuario",
  adminController.gerarRelatorioReservasUsuario
);

router.get(
  "/relatorio/usuario/maisreservas",
  adminController.gerarRelatorioUsuarioMaisReservas
);

router.get("/relatorio/clientes", adminController.gerarRelatorioClientes);

module.exports = router;
