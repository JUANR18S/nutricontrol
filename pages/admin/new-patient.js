/* ============================================================
   NutriControl — Crear Nuevo Paciente (Admin)
   ============================================================ */
window.NutriPages = window.NutriPages || {};

window.NutriPages['admin-new-patient'] = {

  render(container) {
    const session = Auth.getSession();

    const content = `
      <div class="page-header">
        <div>
          <h1>Nuevo Paciente</h1>
          <p style="color:var(--text-secondary);margin-top:4px">Registra un nuevo paciente en el sistema.</p>
        </div>
        <a href="#/admin/patients" class="btn btn-secondary btn-sm">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="15" height="15"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/></svg>
          Volver
        </a>
      </div>

      <form id="new-patient-form" novalidate>
        <!-- Datos personales -->
        <div class="card" style="margin-bottom:20px">
          <div class="card__header">
            <h3 class="card__title">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" width="18" height="18"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/></svg>
              Datos Personales
            </h3>
          </div>
          <div class="form-grid form-grid-2">
            <div class="form-group">
              <label for="np-firstname">Nombre <span style="color:var(--danger)">*</span></label>
              <input type="text" id="np-firstname" placeholder="María" required>
            </div>
            <div class="form-group">
              <label for="np-lastname">Apellido <span style="color:var(--danger)">*</span></label>
              <input type="text" id="np-lastname" placeholder="González" required>
            </div>
            <div class="form-group">
              <label for="np-email">Correo electrónico <span style="color:var(--danger)">*</span></label>
              <input type="email" id="np-email" placeholder="correo@ejemplo.com" required>
            </div>
            <div class="form-group">
              <label for="np-phone">Teléfono</label>
              <input type="tel" id="np-phone" placeholder="+56 9 1234 5678">
            </div>
            <div class="form-group">
              <label for="np-birthdate">Fecha de Nacimiento <span style="color:var(--danger)">*</span></label>
              <input type="date" id="np-birthdate" required>
            </div>
            <div class="form-group">
              <label for="np-gender">Género <span style="color:var(--danger)">*</span></label>
              <select id="np-gender" required>
                <option value="">Seleccionar…</option>
                <option value="female">Femenino</option>
                <option value="male">Masculino</option>
                <option value="other">Otro</option>
              </select>
            </div>
            <div class="form-group" style="grid-column: 1 / -1">
              <label for="np-objective">Objetivo Nutricional <span style="color:var(--danger)">*</span></label>
              <input type="text" id="np-objective" placeholder="Ej: Reducción de peso, aumento de masa muscular…" required>
            </div>
          </div>
        </div>

        <!-- Acceso al sistema -->
        <div class="card" style="margin-bottom:20px">
          <div class="card__header">
            <h3 class="card__title">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" width="18" height="18"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/></svg>
              Acceso al Sistema
            </h3>
          </div>
          <p class="text-sm text-muted" style="margin-bottom:20px">El paciente usará su correo y esta contraseña para iniciar sesión.</p>
          <div class="form-grid form-grid-2">
            <div class="form-group">
              <label for="np-password">Contraseña <span style="color:var(--danger)">*</span></label>
              <div class="input-wrapper">
                <input type="password" id="np-password" placeholder="Mínimo 6 caracteres" required>
                <button type="button" class="input-action" id="np-toggle-pass" aria-label="Mostrar contraseña">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                </button>
              </div>
            </div>
            <div class="form-group">
              <label for="np-confirm-password">Confirmar Contraseña <span style="color:var(--danger)">*</span></label>
              <input type="password" id="np-confirm-password" placeholder="Repetir contraseña" required>
            </div>
          </div>
        </div>

        <!-- Error y submit -->
        <div id="np-error" class="alert alert-danger hidden" role="alert">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/></svg>
          <span id="np-error-text"></span>
        </div>

        <div class="flex gap-2" style="justify-content:flex-end;margin-top:8px">
          <a href="#/admin/patients" class="btn btn-secondary">Cancelar</a>
          <button type="submit" id="np-submit" class="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="15" height="15"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
            <span id="np-submit-text">Crear Paciente</span>
            <span id="np-submit-spinner" class="spinner spinner-sm hidden"></span>
          </button>
        </div>
      </form>
    `;

    container.innerHTML = Layout.wrap(session, 'admin-new-patient', content);
    Layout.init();
  },

  init() {
    const form        = document.getElementById('new-patient-form');
    const errorEl     = document.getElementById('np-error');
    const errorText   = document.getElementById('np-error-text');
    const submitBtn   = document.getElementById('np-submit');
    const submitText  = document.getElementById('np-submit-text');
    const submitSpinner = document.getElementById('np-submit-spinner');
    const togglePass  = document.getElementById('np-toggle-pass');
    const passInput   = document.getElementById('np-password');

    togglePass.addEventListener('click', () => {
      passInput.type = passInput.type === 'password' ? 'text' : 'password';
    });

    form.addEventListener('submit', async e => {
      e.preventDefault();
      errorEl.classList.add('hidden');

      const firstName   = document.getElementById('np-firstname').value.trim();
      const lastName    = document.getElementById('np-lastname').value.trim();
      const email       = document.getElementById('np-email').value.trim();
      const phone       = document.getElementById('np-phone').value.trim();
      const birthDate   = document.getElementById('np-birthdate').value;
      const gender      = document.getElementById('np-gender').value;
      const objective   = document.getElementById('np-objective').value.trim();
      const password    = document.getElementById('np-password').value;
      const confirmPass = document.getElementById('np-confirm-password').value;

      /* Validaciones */
      if (!firstName || !lastName || !email || !birthDate || !gender || !objective || !password) {
        return this._showError(errorText, errorEl, 'Por favor completa todos los campos obligatorios.');
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return this._showError(errorText, errorEl, 'El correo electrónico no es válido.');
      }
      if (Store.emailExists(email)) {
        return this._showError(errorText, errorEl, 'Este correo ya está registrado en el sistema.');
      }
      if (password.length < 6) {
        return this._showError(errorText, errorEl, 'La contraseña debe tener al menos 6 caracteres.');
      }
      if (password !== confirmPass) {
        return this._showError(errorText, errorEl, 'Las contraseñas no coinciden.');
      }

      /* Loading */
      submitBtn.disabled  = true;
      submitText.textContent = 'Creando…';
      submitSpinner.classList.remove('hidden');
      await new Promise(r => setTimeout(r, 500));

      const session = Auth.getSession();
      const userId  = Utils.generateId();
      const patientId = Utils.generateId();

      /* Crear usuario */
      Store.addUser({
        id: userId,
        email,
        password: Utils.hashPassword(password),
        role: 'patient',
        firstName,
        lastName,
        createdAt: new Date().toISOString(),
      });

      /* Crear perfil de paciente */
      Store.addPatient({
        id: patientId,
        userId,
        firstName,
        lastName,
        email,
        phone,
        birthDate,
        gender,
        objective,
        createdAt: new Date().toISOString(),
        createdBy: session.userId,
      });

      Toast.success('Paciente creado', `${firstName} ${lastName} fue registrado exitosamente.`);
      App.navigate(`#/admin/patients/${patientId}`);
    });
  },

  _showError(textEl, el, msg) {
    textEl.textContent = msg;
    el.classList.remove('hidden');
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  },
};
