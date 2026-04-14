/* ============================================================
   NutriControl — Página de Login
   ============================================================ */
window.NutriPages = window.NutriPages || {};

window.NutriPages['login'] = {

  render(container) {
    container.innerHTML = `
      <div class="login-page">

        <!-- Fondo animado -->
        <div class="login-bg">
          <div class="blob blob-1"></div>
          <div class="blob blob-2"></div>
          <div class="blob blob-3"></div>
        </div>

        <div class="login-content">

          <!-- Branding lateral -->
          <div class="login-brand">
            <div class="brand-logo-wrap">
              <div class="brand-logo">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" color="white">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/>
                </svg>
              </div>
              <h1 class="brand-name">NutriControl</h1>
            </div>
            <p class="brand-tagline">Sistema profesional de control y seguimiento nutricional para pacientes.</p>
            <div class="brand-features">
              <div class="brand-feature">
                <div class="brand-feature-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/></svg>
                </div>
                <span>Gestión completa de pacientes y perfiles</span>
              </div>
              <div class="brand-feature">
                <div class="brand-feature-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"/></svg>
                </div>
                <span>Registro y seguimiento de controles nutricionales</span>
              </div>
              <div class="brand-feature">
                <div class="brand-feature-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/></svg>
                </div>
                <span>Dos roles: administrador y paciente</span>
              </div>
            </div>
          </div>

          <!-- Formulario -->
          <div class="glass-card login-card">
            <div class="login-card__header">
              <div style="display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:12px">
                <div style="width:40px;height:40px;background:linear-gradient(135deg,#10b981,#059669);border-radius:10px;display:flex;align-items:center;justify-content:center;box-shadow:0 0 20px rgba(16,185,129,.3)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="white"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/></svg>
                </div>
              </div>
              <h2>Iniciar Sesión</h2>
              <p>Ingresa tus credenciales para continuar</p>
            </div>

            <form id="login-form" class="login-form" novalidate>

              <!-- Email -->
              <div class="form-group">
                <label for="login-email">Correo electrónico</label>
                <div class="input-wrapper">
                  <span class="input-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/></svg>
                  </span>
                  <input
                    type="email"
                    id="login-email"
                    name="email"
                    placeholder="tucorreo@ejemplo.com"
                    autocomplete="email"
                    required
                  >
                </div>
              </div>

              <!-- Contraseña -->
              <div class="form-group">
                <label for="login-password">Contraseña</label>
                <div class="input-wrapper">
                  <span class="input-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/></svg>
                  </span>
                  <input
                    type="password"
                    id="login-password"
                    name="password"
                    placeholder="••••••••"
                    autocomplete="current-password"
                    required
                  >
                  <button type="button" id="toggle-password" class="input-action" aria-label="Mostrar contraseña">
                    <svg id="eye-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  </button>
                </div>
              </div>

              <!-- Error -->
              <div id="login-error" class="alert alert-danger hidden" role="alert">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/></svg>
                <span id="login-error-text"></span>
              </div>

              <!-- Submit -->
              <button type="submit" id="login-btn" class="btn btn-primary btn-lg btn-full">
                <span id="login-btn-text">Ingresar</span>
                <span id="login-btn-spinner" class="spinner hidden"></span>
              </button>

            </form>

            <!-- Registro -->
            <div class="login-hint" style="margin-top: 20px; text-align: center;">
              <p style="color: var(--text-secondary);">¿No tienes una cuenta? <a href="#/register" style="color:var(--accent);text-decoration:none;font-weight:600">Regístrate aquí</a></p>
            </div>
          </div>

        </div>
      </div>
    `;
  },

  init() {
    const form        = document.getElementById('login-form');
    const emailInput  = document.getElementById('login-email');
    const passInput   = document.getElementById('login-password');
    const toggleBtn   = document.getElementById('toggle-password');
    const errorEl     = document.getElementById('login-error');
    const errorText   = document.getElementById('login-error-text');
    const loginBtn    = document.getElementById('login-btn');
    const btnText     = document.getElementById('login-btn-text');
    const btnSpinner  = document.getElementById('login-btn-spinner');

    /* Toggle visibilidad contraseña */
    toggleBtn.addEventListener('click', () => {
      const isPass = passInput.type === 'password';
      passInput.type = isPass ? 'text' : 'password';
      toggleBtn.setAttribute('aria-label', isPass ? 'Ocultar contraseña' : 'Mostrar contraseña');
    });

    /* Ocultar error al escribir */
    [emailInput, passInput].forEach(el => {
      el.addEventListener('input', () => {
        errorEl.classList.add('hidden');
      });
    });

    /* Submit */
    form.addEventListener('submit', async e => {
      e.preventDefault();

      const email    = emailInput.value.trim();
      const password = passInput.value;

      if (!email || !password) {
        this._showError(errorEl, errorText, 'Por favor completa todos los campos.');
        return;
      }

      /* Estado de carga */
      loginBtn.disabled = true;
      btnText.textContent = 'Verificando…';
      btnSpinner.classList.remove('hidden');
      errorEl.classList.add('hidden');

      const result = await Auth.login(email, password);

      if (result.ok) {
        const session = Auth.getSession();
        btnText.textContent = '¡Bienvenido!';
        Toast.success(`Bienvenido, ${session.firstName}`);

        setTimeout(() => {
          window.location.hash = result.role === 'admin'
            ? '#/admin/dashboard'
            : '#/patient/dashboard';
        }, 400);
      } else {
        loginBtn.disabled = false;
        btnText.textContent = 'Ingresar';
        btnSpinner.classList.add('hidden');
        this._showError(errorEl, errorText, result.error);
        form.classList.add('shake');
        form.addEventListener('animationend', () => form.classList.remove('shake'), { once: true });
      }
    });
  },

  _showError(el, textEl, msg) {
    textEl.textContent = msg;
    el.classList.remove('hidden');
  },
};
