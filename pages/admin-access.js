/* ============================================================
   NutriControl - Acceso y Registro de Administradores
   ============================================================ */
window.NutriPages = window.NutriPages || {};

window.NutriPages['admin-access'] = {
  render(container, params = {}) {
    const confirmed = params.query?.confirmed === '1';
    const email = params.query?.email ? decodeURIComponent(params.query.email) : '';

    container.innerHTML = `
      <div class="login-page">
        <div class="login-bg">
          <div class="blob blob-1"></div>
          <div class="blob blob-2"></div>
          <div class="blob blob-3"></div>
        </div>

        <div class="login-content login-content--admin">
          <div class="login-brand">
            <div class="brand-logo-wrap">
              <div class="brand-logo">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" color="white">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/>
                </svg>
              </div>
              <h1 class="brand-name">Acceso Administrativo</h1>
            </div>
            <p class="brand-tagline">Modulo restringido para administradores autorizados de NutriControl.</p>
            <div class="brand-features">
              <div class="brand-feature">
                <div class="brand-feature-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 1 1 2.122 5.122L13.5 14.743m-3 3h.008v.008H10.5v-.008Z"/></svg>
                </div>
                <span>El registro exige ID y credencial de administrador.</span>
              </div>
              <div class="brand-feature">
                <div class="brand-feature-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 12.75v6.75A2.25 2.25 0 0 0 6.75 21h10.5Z"/></svg>
                </div>
                <span>Solo las cuentas con rol administrador ingresan al panel.</span>
              </div>
            </div>
          </div>

          <div class="glass-card login-card admin-access-card">
            <div class="login-card__header">
              <h2>Administradores</h2>
              <p>Ingresa o registra una cuenta administrativa autorizada.</p>
            </div>

            <div class="admin-auth-tabs">
              <button type="button" class="admin-auth-tab is-active" data-tab="login">Ingreso</button>
              <button type="button" class="admin-auth-tab" data-tab="register">Registro</button>
            </div>

            <div class="admin-auth-panels">
              <section class="admin-auth-panel is-active" data-panel="login">
                <form id="admin-login-form" class="login-form" novalidate>
                  ${confirmed ? `
                    <div class="alert alert-success" role="status">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75m6 2.25a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>
                      <span>Correo confirmado. Ya puedes entrar al panel administrativo.</span>
                    </div>
                  ` : ''}

                  <div class="form-group">
                    <label for="admin-login-email">Correo electronico</label>
                    <div class="input-wrapper">
                      <input type="email" id="admin-login-email" value="${Utils.escapeHtml(email)}" placeholder="admin@ejemplo.com" autocomplete="email" required>
                    </div>
                  </div>

                  <div class="form-group">
                    <label for="admin-login-password">Contrasena</label>
                    <div class="input-wrapper">
                      <input type="password" id="admin-login-password" placeholder="........" autocomplete="current-password" required>
                      <button type="button" class="input-action" id="admin-login-toggle-password" aria-label="Mostrar contrasena">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/></svg>
                      </button>
                    </div>
                  </div>

                  <div id="admin-login-error" class="alert alert-danger hidden" role="alert">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"/></svg>
                    <span id="admin-login-error-text"></span>
                  </div>

                  <button type="submit" id="admin-login-btn" class="btn btn-primary btn-lg btn-full">
                    <span id="admin-login-btn-text">Ingresar al panel</span>
                    <span id="admin-login-btn-spinner" class="spinner hidden"></span>
                  </button>
                </form>
              </section>

              <section class="admin-auth-panel" data-panel="register">
                <form id="admin-register-form" class="login-form" novalidate>
                  <div class="form-grid form-grid-2">
                    <div class="form-group">
                      <label for="admin-reg-firstname">Nombre</label>
                      <div class="input-wrapper">
                        <input type="text" id="admin-reg-firstname" placeholder="Laura" required>
                      </div>
                    </div>
                    <div class="form-group">
                      <label for="admin-reg-lastname">Apellido</label>
                      <div class="input-wrapper">
                        <input type="text" id="admin-reg-lastname" placeholder="Rios" required>
                      </div>
                    </div>
                  </div>

                  <div class="form-group">
                    <label for="admin-reg-email">Correo electronico</label>
                    <div class="input-wrapper">
                      <input type="email" id="admin-reg-email" placeholder="admin@ejemplo.com" required>
                    </div>
                  </div>

                  <div class="form-grid form-grid-2">
                    <div class="form-group">
                      <label for="admin-reg-password">Contrasena</label>
                      <div class="input-wrapper">
                        <input type="password" id="admin-reg-password" placeholder="Minimo 6 caracteres" required>
                        <button type="button" class="input-action" id="admin-register-toggle-password" aria-label="Mostrar contrasena">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/></svg>
                        </button>
                      </div>
                    </div>
                    <div class="form-group">
                      <label for="admin-reg-confirm">Confirmar contrasena</label>
                      <div class="input-wrapper">
                        <input type="password" id="admin-reg-confirm" placeholder="Repite la contrasena" required>
                        <button type="button" class="input-action" id="admin-register-toggle-confirm" aria-label="Mostrar contrasena">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/></svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div class="form-grid form-grid-2">
                    <div class="form-group">
                      <label for="admin-reg-id">ID de administrador</label>
                      <div class="input-wrapper">
                        <input type="text" id="admin-reg-id" placeholder="ADM-2026-NUTRI" required>
                      </div>
                    </div>
                    <div class="form-group">
                      <label for="admin-reg-key">Credencial / llave</label>
                      <div class="input-wrapper">
                        <input type="password" id="admin-reg-key" placeholder="Credencial de acceso" required>
                        <button type="button" class="input-action" id="admin-register-toggle-key" aria-label="Mostrar credencial">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/></svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div id="admin-register-error" class="alert alert-danger hidden" role="alert">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"/></svg>
                    <span id="admin-register-error-text"></span>
                  </div>

                  <button type="submit" id="admin-register-btn" class="btn btn-primary btn-lg btn-full">
                    <span id="admin-register-btn-text">Registrar administrador</span>
                    <span id="admin-register-btn-spinner" class="spinner hidden"></span>
                  </button>
                </form>
              </section>
            </div>

            <div class="login-hint login-hint--stacked">
              <p>Acceso general del sistema</p>
              <a href="#/login" class="btn btn-outline btn-full">Volver al login general</a>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  init(params = {}) {
    const initialTab = params.query?.tab === 'register' ? 'register' : 'login';
    this._setupTabs(initialTab);
    this._initVisibilityToggles();
    this._initLoginForm();
    this._initRegisterForm();
  },

  _initVisibilityToggles() {
    this._bindVisibilityToggle('admin-login-toggle-password', 'admin-login-password', 'contrasena');
    this._bindVisibilityToggle('admin-register-toggle-password', 'admin-reg-password', 'contrasena');
    this._bindVisibilityToggle('admin-register-toggle-confirm', 'admin-reg-confirm', 'contrasena');
    this._bindVisibilityToggle('admin-register-toggle-key', 'admin-reg-key', 'credencial');
  },

  _bindVisibilityToggle(toggleId, inputId, label) {
    const toggle = document.getElementById(toggleId);
    const input = document.getElementById(inputId);
    if (!toggle || !input) return;

    toggle.addEventListener('click', () => {
      const hidden = input.type === 'password';
      input.type = hidden ? 'text' : 'password';
      toggle.setAttribute('aria-label', hidden ? `Ocultar ${label}` : `Mostrar ${label}`);
    });
  },

  _setupTabs(initialTab) {
    const tabs = document.querySelectorAll('.admin-auth-tab');
    const panels = document.querySelectorAll('.admin-auth-panel');

    const activate = tabName => {
      tabs.forEach(tab => tab.classList.toggle('is-active', tab.dataset.tab === tabName));
      panels.forEach(panel => panel.classList.toggle('is-active', panel.dataset.panel === tabName));
    };

    tabs.forEach(tab => {
      tab.addEventListener('click', () => activate(tab.dataset.tab));
    });

    activate(initialTab);
  },

  _initLoginForm() {
    const form = document.getElementById('admin-login-form');
    const errorEl = document.getElementById('admin-login-error');
    const errorText = document.getElementById('admin-login-error-text');
    const btn = document.getElementById('admin-login-btn');
    const btnText = document.getElementById('admin-login-btn-text');
    const spinner = document.getElementById('admin-login-btn-spinner');

    form?.addEventListener('submit', async e => {
      e.preventDefault();

      const email = document.getElementById('admin-login-email').value.trim();
      const password = document.getElementById('admin-login-password').value;

      if (!email || !password) {
        this._showError(errorEl, errorText, 'Completa el correo y la contrasena.');
        return;
      }

      btn.disabled = true;
      btnText.textContent = 'Validando acceso...';
      spinner.classList.remove('hidden');
      errorEl.classList.add('hidden');

      const result = await Auth.loginAdmin(email, password);
      if (result.ok) {
        Toast.success('Acceso concedido', 'Bienvenido al panel de administradores.');
        window.location.hash = '#/admin/dashboard';
        return;
      }

      btn.disabled = false;
      btnText.textContent = 'Ingresar al panel';
      spinner.classList.add('hidden');
      this._showError(errorEl, errorText, result.error);
    });
  },

  _initRegisterForm() {
    const form = document.getElementById('admin-register-form');
    const errorEl = document.getElementById('admin-register-error');
    const errorText = document.getElementById('admin-register-error-text');
    const btn = document.getElementById('admin-register-btn');
    const btnText = document.getElementById('admin-register-btn-text');
    const spinner = document.getElementById('admin-register-btn-spinner');

    form?.addEventListener('submit', async e => {
      e.preventDefault();

      const firstName = document.getElementById('admin-reg-firstname').value.trim();
      const lastName = document.getElementById('admin-reg-lastname').value.trim();
      const email = document.getElementById('admin-reg-email').value.trim();
      const password = document.getElementById('admin-reg-password').value;
      const confirm = document.getElementById('admin-reg-confirm').value;
      const adminId = document.getElementById('admin-reg-id').value.trim();
      const accessKey = document.getElementById('admin-reg-key').value;

      if (!firstName || !lastName || !email || !password || !confirm || !adminId || !accessKey) {
        this._showError(errorEl, errorText, 'Completa todos los campos del registro administrativo.');
        return;
      }

      if (password.length < 6) {
        this._showError(errorEl, errorText, 'La contrasena debe tener al menos 6 caracteres.');
        return;
      }

      if (password !== confirm) {
        this._showError(errorEl, errorText, 'Las contrasenas no coinciden.');
        return;
      }

      btn.disabled = true;
      btnText.textContent = 'Creando acceso administrativo...';
      spinner.classList.remove('hidden');
      errorEl.classList.add('hidden');

      const result = await Auth.registerAdmin({
        email,
        password,
        firstName,
        lastName,
        adminId,
        accessKey,
      });

      if (result.ok && result.requireEmail) {
        window.location.hash = `#/email-confirmation?email=${encodeURIComponent(email)}&mode=admin`;
        return;
      }

      btn.disabled = false;
      btnText.textContent = 'Registrar administrador';
      spinner.classList.add('hidden');
      this._showError(errorEl, errorText, result.error);
    });
  },

  _showError(el, textEl, msg) {
    textEl.textContent = msg;
    el.classList.remove('hidden');
  },
};
