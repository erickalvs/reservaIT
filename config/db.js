const mysql = require("mysql2");
require("dotenv").config();

const connectbd = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

connectbd.getConnection((error, connection) => {
  if (error) {
    console.error("Erro ao conectar ao banco de dados:", error.message);
  } else {
    console.log("Conectado ao MySQL com sucesso!");
    connection.release(); // Libera a conexão após o teste
  }
});

module.exports = connectbd.promise();
