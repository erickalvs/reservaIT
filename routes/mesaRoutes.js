// routes/mesaRoutes.js
const express = require("express");
const router = express.Router();
const mesaController = require("../controllers/mesaController");

router.get("/listarMesas", mesaController.listarMesas);
router.put("/attMesas/:idMesa", mesaController.atualizarMesa);
router.post("/addMesas", mesaController.adicionarMesa);
router.delete("/excluirMesas/:idMesa", mesaController.excluirMesa);
router.get("/listarMesasId/:idMesa", mesaController.buscarMesaPorId);
    
module.exports = router;
