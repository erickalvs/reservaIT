// Função para alternar entre as seções
// Função para mostrar a seção correspondente e esconder as outras
function mostrarSecao(secao) {
  // Primeiramente, escondemos todas as seções
  const todasSecoes = document.querySelectorAll("main section");
  todasSecoes.forEach((secaoElemento) => {
    secaoElemento.classList.remove("show"); // Remove a classe show de todas as seções
  });

  // Agora, mostramos a seção selecionada
  const secaoSelecionada = document.getElementById(secao);
  if (secaoSelecionada) {
    secaoSelecionada.classList.add("show"); // Adiciona a classe show à seção selecionada
  }
}

// Função de logout (exemplo, você pode substituir com a sua lógica)
function logout() {
  // Exemplo de logout
  window.close();
}

// Função para mostrar a tabela de reservas
function mostrarTabelaReservas() {
  const tabela = document.getElementById("listaReservas");
  tabela.style.display = tabela.style.display === "none" ? "table" : "none";
}

// Função para carregar dados iniciais
document.addEventListener("DOMContentLoaded", () => {
  carregarReservas();
});

// Função para exibir a lista de reservas
async function mostrarTabelaReservas() {
  const listaReservas = document.getElementById("listaReservas");
  listaReservas.style.display = "block"; // Exibe a tabela

  // Fazendo a requisição para listar todas as reservas
  const response = await fetch("/adminRoutes/listarReservasAdmin");
  const reservas = await response.json();

  // Limpar a tabela antes de adicionar os dados
  const tbody = listaReservas.querySelector("tbody");
  tbody.innerHTML = "";

  reservas.forEach((reserva) => {
    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${reserva.idReserva}</td>
        <td>${reserva.nomeCliente}</td>
        <td>${reserva.dataReserva}</td>
        <td>${reserva.horaReserva}</td>
        <td>${reserva.mesaDescricao}</td>
        <td>${reserva.observacao || "Sem observação"}</td>
        <td>${reserva.statusReserva}</td>
        
        <td>
          <button onclick="editarReserva('${
            reserva.idReserva
          }')">Editar</button>
          <button onclick="deletarReserva('${
            reserva.idReserva
          }')">Excluir</button>
                    <button onclick="verAvaliação('${
                      reserva.idReserva
                    }')">Avaliação</button>
        </td>
      `;
    tbody.appendChild(row);
  });
}

function carregarReservas() {
  const tbody = document.querySelector("#listaReservas tbody");
  tbody.innerHTML = "";

  const reservasArray = Array.from(reservas);
  reservasArray.forEach((reserva) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${reserva.id}</td>
      <td>${reserva.cliente}</td>
      <td>${reserva.data}</td>
      <td>${reserva.hora}</td>
      <td>${reserva.mesa}</td>
      <td>${reserva.observacao}</td>
      <td>${reserva.status}</td>
      <td>
        <button class="editar-btn" data-id="${reserva.id}">Editar</button>
        <button class="excluir-btn" data-id="${reserva.id}">Excluir</button>
      </td>
    `;
    tbody.appendChild(row);
  });

  // Configuração dos botões de editar e excluir
  document.querySelectorAll(".editar-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      editarReserva(btn.getAttribute("data-id"));
    });
  });

  document.querySelectorAll(".excluir-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      excluirReserva(btn.getAttribute("data-id"));
    });
  });
}

