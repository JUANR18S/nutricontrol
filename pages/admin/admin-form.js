/* ============================================================
   NutriControl — Crear y Editar Administrador (Admin)
   Registra ambas páginas: 'admin-new-admin' y 'admin-edit-admin'
   ============================================================ */
window.NutriPages = window.NutriPages || {};

/* ── Página compartida (factory) ────────────────────────────── */
function _adminForm(container, adminUser = null) {
  const session  = Auth.getSession();
  const isEdit   = !!adminUser;
  const title    = isEdit ? 'Editar Administrador' : 'Nuevo Administrador';
  const navKey   = isEdit ? 'admin-edit-admin' : 'admin-new-admin';
  const formId   = 'admin-user-form';

  const content = `
    <div class="page-header">
      <div>
        <h1>${title}</h1>
        <p style="color:var(--text-secondary);margin-top:4px">
          ${isEdit ? 'Modifica los datos del administrador.' : 'Crea un nuevo administrador en el sistema.'}
        </p>
      </div>
      <a href="#/admin/admins" class="btn btn-secondary btn-sm">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="15" height="15"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/></svg>
        Volver
      </a>
    </div>

    <form id="${formId}" novalidate>
      <!-- Datos personales -->
      <div class="card" style="margin-bottom:20px">
        <div class="card__header">
          <h3 class="card__title">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" width="18" height="18"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/></svg>
            Datos del Administrador
          </h3>
        </div>
        <div class="form-grid form-grid-2">
          <div class="form-group">
            <label for="au-firstname">Nombre <span style="color:var(--danger)">*</span></label>
            <input type="text" id="au-firstname" value="${isEdit ? Utils.escapeHtml(adminUser.firstName) : ''}" placeholder="Carlos" required>
          </div>
          <div class="form-group">
            <label for="au-lastname">Apellido <span style="color:var(--danger)">*</span></label>
            <input type="text" id="au-lastname" value="${isEdit ? Utils.escapeHtml(adminUser.lastName) : ''}" placeholder="Pérez" required>
          </div>
          <div class="form-group" style="grid-column:1/-1">
            <label for="au-email">Correo electrónico <span style="color:var(--danger)">*</span></label>
            <input type="email" id="au-email" value="${isEdit ? Utils.escapeHtml(adminUser.email) : ''}" placeholder="admin@ejemplo.com" required>
          </div>
        </div>
      </div>

      <!-- Contraseña -->
      <div class="card" style="margin-bottom:20px">
        <div class="card__header">
          <h3 class="card__title">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" width="18" height="18"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/></svg>
            Contraseña
          </h3>
        </div>
        ${isEdit ? `<p class="text-sm text-muted" style="margin-bottom:20px">Deja estos campos en blanco para mantener la contraseña actual.</p>` : ''}
        <div class="form-grid form-grid-2">
          <div class="form-group">
            <label for="au-password">Contraseña ${isEdit ? '' : '<span style="color:var(--danger)">*</span>'}</label>
            <div class="input-wrapper">
              <input type="password" id="au-password" placeholder="${isEdit ? 'Nueva contraseña (opcional)' : 'Mínimo 6 caracteres'}" ${isEdit ? '' : 'required'}>
              <button type="button" class="input-action" id="au-toggle-pass" aria-label="Mostrar contraseña">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              </button>
            </div>
          </div>
          <div class="form-group">
            <label for="au-confirm">Confirmar Contraseña ${isEdit ? '' : '<span style="color:var(--danger)">*</span>'}</label>
            <input type="password" id="au-confirm" placeholder="Repetir contraseña" ${isEdit ? '' : 'required'}>
          </div>
        </div>
      </div>

      <!-- Error y submit -->
      <div id="au-error" class="alert alert-danger hidden" role="alert">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/></svg>
        <span id="au-error-text"></span>
      </div>

      <div class="flex gap-2" style="justify-content:flex-end;margin-top:8px">
        <a href="#/admin/admins" class="btn btn-secondary">Cancelar</a>
        <button type="submit" id="au-submit" class="btn btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="15" height="15"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <span id="au-submit-text">${isEdit ? 'Guardar Cambios' : 'Crear Administrador'}</span>
          <span id="au-submit-spinner" class="spinner spinner-sm hidden"></span>
        </button>
      </div>
    </form>
  `;

  container.innerHTML = Layout.wrap(session, navKey, content);
  Layout.init();
}

