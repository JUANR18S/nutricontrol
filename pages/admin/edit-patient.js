/* ============================================================
   NutriControl — Editar Paciente (Admin)
   ============================================================
   Reutiliza la misma estructura de formulario que new-patient,
   pero carga los datos existentes y actualiza en vez de crear.
   La contraseña es OPCIONAL: sólo se cambia si el admin la llena.
   ============================================================ */
window.NutriPages = window.NutriPages || {};

window.NutriPages['admin-edit-patient'] = {

  render(container, params) {
    const session = Auth.getSession();
    const patient = Store.getPatientById(params.id);

    /* Paciente no encontrado */
    if (!patient) {
      container.innerHTML = Layout.wrap(session, 'admin/patients', `
        <div class="placeholder-page">
          <div class="placeholder-icon">🔍</div>
          <h2>Paciente no encontrado</h2>
          <p>El paciente solicitado no existe o fue eliminado.</p>
          <a href="#/admin/patients" class="btn btn-primary" style="margin-top:8px">Volver al listado</a>
        </div>`);
      Layout.init();
      return;
    }

    const content = `
      <div class="page-header">
        <div>
          <h1>Editar Paciente</h1>
          <p style="color:var(--text-secondary);margin-top:4px">Modifica los datos de <strong>${Utils.escapeHtml(patient.firstName)} ${Utils.escapeHtml(patient.lastName)}</strong>.</p>
        </div>
        <a href="#/admin/patients/${patient.id}" class="btn btn-secondary btn-sm">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="15" height="15"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/></svg>
          Volver al perfil
        </a>
      </div>

      <form id="edit-patient-form" novalidate>
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
              <label for="ep-firstname">Nombre <span style="color:var(--danger)">*</span></label>
              <input type="text" id="ep-firstname" placeholder="María" value="${Utils.escapeHtml(patient.firstName)}" required>
            </div>
            <div class="form-group">
              <label for="ep-lastname">Apellido <span style="color:var(--danger)">*</span></label>
              <input type="text" id="ep-lastname" placeholder="González" value="${Utils.escapeHtml(patient.lastName)}" required>
            </div>
            <div class="form-group">
              <label for="ep-email">Correo electrónico <span style="color:var(--danger)">*</span></label>
              <input type="email" id="ep-email" placeholder="correo@ejemplo.com" value="${Utils.escapeHtml(patient.email)}" required>
            </div>
            <div class="form-group">
              <label for="ep-phone">Teléfono</label>
              <input type="tel" id="ep-phone" placeholder="+56 9 1234 5678" value="${Utils.escapeHtml(patient.phone || '')}">
            </div>
            <div class="form-group">
              <label for="ep-birthdate">Fecha de Nacimiento <span style="color:var(--danger)">*</span></label>
              <input type="date" id="ep-birthdate" value="${patient.birthDate || ''}" required>
            </div>
            <div class="form-group">
              <label for="ep-gender">Género <span style="color:var(--danger)">*</span></label>
              <select id="ep-gender" required>
                <option value="">Seleccionar…</option>
                <option value="female" ${patient.gender === 'female' ? 'selected' : ''}>Femenino</option>
                <option value="male"   ${patient.gender === 'male'   ? 'selected' : ''}>Masculino</option>
                <option value="other"  ${patient.gender === 'other'  ? 'selected' : ''}>Otro</option>
              </select>
            </div>
            <div class="form-group" style="grid-column: 1 / -1">
              <label for="ep-objective">Objetivo Nutricional <span style="color:var(--danger)">*</span></label>
              <input type="text" id="ep-objective" placeholder="Ej: Reducción de peso, aumento de masa muscular…" value="${Utils.escapeHtml(patient.objective || '')}" required>
            </div>
          </div>
        </div>

        <!-- Cambiar contraseña (opcional) -->
        <div class="card" style="margin-bottom:20px">
          <div class="card__header">
            <h3 class="card__title">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" width="18" height="18"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/></svg>
              Cambiar Contraseña
            </h3>
          </div>
          <div class="alert alert-info" style="margin-bottom:16px">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"/></svg>
            Deja estos campos vacíos si no deseas cambiar la contraseña del paciente.
          </div>
          <div class="form-grid form-grid-2">
            <div class="form-group">
              <label for="ep-password">Nueva Contraseña</label>
              <div class="input-wrapper">
                <input type="password" id="ep-password" placeholder="Mínimo 6 caracteres">
                <button type="button" class="input-action" id="ep-toggle-pass" aria-label="Mostrar contraseña">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                </button>
              </div>
            </div>
            <div class="form-group">
              <label for="ep-confirm-password">Confirmar Nueva Contraseña</label>
              <input type="password" id="ep-confirm-password" placeholder="Repetir contraseña">
            </div>
          </div>
        </div>

        <!-- Error y submit -->
        <div id="ep-error" class="alert alert-danger hidden" role="alert">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/></svg>
          <span id="ep-error-text"></span>
        </div>

        <div class="flex gap-2" style="justify-content:flex-end;margin-top:8px">
          <a href="#/admin/patients/${patient.id}" class="btn btn-secondary">Cancelar</a>
          <button type="submit" id="ep-submit" class="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="15" height="15"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <span id="ep-submit-text">Guardar Cambios</span>
            <span id="ep-submit-spinner" class="spinner spinner-sm hidden"></span>
          </button>
        </div>
      </form>
    `;

    container.innerHTML = Layout.wrap(session, 'admin-edit-patient', content);
    Layout.init();
  },

  init(params) {
    const form          = document.getElementById('edit-patient-form');
    const errorEl       = document.getElementById('ep-error');
    const errorText     = document.getElementById('ep-error-text');
    const submitBtn     = document.getElementById('ep-submit');
    const submitText    = document.getElementById('ep-submit-text');
    const submitSpinner = document.getElementById('ep-submit-spinner');
    const togglePass    = document.getElementById('ep-toggle-pass');
    const passInput     = document.getElementById('ep-password');

    if (!form) return;

    /* Toggle visibilidad contraseña */
    togglePass.addEventListener('click', () => {
      passInput.type = passInput.type === 'password' ? 'text' : 'password';
    });

    /* Submit */
    form.addEventListener('submit', async e => {
      e.preventDefault();
      errorEl.classList.add('hidden');

      const patient = Store.getPatientById(params.id);
      if (!patient) {
        return this._showError(errorText, errorEl, 'El paciente ya no existe.');
      }

      const firstName   = document.getElementById('ep-firstname').value.trim();
      const lastName    = document.getElementById('ep-lastname').value.trim();
      const email       = document.getElementById('ep-email').value.trim();
      const phone       = document.getElementById('ep-phone').value.trim();
      const birthDate   = document.getElementById('ep-birthdate').value;
      const gender      = document.getElementById('ep-gender').value;
      const objective   = document.getElementById('ep-objective').value.trim();
      const password    = document.getElementById('ep-password').value;
      const confirmPass = document.getElementById('ep-confirm-password').value;

      /* ── Validaciones ───────────────────────────────────── */
      if (!firstName || !lastName || !email || !birthDate || !gender || !objective) {
        return this._showError(errorText, errorEl, 'Por favor completa todos los campos obligatorios.');
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return this._showError(errorText, errorEl, 'El correo electrónico no es válido.');
      }
      /* Verificar email duplicado excluyendo el usuario actual */
      if (Store.emailExists(email, patient.userId)) {
        return this._showError(errorText, errorEl, 'Este correo ya está registrado por otro usuario.');
      }
      /* Contraseña solo si la llenaron */
      if (password) {
        if (password.length < 6) {
          return this._showError(errorText, errorEl, 'La nueva contraseña debe tener al menos 6 caracteres.');
        }
        if (password !== confirmPass) {
          return this._showError(errorText, errorEl, 'Las contraseñas no coinciden.');
        }
      }

      /* ── Loading state ──────────────────────────────────── */
      submitBtn.disabled = true;
      submitText.textContent = 'Guardando…';
      submitSpinner.classList.remove('hidden');
      await new Promise(r => setTimeout(r, 500));

      /* ── Actualizar perfil de paciente ───────────────────── */
      Store.updatePatient(patient.id, {
        firstName,
        lastName,
        email,
        phone,
        birthDate,
        gender,
        objective,
      });

      /* ── Actualizar usuario vinculado ────────────────────── */
      const userUpdates = { firstName, lastName, email };
      if (password) {
        userUpdates.password = Utils.hashPassword(password);
      }
      Store.updateUser(patient.userId, userUpdates);

      /* ── Actualizar sesión si el paciente editado está logueado ─ */
      const currentSession = Auth.getSession();
      if (currentSession && currentSession.userId === patient.userId) {
        Auth.updateSessionName(firstName, lastName);
      }

      Toast.success('Paciente actualizado', `${firstName} ${lastName} fue actualizado exitosamente.`);
      App.navigate(`#/admin/patients/${patient.id}`);
    });
  },

  _showError(textEl, el, msg) {
    textEl.textContent = msg;
    el.classList.remove('hidden');
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  },
};
