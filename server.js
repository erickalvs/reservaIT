const express = require("express"); // Express para criar o servidor
const path = require("path"); // Para manipulação de caminhos de arquivos
const bodyParser = require("body-parser"); // Middleware para lidar com dados POST
const cors = require("cors"); // Para habilitar CORS (Cross-Origin Resource Sharing)
const authRoutes = require("./routes/authRoutes"); // Rota de autenticação
const reservaRoutes = require("./routes/reservas"); // Rota para gerenciar reservas
const { buscarReservaPorId } = require("./controllers/reservaController");
const { Avaliacao } = require("./models/Avaliacao"); // Modelo de avaliação
const adminRoutes = require("./routes/adminRoutes");
const mesaRoutes = require("./routes/mesaRoutes");

require("dotenv").config(); // Para carregar as variáveis do .env

// Criando a instância do aplicativo Express
const app = express();

// Configurações do Body Parser para leitura de dados do formulário
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Para permitir o envio e leitura de JSON nas requisições

// Middleware
app.use(cors());

app.use(express.json()); // Para interpretar JSON no corpo da requisição
app.use(express.urlencoded({ extended: true })); // Para interpretar dados de formulário

// Definindo as rotas
app.use("/auth", authRoutes); // Rota para autenticação (login, etc.)
app.use("/reservas", reservaRoutes); // Rota para gerenciar reservas
app.post("/avaliacoes/criar", async (req, res) => {
  try {
    console.log(req.body);
    const { idReserva, nivel, comentario } = req.body;

    const avaliacaoExistente = await Avaliacao.verificarAvaliacaoExistente(
      idReserva
    );
    if (avaliacaoExistente) {
      return res.status(400).json({ message: "Esta reserva já foi avaliada!" });
    }

    await Avaliacao.criarAvaliacao(idReserva, nivel, comentario);
    // Aqui você chamaria a função para salvar a avaliação no banco de dados
    // Exemplo: await Avaliacao.criarAvaliacao(idReserva, nivel, comentario);

    res.status(201).json({ message: "Avaliação salva com sucesso!" });
  } catch (error) {
    console.error("Erro ao salvar avaliação:", error);
    res.status(500).json({ message: "Erro ao salvar avaliação" });
  }
});
app.use("/adminRoutes", adminRoutes); // Prefixando com '/admin' para as rotas administrativas
app.use("/mesaRoutes", mesaRoutes);
// Rota inicial (página de login)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/reservas/:id", async (req, res) => {
  const idReserva = req.params.id;
  try {
    const reserva = await buscarReservaPorId(idReserva);
    if (!reserva) {
      return res.status(404).json({ message: "Reserva não encontrada" });
    }
    res.json(reserva);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar reserva" });
  }
});

// Serve arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, "public")));

// Rota de home (exemplo de página home)
app.get("/index", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Iniciando o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
