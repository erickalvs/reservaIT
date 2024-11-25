document.getElementById("formReserva").addEventListener("submit", (event) => {
  event.preventDefault();
  const reservaId = document.getElementById("reservaId").value;

  if (reservaId) {
    atualizarReserva(reservaId);
  } else {
    criarReserva();
  }
});

// Função para criar uma nova reserva
async function criarReserva() {
  event.preventDefault();
  const dataReserva = document.getElementById("dataReserva").value;
  const horaReserva = document.getElementById("horaReserva").value;
  const objetivoReserva = document.getElementById("objetivoReserva").value;
  const idMesa = document.getElementById("mesasSelect").value;
  const token = localStorage.getItem("authToken");
  const decodedToken = jwt_decode(token);
  const email = decodedToken.email; // Supondo que o token tenha o campo 'email'

  const reservaData = {
    email,
    dataReserva,
    horaReserva,
    objetivoReserva,
    idMesa,
    statusReserva: "ES",
  };

  try {
    const token = localStorage.getItem("authToken");

    console.log("Dados enviados:", JSON.stringify(reservaData));

    const response = await fetch("/reservas/criar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reservaData),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Reserva criada com sucesso!", data);
      alert("Reserva criada com sucesso!");
      listarReservas();
      location.reload();
    } else {
      console.log("Erro ao criar reserva: ", response.statusText);
      alert("Erro ao criar reserva.");
    }
  } catch (error) {
    console.error("Erro ao criar reserva: ", error);
    alert("Erro ao criar reserva.");
  }
}

// Função para listar as reservas
async function listarReservas() {
  event.preventDefault();
  const email = obterEmailDoToken(); // Obter email do token

  if (!email) {
    alert("Usuário não autenticado.");
    return; // Não faz a requisição se o email não for encontrado
  }

  try {
    // Passar o email como parâmetro na URL
    const response = await fetch(
      `/reservas/listar?email=${encodeURIComponent(email)}`,
      {
        method: "GET",
      }
    );

    if (response.ok) {
      const reservas = await response.json();
      const listaReservas = document.getElementById("listaReservas");
      const formrsv = document.getElementById("form-rsv");

      // Alternar exibição de lista e formulário
      if (listaReservas.style.display === "none") {
        listaReservas.style.display = "block";
      } else {
        listaReservas.style.display = "none";
      }

      if (formrsv.style.display === "none") {
        formrsv.style.display = "block";
      } else {
        formrsv.style.display = "none";
      }

      listaReservas.innerHTML = "";

      reservas.forEach((reserva) => {
        const dataAtual = new Date();
        const dataReserva = new Date(reserva.dataReserva);

        const dia = String(dataReserva.getDate()).padStart(2, "0");
        const mes = String(dataReserva.getMonth() + 1).padStart(2, "0");
        const ano = dataReserva.getFullYear();
        const dataFormatada = `${dia}/${mes}/${ano}`;

        const li = document.createElement("li");

        li.innerHTML = `
          <div class="reserva-item">
            <p><strong>Nome do Cliente:</strong> ${
              reserva.nomeCliente || "Nome não encontrado"
            }</p>
            <p><strong>Data:</strong> ${dataFormatada}</p>
            <p><strong>Hora:</strong> ${reserva.horaReserva}</p>
            <p><strong>Localização da Mesa:</strong> ${
              reserva.mesaDescricao || "Descrição não encontrada"
            }</p>
            <p><strong>Observação:</strong> ${
              reserva.observacao || "Sem observação"
            }</p>
            <div class="botoes-container">
              ${
                dataReserva >= dataAtual
                  ? `<button class="editar" onclick="mostrarFormularioEdicao('${reserva.idReserva}')">Editar</button>`
                  : `<button class="avaliar" onclick="abrirModal('${reserva.idReserva}', event)">Avaliar</button>`
              }
              ${
                dataReserva >= dataAtual
                  ? `<button class="deletar" onclick="deletarReserva('${reserva.idReserva}')">Cancelar</button>`
                  : `<button class="deletar" style="display: none;" onclick="deletarReserva('${reserva.idReserva}')">Cancelar</button>`
              }
            </div>
          </div>
        `;
        listaReservas.appendChild(li);
      });
    } else if (response.status === 404) {
      console.log("Nenhuma reserva encontrada.");
      alert("Nenhuma reserva foi encontrada.");
    } else {
      console.error("Erro ao listar reservas");
      alert("Erro ao listar reservas. Tente novamente mais tarde.");
    }
  } catch (error) {
    console.error("Erro ao listar reservas:", error);
    alert("Erro ao listar reservas. Tente novamente mais tarde.");
  }
}

