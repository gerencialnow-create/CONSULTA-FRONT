const form = document.getElementById('login-form');
const errorBox = document.getElementById('login-error');

// API na VPS (via Nginx)
const API_BASE = '/api';
// depois, se quiser, pode trocar para https://seu-dominio/api

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  errorBox.textContent = '';

  const username = form.username.value.trim();
  const password = form.password.value.trim();

  if (!username || !password) {
    errorBox.textContent = 'Preencha usuário e senha.';
    return;
  }

  try {
    const resp = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    if (resp.ok) {
      // login OK
      window.location.href = '/dashboard.html';
    } else if (resp.status === 401) {
      // usuário/senha inválidos
      errorBox.textContent = 'Usuário ou senha inválidos.';
    } else {
      // outro erro de backend (500, 404, etc)
      errorBox.textContent = 'Erro ao conectar com o servidor. Tente novamente.';
    }
  } catch (err) {
    console.error(err);
    errorBox.textContent = 'Erro ao conectar com o servidor. Tente novamente.';
  }
});
