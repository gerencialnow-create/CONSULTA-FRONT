// js/login.js

const form = document.getElementById('login-form');
const button = document.getElementById('login-button');
const errorBox = document.getElementById('login-error');

// URL da API de login na VPS
const API_BASE = 'http://72.61.37.214:5050';

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  errorBox.textContent = '';

  const username = form.username.value.trim();
  const password = form.password.value;

  if (!username || !password) {
    errorBox.textContent = 'Preencha usuário e senha.';
    return;
  }

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

    const data = await response.json().catch(() => ({}));

    if (!response.ok || !data.ok) {
      const msg = data.error || 'Usuário ou senha inválidos.';
      errorBox.textContent = msg;
      return;
    }

    // Login OK – por enquanto só redireciona para uma página em branco futura
    window.location.href = '/dashboard.html';
  } catch (err) {
    console.error(err);
    errorBox.textContent = 'Erro ao conectar com o servidor. Tente novamente.';
  } finally {
    button.disabled = false;
    button.textContent = originalText;
  }
});
