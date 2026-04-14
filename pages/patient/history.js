/* ============================================================
   NutriControl — Mis Controles (Paciente)
   ============================================================ */
window.NutriPages = window.NutriPages || {};

window.NutriPages['patient-history'] = {

  async render(container) {
    const session = Auth.getSession();
    const patient = await Store.getPatientByUserId(session.userId);

    if (!patient) {
      container.innerHTML = Layout.wrap(session, 'patient/history', `
        <div class="placeholder-page animate-up">
          <div class="placeholder-icon">⚠️</div>
          <h2>Perfil no encontrado</h2>
          <p>Contacta a tu nutricionista para configurar tu cuenta.</p>
        </div>
      `);
      Layout.init();
      return;
    }

    const controls = await Store.getControlsByPatient(patient.id);

    const tableRows = controls.map((ctrl, idx) => {
      const bmiCat   = Utils.getBMICategory(ctrl.bmi);
      const isLatest = idx === 0;
      return `
        <tr>
          <td>
            <div style="display:flex;align-items:center;gap:8px">
              <span>${Utils.formatDate(ctrl.date)}</span>
              ${isLatest ? `<span class="badge badge-success">Último</span>` : ''}
            </div>
          </td>
          <td><strong>${ctrl.weight}</strong> kg</td>
          <td>${ctrl.height} cm</td>
          <td>
            ${ctrl.bmi}
            <span class="badge badge-${bmiCat.cls}" style="margin-left:6px">${bmiCat.label}</span>
          </td>
          <td>${ctrl.fatPercentage != null ? ctrl.fatPercentage + '%' : '—'}</td>
          <td>${ctrl.muscleMass != null ? ctrl.muscleMass + ' kg' : '—'}</td>
          <td>${ctrl.waistCircumference != null ? ctrl.waistCircumference + ' cm' : '—'}</td>
          <td>
            <button class="btn btn-secondary btn-sm btn-view-ctrl" data-id="${ctrl.id}">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="14" height="14"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              Ver detalle
            </button>
          </td>
        </tr>`;
    }).join('');

    const tableHtml = controls.length > 0 ? `
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Peso</th>
              <th>Talla</th>
              <th>IMC</th>
              <th>% Grasa</th>
              <th>M. Muscular</th>
              <th>Cintura</th>
              <th>Detalle</th>
            </tr>
          </thead>
          <tbody>${tableRows}</tbody>
        </table>
      </div>
    ` : `
      <div class="empty-state">
        <div class="empty-state-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"/>
          </svg>
        </div>
        <h3>Sin controles registrados</h3>
        <p>Tu nutricionista registrará tu primer control en la próxima consulta. ¡Estás en buenas manos!</p>
      </div>
    `;

    /* ── Resumen de evolución (si hay ≥ 2 controles) ─── */
    const evolutionBanner = controls.length >= 2 ? (() => {
      const last  = controls[0];
      const prev  = controls[1];
      const diff  = Math.round((last.weight - prev.weight) * 10) / 10;
      const arrow = diff < 0 ? '↓' : diff > 0 ? '↑' : '→';
      const cls   = diff < 0 ? 'success' : diff > 0 ? 'danger' : 'info';
      const msg   = diff < 0
        ? `Bajaste ${Math.abs(diff)} kg desde tu control anterior. ¡Buen trabajo!`
        : diff > 0
        ? `Subiste ${diff} kg desde tu control anterior.`
        : 'Tu peso se mantuvo estable respecto al control anterior.';
      return `
        <div class="alert alert-${cls}" style="margin-bottom:20px">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"/></svg>
          <span><strong>${arrow} ${msg}</strong></span>
        </div>`;
    })() : '';

    const content = `
      <div class="page-header">
        <div>
          <h1>Mis Controles</h1>
          <p style="color:var(--text-secondary);margin-top:4px">
            ${controls.length} control${controls.length !== 1 ? 'es' : ''} registrado${controls.length !== 1 ? 's' : ''} en total
          </p>
        </div>
      </div>

      ${evolutionBanner}

      <div class="card" style="padding:0">
        ${tableHtml}
      </div>
    `;

    container.innerHTML = Layout.wrap(session, 'patient/history', content);
    Layout.init();
  },

  init() {
    document.querySelectorAll('.btn-view-ctrl').forEach(btn => {
      btn.addEventListener('click', async () => {
        const ctrl   = await Store.getControlById(btn.dataset.id);
        if (!ctrl) return;
        const bmiCat = Utils.getBMICategory(ctrl.bmi);

        Modal.open({
          title:       `Control del ${Utils.formatDate(ctrl.date)}`,
          size:        'lg',
          hideFooter:  true,
          body: `
            <div class="grid grid-2" style="gap:16px;margin-bottom:20px">
              ${this._mf('Peso', ctrl.weight + ' kg')}
              ${this._mf('Talla', ctrl.height + ' cm')}
              ${this._mf('IMC', `${ctrl.bmi} — ${bmiCat.label}`)}
              ${this._mf('% Grasa Corporal', ctrl.fatPercentage != null ? ctrl.fatPercentage + '%' : '—')}
              ${this._mf('Masa Muscular', ctrl.muscleMass != null ? ctrl.muscleMass + ' kg' : '—')}
              ${this._mf('Circunferencia de Cintura', ctrl.waistCircumference != null ? ctrl.waistCircumference + ' cm' : '—')}
            </div>

            ${ctrl.notes ? `
              <div style="margin-bottom:16px;padding:16px;background:var(--bg-input);border-radius:var(--radius);border:1px solid var(--border)">
                <p class="text-xs font-semibold text-muted" style="text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">Notas del Nutricionista</p>
                <p style="color:var(--text-primary);line-height:1.7">${Utils.escapeHtml(ctrl.notes)}</p>
              </div>` : ''}

            ${ctrl.dietPlan ? `
              <div style="padding:16px;background:var(--primary-muted);border-radius:var(--radius);border:1px solid rgba(16,185,129,.15)">
                <p class="text-xs font-semibold" style="color:var(--primary);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">Tu Plan Dietético</p>
                <p style="color:var(--text-primary);line-height:1.7">${Utils.escapeHtml(ctrl.dietPlan)}</p>
              </div>` : ''}
          `,
        });
      });
    });
  },

  _mf(label, value) {
    return `
      <div>
        <p class="text-xs font-semibold text-muted" style="text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px">${label}</p>
        <p style="font-size:1rem;font-weight:600">${Utils.escapeHtml(String(value))}</p>
      </div>`;
  },
};