function _adminFormInit(adminUser = null) {
  const isEdit = !!adminUser;
  const form   = document.getElementById('admin-user-form');
  const errorEl     = document.getElementById('au-error');
  const errorText   = document.getElementById('au-error-text');
  const submitBtn   = document.getElementById('au-submit');
  const submitText  = document.getElementById('au-submit-text');
  const submitSpinner = document.getElementById('au-submit-spinner');
  const togglePass  = document.getElementById('au-toggle-pass');
  const passInput   = document.getElementById('au-password');
  const session     = Auth.getSession();

  togglePass?.addEventListener('click', () => {
    passInput.type = passInput.type === 'password' ? 'text' : 'password';
  });

  form?.addEventListener('submit', async e => {
    e.preventDefault();
    errorEl.classList.add('hidden');

    const firstName = document.getElementById('au-firstname').value.trim();
    const lastName  = document.getElementById('au-lastname').value.trim();
    const email     = document.getElementById('au-email').value.trim();
    const password  = document.getElementById('au-password').value;
    const confirm   = document.getElementById('au-confirm').value;

    const showErr = msg => {
      errorText.textContent = msg;
      errorEl.classList.remove('hidden');
    };

    if (!firstName || !lastName || !email) return showErr('Por favor completa todos los campos obligatorios.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showErr('El correo electrónico no es válido.');
    if (Store.emailExists(email, isEdit ? adminUser.id : null)) return showErr('Este correo ya está en uso por otro usuario.');

    if (!isEdit && !password) return showErr('La contraseña es obligatoria.');
    if (password && password.length < 6) return showErr('La contraseña debe tener al menos 6 caracteres.');
    if (password && password !== confirm) return showErr('Las contraseñas no coinciden.');

    /* Loading */
    submitBtn.disabled = true;
    submitText.textContent = isEdit ? 'Guardando…' : 'Creando…';
    submitSpinner.classList.remove('hidden');
    await new Promise(r => setTimeout(r, 450));

    if (isEdit) {
      const updates = { firstName, lastName, email };
      if (password) updates.password = Utils.hashPassword(password);
      Store.updateUser(adminUser.id, updates);
      /* Actualizar sesión si se está editando a sí mismo */
      if (adminUser.id === session.userId) Auth.updateSessionName(firstName, lastName);
      Toast.success('Administrador actualizado', `${firstName} ${lastName} fue modificado.`);
    } else {
      Store.addUser({
        id:        Utils.generateId(),
        email,
        password:  Utils.hashPassword(password),
        role:      'admin',
        firstName,
        lastName,
        createdAt: new Date().toISOString(),
      });
      Toast.success('Administrador creado', `${firstName} ${lastName} fue registrado como administrador.`);
    }

    App.navigate('#/admin/admins');
  });
}

/* ── Registro en NutriPages ─────────────────────────────────── */
window.NutriPages['admin-new-admin'] = {
  render(container) { _adminForm(container, null); },
  init()            { _adminFormInit(null); },
};

window.NutriPages['admin-edit-admin'] = {
  render(container, params) {
    const admin = Store.getUserById(params.id);
    if (!admin || admin.role !== 'admin') {
      const session = Auth.getSession();
      container.innerHTML = Layout.wrap(session, 'admin/admins', `
        <div class="placeholder-page">
          <div class="placeholder-icon">🔍</div>
          <h2>Administrador no encontrado</h2>
          <a href="#/admin/admins" class="btn btn-primary" style="margin-top:8px">Volver</a>
        </div>`);
      Layout.init();
      return;
    }
    _adminForm(container, admin);
  },
  init(params) {
    const admin = Store.getUserById(params.id);
    if (admin) _adminFormInit(admin);
  },
};