function formatarData(data) {
  const dataObj = new Date(data);
  const ano = dataObj.getFullYear();
  const mes = String(dataObj.getMonth() + 1).padStart(2, "0");
  const dia = String(dataObj.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`; // Formato esperado para input do tipo date
}

// Função para editar a reserva
function editarReserva(idReserva) {
  fetch(`/reservas/${idReserva}`)
    .then((response) => response.json())
    .then((reserva) => {
      console.log(reserva); // Verifique se os dados estão sendo retornados corretamente

      // Verifique se a seção de edição está oculta
      const formEdicao = document.getElementById("formEdicao");
      console.log(
        "Formulário oculto:",
        formEdicao.classList.contains("secaoOculta")
      );

      // Preencher os campos de edição
      const dataRecebida = reserva.dataReserva;
      const dataFormatada = formatarData(dataRecebida); // Certifique-se de que a data está no formato correto
      document.getElementById("editIdReserva").value = reserva.idReserva;
      document.getElementById("editData").value = dataFormatada;
      document.getElementById("editHora").value = reserva.horaReserva;
      document.getElementById("editMesa").value = reserva.idMesa;
      document.getElementById("editObservacao").value = reserva.observacao;

      let statusFormatado;
      switch (reserva.statusReserva) {
        case "CA":
          statusFormatado = "Cancelada";
          break;
        case "CO":
          statusFormatado = "Confirmada";
          break;
        case "ES":
          statusFormatado = "Em Espera";
          break;
        default:
          statusFormatado = "Status desconhecido";
      }
      document.getElementById("editStatus").value = statusFormatado;

      document.getElementById("formEdicao").classList.add("show");
    })
    .catch((error) => console.error("Erro ao buscar reserva:", error));
}

// Função para enviar o formulário de edição
async function atualizarReserva() {
  const form = document.getElementById("formEditarReserva");
  if (!form) {
    alert("Formulário não encontrado!");
    return;
  }

  const idReserva = document.getElementById("editIdReserva").value;
  const statusReserva = document.getElementById("editStatus").value;

  let statusFormatado;
  switch (statusReserva) {
    case "Cancelada":
      statusFormatado = "CA";
      break;
    case "Confirmada":
      statusFormatado = "CO";
      break;
    case "Em Espera":
      statusFormatado = "ES";
      break;
    default:
      statusFormatado = "Desconhecido";
      break;
  }

  const dataReserva = document.getElementById("editData").value;
  const horaReserva = document.getElementById("editHora").value;
  const observacao = document.getElementById("editObservacao").value;
  const idMesa = document.getElementById("editMesa").value;

  try {
    const response = await fetch(
      `/adminRoutes/atualizarReservaAdmin/${idReserva}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dataReserva,
          horaReserva,
          observacao,
          idMesa,
          status: statusFormatado,
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      alert("Reserva e status atualizados com sucesso!");
      location.reload(); // Recarregar a página após atualização
    } else {
      alert("Erro ao atualizar reserva: " + data.message);
    }
  } catch (error) {
    console.error("Erro ao atualizar reserva:", error);
    alert("Erro ao atualizar reserva. Tente novamente.");
  }
}

