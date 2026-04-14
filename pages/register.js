/* ============================================================
   NutriControl — Página de Registro de Usuario (Paciente)
   ============================================================ */
window.NutriPages = window.NutriPages || {};

window.NutriPages['register'] = {

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
            <p class="brand-tagline">Únete a nuestra plataforma y lleva el control de tu evolución nutricional.</p>
          </div>

          <!-- Formulario -->
          <div class="glass-card login-card" style="max-width: 450px;">
            <div class="login-card__header">
              <div style="display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:12px">
                <div style="width:40px;height:40px;background:linear-gradient(135deg,#10b981,#059669);border-radius:10px;display:flex;align-items:center;justify-content:center;box-shadow:0 0 20px rgba(16,185,129,.3)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="white"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" /></svg>
                </div>
              </div>
              <h2>Crear Cuenta</h2>
              <p>Completa tus datos para registrarte</p>
            </div>

            <form id="register-form" class="login-form" novalidate>

              <div style="display:flex;gap:12px;">
                <!-- Nombre -->
                <div class="form-group" style="flex:1;">
                  <label for="reg-firstname">Nombre</label>
                  <div class="input-wrapper">
                    <input type="text" id="reg-firstname" name="first_name" placeholder="Ej: Juan" required>
                  </div>
                </div>

                <!-- Apellido -->
                <div class="form-group" style="flex:1;">
                  <label for="reg-lastname">Apellido</label>
                  <div class="input-wrapper">
                    <input type="text" id="reg-lastname" name="last_name" placeholder="Ej: Pérez" required>
                  </div>
                </div>
              </div>

              <!-- Email -->
              <div class="form-group">
                <label for="reg-email">Correo electrónico</label>
                <div class="input-wrapper">
                  <input type="email" id="reg-email" name="email" placeholder="tucorreo@ejemplo.com" required>
                </div>
              </div>

              <!-- Contraseña -->
              <div class="form-group">
                <label for="reg-password">Contraseña</label>
                <div class="input-wrapper">
                  <input type="password" id="reg-password" name="password" placeholder="••••••••" required>
                  <button type="button" id="toggle-reg-password" class="input-action" aria-label="Mostrar contraseña">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  </button>
                </div>
              </div>

              <!-- Error -->
              <div id="reg-error" class="alert alert-danger hidden" role="alert">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/></svg>
                <span id="reg-error-text"></span>
              </div>

              <!-- Submit -->
              <button type="submit" id="reg-btn" class="btn btn-primary btn-lg btn-full" style="margin-top: 10px;">
                <span id="reg-btn-text">Registrarme</span>
                <span id="reg-btn-spinner" class="spinner hidden"></span>
              </button>

            </form>

            <div class="login-hint" style="margin-top: 20px; text-align: center;">
              <p style="color: var(--text-secondary);">¿Ya tienes una cuenta? <a href="#/login" style="color:var(--accent);text-decoration:none;font-weight:600">Inicia sesión</a></p>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  init() {
    const form        = document.getElementById('register-form');
    const fnameInput  = document.getElementById('reg-firstname');
    const lnameInput  = document.getElementById('reg-lastname');
    const emailInput  = document.getElementById('reg-email');
    const passInput   = document.getElementById('reg-password');
    const toggleBtn   = document.getElementById('toggle-reg-password');
    const errorEl     = document.getElementById('reg-error');
    const errorText   = document.getElementById('reg-error-text');
    const regBtn      = document.getElementById('reg-btn');
    const btnText     = document.getElementById('reg-btn-text');
    const btnSpinner  = document.getElementById('reg-btn-spinner');

    /* Toggle visibilidad contraseña */
    toggleBtn.addEventListener('click', () => {
      const isPass = passInput.type === 'password';
      passInput.type = isPass ? 'text' : 'password';
      toggleBtn.setAttribute('aria-label', isPass ? 'Ocultar contraseña' : 'Mostrar contraseña');
    });

    /* Ocultar error al escribir */
    [fnameInput, lnameInput, emailInput, passInput].forEach(el => {
      el.addEventListener('input', () => {
        errorEl.classList.add('hidden');
      });
    });

    /* Submit */
    form.addEventListener('submit', async e => {
      e.preventDefault();

      const fname    = fnameInput.value.trim();
      const lname    = lnameInput.value.trim();
      const email    = emailInput.value.trim();
      const password = passInput.value;

      if (!fname || !lname || !email || !password) {
        this._showError(errorEl, errorText, 'Por favor completa todos los campos.');
        return;
      }
      
      if (password.length < 6) {
        this._showError(errorEl, errorText, 'La contraseña debe tener al menos 6 caracteres.');
        return;
      }

      /* Estado de carga */
      regBtn.disabled = true;
      btnText.textContent = 'Creando cuenta…';
      btnSpinner.classList.remove('hidden');
      errorEl.classList.add('hidden');

      const result = await Auth.register(email, password, fname, lname);

      if (result.ok) {
        const session = Auth.getSession();
        btnText.textContent = '¡Cuenta Creada!';
        Toast.success(`¡Bienvenido, ${session.firstName}!`);

        setTimeout(() => {
          window.location.hash = '#/patient/dashboard';
        }, 400);
      } else {
        regBtn.disabled = false;
        btnText.textContent = 'Registrarme';
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
