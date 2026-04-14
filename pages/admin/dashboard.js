/* ============================================================
   NutriControl — Dashboard del Administrador (async/Supabase)
   ============================================================ */
window.NutriPages = window.NutriPages || {};

window.NutriPages['admin-dashboard'] = {

  async render(container) {
    const session = Auth.getSession();

    /* Loading */
    container.innerHTML = Layout.wrap(session, 'admin/dashboard',
      '<div style="display:flex;align-items:center;justify-content:center;padding:80px 0"><div class="spinner"></div></div>'
    );
    Layout.init();

    /* Fetch data */
    const [stats, controls, patients] = await Promise.all([
      Store.getStats(),
      Store.getControls(),
      Store.getPatients(),
    ]);

    /* Mapa rápido de pacientes */
    const patientsMap = {};
    patients.forEach(p => { patientsMap[p.id] = p; });

    /* Últimos 5 controles */
    const recent = controls.slice(0, 5);
    const recentRows = recent.map(ctrl => {
      const p      = patientsMap[ctrl.patientId];
      const bmiCat = Utils.getBMICategory(ctrl.bmi);
      const name   = p ? `${p.firstName} ${p.lastName}` : 'Desconocido';
      const ini    = p ? Utils.initials(p.firstName, p.lastName) : '?';
      return `
        <tr>
          <td>
            <div class="flex items-center gap-2">
              <div class="avatar avatar-sm">${Utils.escapeHtml(ini)}</div>
              <span class="font-medium">${Utils.escapeHtml(name)}</span>
            </div>
          </td>
          <td>${Utils.formatDate(ctrl.date)}</td>
          <td><strong>${ctrl.weight}</strong> kg</td>
          <td>
            ${ctrl.bmi}
            <span class="badge badge-${bmiCat.cls}" style="margin-left:6px">${bmiCat.label}</span>
          </td>
          <td>${ctrl.fatPercentage ?? '—'}%</td>
          <td>
            ${p
              ? `<a href="#/admin/patients/${p.id}" class="btn btn-ghost btn-sm">Ver paciente</a>`
              : '—'
            }
          </td>
        </tr>`;
    }).join('');

    const emptyControls = `
      <div class="empty-state">
        <div class="empty-state-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"/>
          </svg>
        </div>
        <h3>Sin controles registrados</h3>
        <p>Registra el primer control nutricional para un paciente.</p>
        <a href="#/admin/controls/new" class="btn btn-primary" style="margin-top:8px">Registrar control</a>
      </div>`;

    const content = `
      <!-- Encabezado -->
      <div class="page-header">
        <div>
          <h1>Dashboard</h1>
          <p style="color:var(--text-secondary);margin-top:4px">
            Bienvenido, <strong>${Utils.escapeHtml(session.firstName)}</strong>. Resumen del sistema.
          </p>
        </div>
        <div class="flex gap-2">
          <a href="#/admin/patients/new" class="btn btn-secondary btn-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="15" height="15"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"/></svg>
            Nuevo Paciente
          </a>
          <a href="#/admin/controls/new" class="btn btn-primary btn-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="15" height="15"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            Nuevo Control
          </a>
        </div>
      </div>

      <!-- Tarjetas de estadísticas -->
      <div class="grid grid-3" style="margin-bottom:28px">
        <div class="stat-card">
          <div class="stat-icon green">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" width="22" height="22"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/></svg>
          </div>
          <div class="stat-info">
            <div class="stat-label">Pacientes</div>
            <div class="stat-value">${stats.totalPatients}</div>
            <div class="stat-sub">registrados en el sistema</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon blue">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" width="22" height="22"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"/></svg>
          </div>
          <div class="stat-info">
            <div class="stat-label">Controles</div>
            <div class="stat-value">${stats.totalControls}</div>
            <div class="stat-sub">registrados en total</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon amber">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" width="22" height="22"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/></svg>
          </div>
          <div class="stat-info">
            <div class="stat-label">Administradores</div>
            <div class="stat-value">${stats.totalAdmins}</div>
            <div class="stat-sub">activos en el sistema</div>
          </div>
        </div>
      </div>

      <!-- Últimos controles -->
      <div class="card">
        <div class="card__header">
          <h3 class="card__title">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" width="18" height="18"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            Últimos Controles Registrados
          </h3>
          <a href="#/admin/patients" class="btn btn-ghost btn-sm">Ver todos los pacientes →</a>
        </div>
        ${recent.length > 0 ? `
          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Paciente</th>
                  <th>Fecha</th>
                  <th>Peso</th>
                  <th>IMC</th>
                  <th>% Grasa</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>${recentRows}</tbody>
            </table>
          </div>
        ` : emptyControls}
      </div>
    `;

    container.innerHTML = Layout.wrap(session, 'admin/dashboard', content);
    Layout.init();
  },

  init() {},
};