// Função para excluir reserva
async function deletarReserva(idReserva) {
  const confirmacao = confirm("Tem certeza que deseja excluir esta reserva?");

  if (confirmacao) {
    const response = await fetch(
      `/adminRoutes/deletarReservaAdmin/${idReserva}`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();

    if (data.message === "Reserva deletada com sucesso.") {
      alert("Reserva deletada com sucesso");
      location.reload(); // Atualiza a página ou você pode remover o elemento da tabela diretamente
    } else {
      alert("Erro ao deletar reserva");
    }
  }
}

// Função para obter os dados de uma reserva
function obterReserva(idReserva) {
  fetch(`/${idReserva}`)
    .then((response) => response.json())
    .then((data) => {
      const form = document.getElementById("formEditarReserva");
      if (form) {
        form.elements["editId"].value = data.idReserva;
        form.elements["editCliente"].value = data.cliente;
        form.elements["editData"].value = data.dataReserva;
        form.elements["editHora"].value = data.horaReserva;
        form.elements["editMesa"].value = data.mesa;
        form.elements["editObservacao"].value = data.observacao;
        form.elements["editStatus"].value = data.status;
      } else {
        console.error("Formulário de edição não encontrado");
      }
    })
    .catch((error) => console.error("Erro ao obter reserva:", error));
}

function verAvaliação(idReserva){
  
}
//mesas

// Função para carregar as mesas do backend e exibi-las
const listarMesas = async () => {
  const response = await fetch("/mesaRoutes/listarMesas");
  const mesas = await response.json();

  const listaMesas = document.getElementById("listaMesas");
  listaMesas.innerHTML = ""; // Limpar a lista antes de adicionar novos itens

  mesas.forEach((mesa) => {
    const row = document.createElement("tr");

    // Cria células para cada informação da mesa
    row.innerHTML = `
      <td>${mesa.idMesa}</td>
      <td>${mesa.status}</td>
      <td>${mesa.descricao}</td>
      <td>${mesa.localizacao}</td>
      <td>${mesa.numCadeiras}</td>
      <td>
        <button onclick="editarMesa('${mesa.idMesa}')">Editar</button>
        <button onclick="removerMesa('${mesa.idMesa}')">Deletar</button>
      </td>
    `;

    // Adiciona a linha na tabela
    listaMesas.appendChild(row);
  });
};

// Função para mostrar o formulário de edição
const editarMesa = (idMesa) => {
  // Fazendo uma requisição GET para obter os dados da mesa com base no idMesa
  fetch(`/mesaRoutes/listarMesasId/${idMesa}`)
    .then((response) => response.json())
    .then((mesaArray) => {
      const mesa = mesaArray[0][0];
      console.log("mesa: ", mesa.status); // Verifique o conteúdo de 'mesa' no console

      // Preenche os campos do formulário com os dados da mesa
      document.getElementById("editIdMesa").value = mesa.idMesa;
      document.getElementById("editStatus").value = mesa.status;
      document.getElementById("editDescricao").value = mesa.descricao;
      document.getElementById("editLocalizacao").value = mesa.localizacao;
      document.getElementById("editNumCadeiras").value = mesa.numCadeiras;

      // Exibe o formulário de edição
      document.getElementById("formEdicaoMesa").classList.add("show");
    })
    .catch((error) =>
      console.error("Erro ao carregar dados para edição:", error)
    );
};

const salvarEdicao = () => {
  const idMesa = document.getElementById("editIdMesa").value;
  const descricao = document.getElementById("editDescricao").value;
  const localizacao = document.getElementById("editLocalizacao").value;
  const numCadeiras = document.getElementById("editNumCadeiras").value;
  const status = document.getElementById("editStatusAtt").value;

  // Envia a requisição PUT com os dados atualizados
  console.log("Status enviado para o servidor:", status);
  fetch(`/mesaRoutes/attMesas/${idMesa}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status: status,
      descricao: descricao,
      localizacao: localizacao,
      numCadeiras: numCadeiras,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Resposta do servidor:", data);
      if (data.success) {
        alert("Mesa atualizada com sucesso!");
        location.reload();
      } else {
        alert("Erro ao atualizar mesa2121.");
      }
    })
    .catch((error) => {
      console.error("Erro ao atualizar mesa:", error);
      alert("Ocorreu um erro ao tentar atualizar a mesa.");
    });
};

// Função para cancelar a edição
const cancelarEdicaoMesa = () => {
  // Limpa os campos do formulário e esconde ele
  document.getElementById("formEdicao").classList.add("secaoOculta");
};

// Função para adicionar uma nova mesa
const mostrarFormularioAdicionarMesa = () => {
  // Exibe o formulário de adicionar mesa removendo a classe 'secaoOculta'
  document.getElementById("formAdicionarMesa").classList.remove("secaoOculta");
};

// Função para enviar a nova mesa para o backend
const adicionarMesa = (e) => {
  e.preventDefault();

  const idMesa = document.getElementById("idMesa").value;
  const status = document.getElementById("status").value;
  const descricao = document.getElementById("descricao").value;
  const localizacao = document.getElementById("localizacao").value;
  const numCadeiras = document.getElementById("numCadeiras").value;

  const data = { idMesa, status, descricao, localizacao, numCadeiras };

  fetch("/mesaRoutes/addMesas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message) {
        alert(data.message);
        location.reload();
      }
    })
    .catch((error) => {
      console.error("Erro ao adicionar mesa:", error);
      alert("Erro ao adicionar mesa.");
    });
};

// Função para remover uma mesa
const removerMesa = (idMesa) => {
  if (confirm("Você tem certeza que deseja remover esta mesa?")) {
    fetch(`/mesaRoutes/excluirMesas/${idMesa}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then(() => {
        // Atualiza a lista de mesas
        listarMesas();
      });
  }
};

//Gerenciar Uuario

// Função para buscar usuário pelo CPF
async function buscarUsuario(cpf) {
  try {
    const response = await fetch(`/adminRoutes/buscarUsuario/${cpf}`);
    if (response.ok) {
      const usuario = await response.json();
      return usuario;
    } else {
      throw new Error("Usuário não encontrado");
    }
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    throw error;
  }
}

// Função para atualizar o tipo do usuário
async function atualizarTipoUsuario(cpf, tipoUsuario) {
  try {
    const response = await fetch(`/adminRoutes/atualizarUsuario/${cpf}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tipoUsuario }),
    });

    if (response.ok) {
      return "Tipo de usuário atualizado com sucesso";
    } else {
      throw new Error("Erro ao atualizar tipo de usuário");
    }
  } catch (error) {
    console.error("Erro ao atualizar tipo de usuário:", error);
    throw error;
  }
}

// Manipula o evento de busca de usuário
function handleBuscarUsuario(event) {
  event.preventDefault();
  const cpfInput = document.getElementById("cpf").value;

  buscarUsuario(cpfInput)
    .then((usuario) => {
      exibirDetalhesUsuario(usuario);
    })
    .catch((error) => {
      alert(error.message);
    });
}

// Manipula o evento de atualização do tipo de usuário
function handleAtualizarTipoUsuario() {
  const cpf = document.getElementById("cpfUsuario").innerText;
  const tipoUsuario = document.getElementById("tipoUsuario").checked
    ? "A"
    : "C";

  atualizarTipoUsuario(cpf, tipoUsuario)
    .then((mensagem) => {
      alert(mensagem);
    })
    .catch((error) => {
      alert(error.message);
    });
}

// Função para exibir os detalhes do usuário na tela
function exibirDetalhesUsuario(usuario) {
  document.getElementById("nomeUsuario").innerText = usuario.nome;
  document.getElementById("cpfUsuario").innerText = usuario.cpf;
  document.getElementById("tipoUsuario").checked = usuario.tipoUsuario === "A";
  document.getElementById("detalhesUsuario").classList.remove("oculto");
}

// Função de inicialização
function inicializarGerenciamentoUsuario() {
  const formBuscarUsuario = document.getElementById("formBuscarUsuario");
  const btnAtualizar = document.getElementById("btnAtualizar");

  formBuscarUsuario.addEventListener("submit", handleBuscarUsuario);
  btnAtualizar.addEventListener("click", handleAtualizarTipoUsuario);
}

// Inicializa os eventos ao carregar o DOM
document.addEventListener("DOMContentLoaded", inicializarGerenciamentoUsuario);

// Chama a função para listar as mesas quando a página for carregada
window.onload = listarMesas;

//gerarRelatorios

// Gerar Relatório de Reservas
function gerarRelatorioReservas() {
  const filtroData = document.getElementById("filtroData").value;

  let url = "/adminRoutes/relatorio/reservas";
  if (filtroData) {
    url += `?data=${filtroData}`; // Passando o filtro de data
  }

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const relatorioDiv = document.getElementById("relatorioResult");
      let tableHtml = `
        <h3>Relatório de Reservas:</h3>
        <table id="reservasTable">
          <thead>
            <tr>
              <th>ID Reserva</th>
              <th>CPF Cliente</th>
              <th>ID Mesa</th>
              <th>Data</th>
              <th>Hora</th>
              <th>Status</th>
              <th>Observação</th>
            </tr>
          </thead>
          <tbody>
      `;

      data.forEach((reserva) => {
        tableHtml += `
          <tr>
            <td>${reserva.idReserva}</td>
            <td>${reserva.cpf}</td>
            <td>${reserva.idMesa}</td>
            <td>${new Date(reserva.dataReserva).toLocaleDateString()}</td>
            <td>${reserva.horaReserva}</td>
            <td>${reserva.statusReserva}</td>
            <td>${reserva.observacao || "Sem observação"}</td>
          </tr>
        `;
      });

      tableHtml += `
          </tbody>
        </table>
      `;
      relatorioDiv.innerHTML = tableHtml;
    })
    .catch((error) => {
      console.error("Erro ao gerar relatório de reservas:", error);
      alert("Erro ao gerar relatório de reservas");
    });
}

// Gerar Relatório de Reservas por Usuário
function gerarRelatorioReservasUsuario() {
  const cpfUsuario = document.getElementById("filtroUsuario").value;
  console.log("cpf:", cpfUsuario);
  if (!cpfUsuario) {
    alert("Por favor, insira o CPF do usuário.");
    return;
  }

  fetch(`/adminRoutes/relatorio/reservas/usuario/${cpfUsuario}`)
    .then((response) => response.json())
    .then((data) => {
      console.log("Dados recebidos:", data);

      // Verificar se a resposta é um array
      if (!Array.isArray(data)) {
        alert("Erro: Os dados recebidos não estão no formato esperado.");
        return;
      }

      if (data.length === 0) {
        alert("Nenhuma reserva encontrada para este usuário.");
      } else {
        const relatorioDiv = document.getElementById("relatorioResult");
        let tableHtml =
          "<h3>Reservas do Usuário:</h3><table><thead><tr><th>ID Reserva</th><th>Data</th><th>Hora</th><th>Status</th><th>Observação</th></tr></thead><tbody>";

        // Iterar por todas as reservas
        data.forEach((reserva) => {
          tableHtml += `
          <tr>
            <td>${reserva.idReserva}</td>
            <td>${new Date(reserva.dataReserva).toLocaleDateString()}</td>
            <td>${reserva.horaReserva}</td>
            <td>${reserva.statusReserva}</td>
            <td>${reserva.observacao || "N/A"}</td>
          </tr>
        `;
        });

        tableHtml += "</tbody></table>";
        relatorioDiv.innerHTML = tableHtml;
      }
    })
    .catch((error) => {
      console.error("Erro ao gerar relatório de reservas do usuário:", error);
      alert("Erro ao gerar relatório de reservas do usuário.");
    });
}

// Gerar Relatório de Usuário com Mais Reservas
function gerarUsuarioMaisReservas() {
  fetch("/adminRoutes/relatorio/usuario/maisreservas")
    .then((response) => response.json())
    .then((data) => {
      if (data.message) {
        alert(data.message);
      } else {
        const relatorioDiv = document.getElementById("relatorioResult");
        let tableHtml =
          "<h3>Usuário com mais reservas:</h3><table id='usuarioMaisReservasTable'><thead><tr><th>CPF</th><th>Nome</th><th>Número de Reservas</th></tr></thead><tbody>";

        tableHtml += `<tr><td>${data.cpf}</td><td>${data.nome}</td><td>${data.numReservas}</td></tr>`;
        tableHtml += "</tbody></table>";
        relatorioDiv.innerHTML = tableHtml;
      }
    })
    .catch((error) => {
      console.error(
        "Erro ao gerar relatório de usuário com mais reservas:",
        error
      );
      alert("Erro ao gerar relatório de usuário com mais reservas");
    });
}

function gerarRelatorioClientes() {
  fetch("/adminRoutes/relatorio/clientes")
    .then((response) => response.json())
    .then((data) => {
      const relatorioDiv = document.getElementById("relatorioResult");
      let tableHtml = `
        <h3>Relatório de Clientes (em ordem de reservas):</h3>
        <table id="clientesTable">
          <thead>
            <tr>
              <th>CPF</th>
              <th>Nome</th>
              <th>Total de Reservas</th>
            </tr>
          </thead>
          <tbody>
      `;

      data.forEach((cliente) => {
        tableHtml += `
          <tr>
            <td>${cliente.cpf}</td>
            <td>${cliente.nome}</td>
            <td>${cliente.totalReservas}</td>
          </tr>
        `;
      });

      tableHtml += `
          </tbody>
        </table>
      `;
      relatorioDiv.innerHTML = tableHtml;
    })
    .catch((error) => {
      console.error("Erro ao gerar relatório de clientes:", error);
      alert("Erro ao gerar relatório de clientes");
    });
}

// Adiciona o evento de submit no formulário de adicionar mesa
document
  .getElementById("formAdicionarMesa")
  .addEventListener("submit", adicionarMesa);
