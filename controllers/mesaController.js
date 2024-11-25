// controllers/mesaController.js
const Mesa = require("../models/Mesa");

// Função para listar todas as mesas
const listarMesas = async (req, res) => {
  try {
    const [mesas] = await Mesa.listarMesas();
    res.status(200).json(mesas);
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar mesas", error });
  }
};

// Função para atualizar uma mesa
const atualizarMesa = async (req, res) => {
  const { idMesa } = req.params;
  const { status, descricao, localizacao, numCadeiras } = req.body;

  console.log("Dados recebidos no backend:", req.body);

  if (
    status === undefined ||
    descricao === undefined ||
    localizacao === undefined ||
    numCadeiras === undefined
  ) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  try {
    // Primeiro, buscamos a mesa pelo ID
    const [mesa] = await Mesa.obterMesa(idMesa);

    if (!mesa) {
      return res.status(404).json({ error: "Mesa não encontrada" });
    }

    // Atualiza a mesa no banco de dados
    await Mesa.atualizarMesa(
      idMesa,
      status,
      descricao,
      localizacao,
      numCadeiras
    );

    res
      .status(200)
      .json({ success: true, message: "Mesa atualizada com sucesso!22" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar a mesa" });
  }
};

const buscarMesaPorId = async (req, res) => {
  const { idMesa } = req.params;

  try {
    const mesa = await Mesa.obterMesa(idMesa); // Buscando a mesa no Model com o idMesa
    if (!mesa) {
      return res.status(404).json({ error: "Mesa não encontrada" });
    }
    res.json(mesa); // Retorna os dados da mesa encontrada
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar mesa" });
  }
};

// Função para adicionar uma nova mesa
const adicionarMesa = async (req, res) => {
  const { idMesa, status, descricao, localizacao, numCadeiras } = req.body;
  console.log("Dados recebidos:", {
    idMesa,
    status,
    descricao,
    localizacao,
    numCadeiras,
  });
  try {
    if (!idMesa || !status || !descricao || !localizacao || !numCadeiras) {
      return res
        .status(400)
        .json({ message: "Todos os campos são obrigatórios." });
    }

    await Mesa.adicionarMesa(
      idMesa,
      status,
      descricao,
      localizacao,
      numCadeiras
    );
    res.status(201).json({ message: "Mesa adicionada com sucesso!" });
  } catch (error) {
    console.error("Erro ao adicionar a mesa:", error);
    res.status(500).json({ message: "Erro ao adicionar a mesa." });
  }
};

// Função para excluir uma mesa
const excluirMesa = async (req, res) => {
  const { idMesa } = req.params;
  console.log("toaqui");

  try {
    // Chama a função para excluir a mesa
    const [result] = await Mesa.excluirMesa(idMesa);

    // Verifica se a exclusão foi bem-sucedida
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Mesa não encontrada" });
    }

    // Se a mesa foi excluída com sucesso
    res.json({ message: "Mesa excluída com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir a mesa:", error);
    res.status(500).json({ message: "Erro ao excluir a mesa" });
  }
};

module.exports = {
  listarMesas,
  adicionarMesa,
  atualizarMesa,
  excluirMesa,
  buscarMesaPorId,
};