// Função para atualizar uma reserva
async function atualizarReserva(id) {
  event.preventDefault();
  const dataReserva = document.getElementById("dataReserva").value;
  const horaReserva = document.getElementById("horaReserva").value;
  const observacao = document.getElementById("objetivoReserva").value;
  const idMesa = document.getElementById("mesasSelect").value;

  if (!dataReserva || !horaReserva || !idMesa) {
    alert("Preencha todos os campos obrigatórios!");
    return;
  }

  const reservaData = {
    dataReserva,
    horaReserva,
    observacao,
    idMesa,
  };

  try {
    const token = localStorage.getItem("authToken"); // Autenticação, se necessário

    const response = await fetch(`/reservas/atualizar/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Caso use autenticação
      },
      body: JSON.stringify(reservaData),
    });

    if (response.ok) {
      alert("Reserva atualizada com sucesso!");
      listarReservas(); // Atualiza a lista
      location.reload();
    } else {
      const errorData = await response.json();
      alert(
        "Erro ao atualizar reserva: " +
          (errorData.message || "Erro desconhecido.")
      );
    }
  } catch (error) {
    console.error("Erro ao atualizar reserva:", error);
    alert("Erro ao atualizar reserva. Tente novamente mais tarde.");
  }
}

// Função para deletar uma reserva
async function deletarReserva(id) {
  event.preventDefault();
  try {
    const token = localStorage.getItem("authToken");

    const response = await fetch(`/reservas/deletar/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      alert("Reserva deletada com sucesso!");
      listarReservas(); // Recarregar a lista de reservas
      location.reload();
    } else {
      const errorData = await response.json();
      alert("Erro ao deletar reserva: " + errorData.message);
    }
  } catch (error) {
    console.error("Erro ao deletar reserva:", error);
    alert("Erro ao deletar reserva. Verifique a conexão com a internet.");
  }
}

// Função para mostrar o formulário de avaliação
function mostrarFormularioAvaliacao(idReserva) {
  event.preventDefault();
  // Limpa qualquer formulário de avaliação exibido anteriormente
  const formAvaliacao = document.getElementById("formAvaliacao");
  formAvaliacao.style.display = "block"; // Exibe o formulário

  // Preenche o campo oculto com o id da reserva para associar à avaliação
  document.getElementById("idReservaAvaliacao").value = idReserva;
}

async function enviarAvaliacao(event) {
  event.preventDefault(); // Impede o comportamento padrão do formulário (recarregar a página)

  const idReserva = document.getElementById("idReservaAvaliacao").value;
  const nivel = document.getElementById("nivelAvaliacao").value;
  const comentario = document.getElementById("comentarioAvaliacao").value;

  try {
    const response = await fetch("/avaliacoes/criar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idReserva, nivel, comentario }),
    });
    console.log("cheguei aq ");
    if (response.ok) {
      alert("Avaliação salva com sucesso!");
      fecharModal();
      document.getElementById("formAvaliacao").reset();
    } else {
      const error = await response.json();
      alert(`Erro ao salvar avaliação: ${error.message}`);
      location.reload();
    }
  } catch (error) {
    console.error("Erro ao salvar avaliação:", error);
    alert("Erro ao salvar avaliação. Tente novamente.");
  }
}

