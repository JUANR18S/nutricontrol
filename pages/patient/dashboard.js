/* ============================================================
   NutriControl — Dashboard del Paciente
   ============================================================ */
window.NutriPages = window.NutriPages || {};

window.NutriPages['patient-dashboard'] = {

  render(container) {
    const session = Auth.getSession();
    const patient = Store.getPatientByUserId(session.userId);

    /* ── Sin perfil asociado ────────────────────────────── */
    if (!patient) {
      container.innerHTML = Layout.wrap(session, 'patient/dashboard', `
        <div class="placeholder-page animate-up">
          <div class="placeholder-icon">⚠️</div>
          <h2>Perfil no configurado</h2>
          <p>Tu cuenta aún no tiene un perfil de paciente asociado.<br>Contacta a tu nutricionista.</p>
        </div>
      `);
      Layout.init();
      return;
    }

    const controls   = Store.getControlsByPatient(patient.id);
    const lastCtrl   = controls[0] ?? null;
    const age        = patient.birthDate ? Utils.calculateAge(patient.birthDate) : null;

    /* ── Tarjetas métricas del último control ─────────── */
    const metricCards = lastCtrl ? `
      <div class="grid grid-4" style="margin-bottom:28px">
        ${this._metric('Peso Actual', lastCtrl.weight + ' kg', 'blue',
            `Talla: ${lastCtrl.height} cm`)}
        ${this._metric('IMC', lastCtrl.bmi, Utils.getBMICategory(lastCtrl.bmi).cls,
            Utils.getBMICategory(lastCtrl.bmi).label)}
        ${this._metric('% Grasa Corporal',
            lastCtrl.fatPercentage != null ? lastCtrl.fatPercentage + '%' : '—', 'amber', '')}
        ${this._metric('Masa Muscular',
            lastCtrl.muscleMass != null ? lastCtrl.muscleMass + ' kg' : '—', 'green', '')}
      </div>
    ` : '';

    /* ── Último control detalle ────────────────────────── */
    const lastCtrlCard = lastCtrl ? `
      <div class="card" style="margin-bottom:20px">
        <div class="card__header">
          <h3 class="card__title">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" width="18" height="18">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Último Control
          </h3>
          <span class="badge badge-success">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="11" height="11"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5"/></svg>
            ${Utils.formatDate(lastCtrl.date)}
          </span>
        </div>
        <div class="grid grid-2" style="gap:20px">
          ${lastCtrl.notes ? `
            <div>
              <p class="text-xs font-semibold text-muted" style="text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">Notas del Nutricionista</p>
              <p style="line-height:1.7;color:var(--text-secondary)">${Utils.escapeHtml(lastCtrl.notes)}</p>
            </div>
          ` : '<div><p class="text-muted text-sm">Sin notas en este control.</p></div>'}
          ${lastCtrl.dietPlan ? `
            <div>
              <p class="text-xs font-semibold text-muted" style="text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">Tu Plan Dietético</p>
              <p style="line-height:1.7;color:var(--text-secondary)">${Utils.escapeHtml(lastCtrl.dietPlan)}</p>
            </div>
          ` : '<div><p class="text-muted text-sm">Sin plan dietético registrado.</p></div>'}
        </div>
        ${lastCtrl.waistCircumference != null ? `
          <div style="margin-top:16px;padding-top:16px;border-top:1px solid var(--border);display:flex;gap:24px">
            <div>
              <span class="text-xs text-muted">Cintura</span>
              <p class="font-semibold">${lastCtrl.waistCircumference} cm</p>
            </div>
            <div>
              <span class="text-xs text-muted">Total de controles</span>
              <p class="font-semibold">${controls.length}</p>
            </div>
          </div>
        ` : ''}
      </div>
    ` : `
      <div class="card" style="margin-bottom:20px">
        <div class="empty-state">
          <div class="empty-state-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"/>
            </svg>
          </div>
          <h3>Aún no tienes controles registrados</h3>
          <p>Tu nutricionista registrará tu primer control en la próxima consulta.</p>
        </div>
      </div>
    `;

    /* ── Accesos rápidos ───────────────────────────────── */
    const quickLinks = `
      <div class="grid grid-2" style="gap:16px">
        <a href="#/patient/history" class="card card-hover" style="display:flex;align-items:center;gap:16px;padding:20px;text-decoration:none">
          <div class="stat-icon blue">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" width="22" height="22">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"/>
            </svg>
          </div>
          <div>
            <p class="font-semibold" style="color:var(--text-primary)">Mis Controles</p>
            <p class="text-sm text-muted">${controls.length} control${controls.length !== 1 ? 'es' : ''} registrado${controls.length !== 1 ? 's' : ''}</p>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="16" height="16" style="margin-left:auto;color:var(--text-muted)"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/></svg>
        </a>
        <a href="#/patient/profile" class="card card-hover" style="display:flex;align-items:center;gap:16px;padding:20px;text-decoration:none">
          <div class="stat-icon green">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" width="22" height="22">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
            </svg>
          </div>
          <div>
            <p class="font-semibold" style="color:var(--text-primary)">Mi Perfil</p>
            <p class="text-sm text-muted">${age != null ? age + ' años · ' : ''}${Utils.genderLabel(patient.gender)}</p>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="16" height="16" style="margin-left:auto;color:var(--text-muted)"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/></svg>
        </a>
      </div>
    `;

    const content = `
      <!-- Saludo -->
      <div class="page-header">
        <div>
          <h1>¡Hola, ${Utils.escapeHtml(patient.firstName)}! 👋</h1>
          <p style="color:var(--text-secondary);margin-top:4px">
            ${lastCtrl
              ? `Tu último control fue el <strong>${Utils.formatDate(lastCtrl.date)}</strong>.`
              : 'Bienvenido a tu panel de seguimiento nutricional.'
            }
          </p>
        </div>
      </div>

      ${metricCards}
      ${lastCtrlCard}
      ${quickLinks}
    `;

    container.innerHTML = Layout.wrap(session, 'patient/dashboard', content);
    Layout.init();
  },

  init() {},

  _metric(label, value, colorCls, sub) {
    return `
      <div class="stat-card">
        <div class="stat-info">
          <div class="stat-label">${label}</div>
          <div class="stat-value" style="font-size:1.5rem">${Utils.escapeHtml(String(value))}</div>
          ${sub ? `<div class="stat-sub">${Utils.escapeHtml(sub)}</div>` : ''}
        </div>
      </div>`;
  },
};
