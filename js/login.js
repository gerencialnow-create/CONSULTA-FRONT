// js/login.js

// Pega os elementos do formulário
const form = document.getElementById('login-form');
const button = document.getElementById('login-button');
const errorBox = document.getElementById('login-error');

// URL da API de login na VPS
// IMPORTANTE: se depois você colocar HTTPS, troque para https://SEU_DOMINIO/api...
const API_BASE = 'http://72.61.37.214:5050';

// Listener do submit do formulário
form.addEventListener('submit', async (event) => {
  event.preventDefault();

  // Limpa mensagem de erro
  errorBox.textContent = '';

  const username = form.username.value.trim();
  const password = form.password.value;

  if (!username || !password) {
    errorBox.textContent = 'Preencha usuário e senha.';
    return;
  }

  // Estado de "carregando"
  button.disabled = true;
  const originalText = button.textContent;
  button.textContent = 'Entrando...';

  try {
    const response = await fetch(`${API_BASE}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    let data;
    try {
      data = await response.json();
    } catch (e) {
      data = null;
    }

    // Se a resposta não for ok OU não tiver "ok: true" no JSON → erro
    if (!response.ok || !data || !data.ok) {
      const message =
        (data && (data.error || data.message)) ||
        'Usuário ou senha inválidos.';
      errorBox.textContent = message;
      return;
    }

    // Monta objeto do usuário (backend devolve { ok, username, role })
    const user = {
      username: data.username || username,
      role: data.role || 'user',
      loggedAt: new Date().toISOString()
    };

    // Guarda no localStorage para usar nas próximas telas (opcional)
    try {
      localStorage.setItem('consultaNowUser', JSON.stringify(user));
    } catch (_) {
      // Se der erro no localStorage, segue mesmo assim
    }

    // 🔥 LOGIN OK → Redireciona para o painel
    window.location.href = 'dashboard.html';
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    errorBox.textContent =
      'Não foi possível conectar ao servidor de login. Tente novamente.';
  } finally {
    // Restaura botão
    button.disabled = false;
    button.textContent = originalText;
  }
});