// Função para mostrar o formulário de edição
function mostrarFormularioEdicao(id) {
  event.preventDefault();
  console.log("ID da reserva para edição:", id);

  // Limpar os campos do formulário de edição
  document.getElementById("formReserva").reset();
  const button = document.querySelector("#formReserva button");
  button.textContent = "Atualizar Reserva"; // Muda o texto do botão para "Atualizar"

  // Exibir o formulário de edição
  document.getElementById("formReserva").style.display = "block"; // Exibe o formulário
  document.getElementById("reservaId").value = id; // Armazena o id da reserva no campo oculto

  fetch(`/reservas/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro ao buscar reserva para edição.");
      }
      return response.json();
    })
    .then((reserva) => {
      console.log("Reserva encontrada:", reserva);

      // Preencher os campos do formulário com os valores recuperados
      // Preencher os campos do formulário com os valores recuperados
      if (reserva) {
        if (reserva.dataReserva) {
          const data = new Date(reserva.dataReserva);
          const formattedDate = data.toISOString().split("T")[0]; // Ex: "2024-11-11"
          document.getElementById("dataReserva").value = formattedDate;
          console.log("Data Preenchida:", formattedDate);
        } else {
          console.warn("O campo data está vazio");
        }

        if (reserva.horaReserva) {
          document.getElementById("horaReserva").value = reserva.horaReserva;
          console.log("Hora Preenchida:", reserva.horaReserva);
        } else {
          console.warn("O campo hora está vazio");
        }

        // Preencher o objetivoReserva
        if (reserva.observacao) {
          document.getElementById("objetivoReserva").value =
            reserva.observacao;
          console.log(
            "Objetivo da reserva preenchido:",
            reserva.observacao
          );
        } else {
          console.warn("Campo objetivoReserva está ausente ou vazio.");
        }

        // Preencher o campo de seleção de mesas
        document.getElementById("mesasSelect").value =
          reserva.idMesa || "";
      } else {
        console.warn("Nenhuma reserva encontrada.");
      }
    })
    .catch((error) => {
      console.error("Erro ao buscar reserva para edição:", error);
    });
}

// Função para resetar o formulário
function resetFormulario() {
  event.preventDefault();
  document.getElementById("formReserva").reset();
  document.getElementById("reservaId").value = "";
  const button = document.querySelector("#formReserva button");
  button.textContent = "Criar Reserva"; // Restaura o texto original do botão
}

// Função para carregar as mesas
async function carregarMesas() {
  try {
    const response = await fetch("reservas/mesas/listar"); // Alterado para "/mesas/listar"

    if (!response.ok) {
      throw new Error(`Erro ao carregar mesas: ${response.statusText}`);
    }

    const mesas = await response.json();
    console.log("Mesas carregadas:", mesas);

    if (mesas.length === 0) {
      console.log("Não há mesas disponíveis.");
    }

    const selectMesas = document.getElementById("mesasSelect");
    selectMesas.innerHTML = '<option value="">Escolha uma mesa</option>';

    mesas.forEach((mesa) => {
      const option = document.createElement("option");
      option.value = mesa.idMesa;
      option.textContent = `${mesa.descricao} - ${mesa.localizacao} (${mesa.numCadeiras} cadeiras)`;
      selectMesas.appendChild(option);
    });
  } catch (error) {
    console.error("Erro ao carregar mesas:", error);
  }
}
carregarMesas();

// Função para verificar se o usuário é admin
function verificarSeAdmin() {
  event.preventDefault();
  const token = localStorage.getItem("authToken");
  if (!token) {
    return false; // Se não tiver token, o usuário não é autenticado
  }

  try {
    const decodedToken = jwt_decode(token); // Decodificando o token
    console.log(decodedToken); // Verifique no console para ver os dados do token
    return decodedToken.tipo_usuario === "A"; // Verifica se o usuário é admin
  } catch (error) {
    console.error("Erro ao decodificar o token:", error);
    return false;
  }
}

// Função para exibir botões para administradores
function exibirBotoesAdmin() {
  event.preventDefault();
  if (verificarSeAdmin()) {
    // Se o usuário for admin, exibe os botões
    document.getElementById("adminLink").style.display = "block";
  } else {
    // Caso contrário, esconde
    document.getElementById("adminLink").style.display = "none";
  }
}
// Chame a função de exibir botões de admin ao carregar a página
window.onload = function () {
  exibirBotoesAdmin(); // A função só será chamada após a página carregar.
};

function obterEmailDoToken() {
  const token = localStorage.getItem("authToken"); // Pega o token do localStorage
  if (!token) {
    console.log("Token não encontrado.");
    return null; // Se o token não existir, retorna null
  }

  try {
    const decodedToken = jwt_decode(token); // Decodifica o token
    console.log(decodedToken); // Verifique os dados do token no console

    // Agora você pode acessar o email do token decodificado
    const email = decodedToken.email; // Supondo que o campo no token seja 'email'
    return email;
  } catch (error) {
    console.error("Erro ao decodificar o token:", error);
    return null;
  }
}

// Logout: remove o status de login e redireciona para a página de login
function logout() {
  event.preventDefault();
  sessionStorage.removeItem("loggedIn");

  setTimeout(function () {
    window.location.replace("login.html"); // Redireciona para a página de login
  }, 100);
}

// Função para abrir o modal
function abrirModal(idReserva) {
  event.preventDefault();
  document.getElementById("idReservaAvaliacao").value = idReserva;
  document.getElementById("modalAvaliacao").style.display = "block";
}

// Função para fechar o modal
function fecharModal() {
  document.getElementById("modalAvaliacao").style.display = "none";
}
