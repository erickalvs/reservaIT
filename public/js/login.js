document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const showRegisterBtn = document.getElementById("showRegisterBtn");
  const showLoginBtn = document.getElementById("showLoginBtn");

  window.addEventListener("load", () => {
    const splashScreen = document.getElementById("splashScreen");
    const loginContainer = document.getElementById("loginContainer");

    // Configuração de tempos
    const timeBeforeFade = 1500; // Tempo inicial antes do fade (em ms)
    const fadeDuration = 1500; // Duração do efeito fade-out (em ms)

    // Passo 1: Aguarda o tempo antes do fade e aplica o fade-out na imagem
    setTimeout(() => {
      splashScreen.style.opacity = 0; // Aplica o fade-out na tela splash
    }, timeBeforeFade);

    // Passo 2: Após o tempo do fade, esconde o splash e exibe o login
    setTimeout(() => {
      splashScreen.classList.add("hidden"); // Esconde o splash screen
      loginContainer.classList.remove("hidden"); // Exibe a tela de login
      loginContainer.style.display = "block"; // Exibe a tela de login
    }, timeBeforeFade + fadeDuration); // Soma os tempos do fade-out
  });

  // Verifica se o formulário de login está presente
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value;
      const senha = document.getElementById("senha").value;

      console.log("Email:", email); // Verifique se o email está correto
      console.log("Senha:", senha); // Verifique se a senha está sendo passada corretamente

      try {
        const response = await fetch("http://localhost:3000/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, senha }),
        });

        const data = await response.json();
        if (response.ok) {
          sessionStorage.setItem("loggedIn", "true");
          localStorage.setItem("authToken", data.token);
          // No momento do login, você define que o usuário está logado

          console.log("Login bem-sucedido", data);
          window.location.replace("/index"); // Redireciona para a página inicial após login
        } else {
          console.log(data.message);
          alert("E-mail ou senha incorretos!");
        }
      } catch (error) {
        console.error("Erro ao fazer login", error);
        alert("Ocorreu um erro no login. Tente novamente.");
      }
    });
  }

  // Verifica se o formulário de registro está presente
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const cpf = document.getElementById("registerCpf").value;
      const nome = document.getElementById("registerNome").value;
      const telefone = document.getElementById("registerTelefone").value;
      const email = document.getElementById("registerEmail").value;
      const dataNasc = document.getElementById("registerDataNasc").value;
      const senha = document.getElementById("registerSenha").value;

      try {
        const response = await fetch("/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cpf, nome, telefone, email, dataNasc, senha }),
        });

        const data = await response.json();
        if (response.ok) {
          alert(data.message);
          showLoginBtn.click(); // Alterna para o formulário de login após cadastro bem-sucedido
        } else {
          alert(data.message || "Erro ao cadastrar!");
        }
      } catch (error) {
        console.error("Erro ao cadastrar", error);
        alert("Ocorreu um erro no cadastro. Tente novamente.");
      }
    });
  }

  // Função para alternar entre login e cadastro
  if (showRegisterBtn) {
    showRegisterBtn.addEventListener("click", function () {
      loginForm.style.display = "none";
      registerForm.style.display = "block";
    });
  }

  if (showLoginBtn) {
    showLoginBtn.addEventListener("click", function () {
      registerForm.style.display = "none";
      loginForm.style.display = "block";
    });
  }
});
