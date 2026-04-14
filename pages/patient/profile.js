/* ============================================================
   NutriControl — Mi Perfil (Paciente, solo lectura)
   ============================================================ */
window.NutriPages = window.NutriPages || {};

window.NutriPages['patient-profile'] = {

  async render(container) {
    const session = Auth.getSession();
    const patient = await Store.getPatientByUserId(session.userId);

    if (!patient) {
      container.innerHTML = Layout.wrap(session, 'patient/profile', `
        <div class="placeholder-page animate-up">
          <div class="placeholder-icon">⚠️</div>
          <h2>Perfil no encontrado</h2>
          <p>Tu perfil aún no ha sido configurado. Contacta a tu nutricionista.</p>
        </div>
      `);
      Layout.init();
      return;
    }

    const age      = patient.birthDate ? Utils.calculateAge(patient.birthDate) : null;
    const controls = await Store.getControlsByPatient(patient.id);
    const initials = Utils.initials(patient.firstName, patient.lastName);

    const content = `
      <div class="page-header">
        <div>
          <h1>Mi Perfil</h1>
          <p style="color:var(--text-secondary);margin-top:4px">Tu información personal registrada en el sistema.</p>
        </div>
      </div>

      <!-- Avatar + nombre -->
      <div class="card" style="margin-bottom:20px">
        <div style="display:flex;align-items:center;gap:24px;flex-wrap:wrap">
          <div class="avatar avatar-xl">${Utils.escapeHtml(initials)}</div>
          <div>
            <h2 style="font-size:1.5rem;margin-bottom:4px">
              ${Utils.escapeHtml(patient.firstName)} ${Utils.escapeHtml(patient.lastName)}
            </h2>
            <p style="color:var(--text-secondary)">${Utils.escapeHtml(patient.email)}</p>
            <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap">
              <span class="badge badge-success">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="11" height="11"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0"/></svg>
                Paciente
              </span>
              ${age != null ? `<span class="badge badge-info">${age} años</span>` : ''}
              <span class="badge badge-muted">${Utils.escapeHtml(Utils.genderLabel(patient.gender))}</span>
            </div>
          </div>
          <div style="margin-left:auto;text-align:right">
            <div class="text-xs text-muted" style="margin-bottom:4px">Total de controles</div>
            <div style="font-size:2rem;font-weight:800;color:var(--primary)">${controls.length}</div>
          </div>
        </div>
      </div>

      <!-- Datos personales -->
      <div class="card" style="margin-bottom:20px">
        <div class="card__header">
          <h3 class="card__title">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" width="18" height="18">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
            </svg>
            Datos Personales
          </h3>
        </div>
        <div class="grid grid-3" style="gap:20px">
          ${this._field('Nombre', patient.firstName)}
          ${this._field('Apellido', patient.lastName)}
          ${this._field('Correo Electrónico', patient.email)}
          ${this._field('Teléfono', patient.phone || 'No registrado')}
          ${this._field('Fecha de Nacimiento', Utils.formatDate(patient.birthDate))}
          ${this._field('Edad', age != null ? age + ' años' : 'No calculada')}
          ${this._field('Género', Utils.genderLabel(patient.gender))}
          ${this._field('Registrado el', Utils.formatDate(patient.createdAt))}
          ${this._field('Controles realizados', controls.length)}
        </div>
      </div>

      <!-- Objetivo nutricional -->
      <div class="card">
        <div class="card__header">
          <h3 class="card__title">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" width="18" height="18">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/>
            </svg>
            Objetivo Nutricional
          </h3>
        </div>
        <div style="background:var(--primary-muted);border:1px solid rgba(16,185,129,.15);border-radius:var(--radius);padding:16px 20px">
          <p style="color:var(--text-primary);line-height:1.7;font-size:.938rem">
            ${Utils.escapeHtml(patient.objective || 'No definido aún.')}
          </p>
        </div>

        <div class="alert alert-info" style="margin-top:20px">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"/></svg>
          <span>Si necesitas actualizar tus datos personales o tu objetivo, comunícate con tu nutricionista.</span>
        </div>
      </div>
    `;

    container.innerHTML = Layout.wrap(session, 'patient/profile', content);
    Layout.init();
  },

  init() {},

  _field(label, value) {
    return `
      <div class="form-group">
        <label style="font-size:.75rem;text-transform:uppercase;letter-spacing:.5px">${label}</label>
        <p style="color:var(--text-primary);margin-top:4px;font-weight:500">${Utils.escapeHtml(String(value))}</p>
      </div>
    `;
  },
};
