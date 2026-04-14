/* ============================================================
   NutriControl — Detalle / Historial de Paciente (Admin)
   ============================================================ */
window.NutriPages = window.NutriPages || {};

window.NutriPages['admin-patient-detail'] = {

  async render(container, params) {
    const session = Auth.getSession();
    const patient = await Store.getPatientById(params.id);

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

    const controls  = await Store.getControlsByPatient(patient.id);
    const age       = patient.birthDate ? Utils.calculateAge(patient.birthDate) : null;
    const lastCtrl  = controls[0] ?? null;

    /* Tarjetas resumen del último control */
    const summaryCards = lastCtrl ? `
      <div class="grid grid-4" style="margin-bottom:28px">
        ${this._metricCard('Peso actual', lastCtrl.weight + ' kg', 'blue')}
        ${this._metricCard('IMC', lastCtrl.bmi, 'green', Utils.getBMICategory(lastCtrl.bmi).label)}
        ${this._metricCard('% Grasa', (lastCtrl.fatPercentage ?? '—') + (lastCtrl.fatPercentage ? '%' : ''), 'amber')}
        ${this._metricCard('Masa Muscular', (lastCtrl.muscleMass ?? '—') + (lastCtrl.muscleMass ? ' kg' : ''), 'info')}
      </div>` : '';

    /* Tabla de controles */
    const controlRows = controls.map(ctrl => {
      const bmiCat = Utils.getBMICategory(ctrl.bmi);
      return `
        <tr>
          <td>${Utils.formatDate(ctrl.date)}</td>
          <td><strong>${ctrl.weight}</strong> kg</td>
          <td>${ctrl.height} cm</td>
          <td>
            ${ctrl.bmi}
            <span class="badge badge-${bmiCat.cls}" style="margin-left:6px">${bmiCat.label}</span>
          </td>
          <td>${ctrl.fatPercentage ?? '—'}${ctrl.fatPercentage ? '%' : ''}</td>
          <td>${ctrl.muscleMass ?? '—'}${ctrl.muscleMass ? ' kg' : ''}</td>
          <td>${ctrl.waistCircumference ?? '—'}${ctrl.waistCircumference ? ' cm' : ''}</td>
          <td>
            <div class="table-actions">
              <button class="btn btn-ghost btn-sm btn-view-control" data-id="${ctrl.id}" title="Ver detalle">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="14" height="14"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                Ver
              </button>
              <a href="#/admin/controls/${ctrl.id}/edit" class="btn btn-secondary btn-sm" title="Editar control">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="14" height="14"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"/></svg>
                Editar
              </a>
              <button class="btn btn-danger btn-sm btn-icon btn-delete-control" data-id="${ctrl.id}" data-date="${Utils.formatDate(ctrl.date)}" data-patient-id="${ctrl.patientId}" title="Eliminar control">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="14" height="14"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/></svg>
              </button>
            </div>
          </td>
        </tr>`;
    }).join('');

    const content = `
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <a href="#/admin/patients">Pacientes</a>
        <span class="sep">/</span>
        <span>${Utils.escapeHtml(patient.firstName)} ${Utils.escapeHtml(patient.lastName)}</span>
      </nav>

      <!-- Cabecera -->
      <div class="page-header">
        <div class="flex items-center gap-3">
          <div class="avatar avatar-xl">${Utils.escapeHtml(Utils.initials(patient.firstName, patient.lastName))}</div>
          <div>
            <h1>${Utils.escapeHtml(patient.firstName)} ${Utils.escapeHtml(patient.lastName)}</h1>
            <p style="color:var(--text-secondary);margin-top:2px">${Utils.escapeHtml(patient.email)}</p>
          </div>
        </div>
        <div class="flex gap-2">
          <a href="#/admin/patients/${patient.id}/edit" class="btn btn-secondary btn-sm" id="btn-edit-patient">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="15" height="15"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"/></svg>
            Editar
          </a>
          <a href="#/admin/controls/new?patientId=${patient.id}" class="btn btn-primary btn-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="15" height="15"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
            Nuevo Control
          </a>
        </div>
      </div>

      <!-- Info personal -->
      <div class="card" style="margin-bottom:20px">
        <div class="card__header">
          <h3 class="card__title">Información Personal</h3>
        </div>
        <div class="grid grid-3" style="gap:20px">
          ${this._infoField('Teléfono', patient.phone || '—')}
          ${this._infoField('Fecha de Nacimiento', Utils.formatDate(patient.birthDate))}
          ${this._infoField('Edad', age !== null ? age + ' años' : '—')}
          ${this._infoField('Género', Utils.genderLabel(patient.gender))}
          ${this._infoField('Registrado', Utils.formatDate(patient.createdAt))}
          ${this._infoField('Total Controles', controls.length)}
          <div class="form-group" style="grid-column: 1 / -1">
            <label>Objetivo Nutricional</label>
            <p style="color:var(--text-primary);margin-top:4px">${Utils.escapeHtml(patient.objective || '—')}</p>
          </div>
        </div>
      </div>

      <!-- Último control resumen -->
      ${summaryCards}

      <!-- Historial de controles -->
      <div class="card">
        <div class="card__header">
          <h3 class="card__title">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" width="18" height="18"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"/></svg>
            Historial de Controles
          </h3>
          <span class="badge badge-muted">${controls.length} control${controls.length !== 1 ? 'es' : ''}</span>
        </div>
        ${controls.length > 0 ? `
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
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>${controlRows}</tbody>
            </table>
          </div>
        ` : `
          <div class="empty-state">
            <div class="empty-state-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"/>
              </svg>
            </div>
            <h3>Sin controles</h3>
            <p>Este paciente no tiene controles nutricionales registrados aún.</p>
            <a href="#/admin/controls/new?patientId=${patient.id}" class="btn btn-primary" style="margin-top:8px">Registrar primer control</a>
          </div>
        `}
      </div>
    `;

    container.innerHTML = Layout.wrap(session, 'admin-patient-detail', content);
    Layout.init();
  },

  init(params) {
    /* Botones de detalle de control → abrir modal */
    document.querySelectorAll('.btn-view-control').forEach(btn => {
      btn.addEventListener('click', () => {
        const ctrl = Store.getControlById(btn.dataset.id);
        if (!ctrl) return;
        const bmiCat = Utils.getBMICategory(ctrl.bmi);
        Modal.open({
          title: `Control del ${Utils.formatDate(ctrl.date)}`,
          size: 'lg',
          hideFooter: true,
          body: `
            <div class="grid grid-2" style="gap:16px;margin-bottom:20px">
              ${this._modalField('Peso', ctrl.weight + ' kg')}
              ${this._modalField('Talla', ctrl.height + ' cm')}
              ${this._modalField('IMC', `${ctrl.bmi} — ${bmiCat.label}`)}
              ${this._modalField('% Grasa Corporal', ctrl.fatPercentage ? ctrl.fatPercentage + '%' : '—')}
              ${this._modalField('Masa Muscular', ctrl.muscleMass ? ctrl.muscleMass + ' kg' : '—')}
              ${this._modalField('Circunferencia Cintura', ctrl.waistCircumference ? ctrl.waistCircumference + ' cm' : '—')}
            </div>
            ${ctrl.notes ? `
              <div style="margin-bottom:16px">
                <p class="text-sm font-semibold text-muted" style="margin-bottom:6px;text-transform:uppercase;letter-spacing:.5px">Notas Clínicas</p>
                <p style="color:var(--text-primary);line-height:1.7">${Utils.escapeHtml(ctrl.notes)}</p>
              </div>` : ''}
            ${ctrl.dietPlan ? `
              <div>
                <p class="text-sm font-semibold text-muted" style="margin-bottom:6px;text-transform:uppercase;letter-spacing:.5px">Plan Dietético</p>
                <p style="color:var(--text-primary);line-height:1.7">${Utils.escapeHtml(ctrl.dietPlan)}</p>
              </div>` : ''}
          `,
        });
      });
    });

    /* Botones de eliminar control → confirmar y borrar */
    document.querySelectorAll('.btn-delete-control').forEach(btn => {
      btn.addEventListener('click', () => {
        const { id, date, patientId } = btn.dataset;
        Modal.confirm({
          title: 'Eliminar Control',
          message: `¿Seguro que deseas eliminar el control del ${date}? Esta acción no se puede deshacer.`,
          confirmText: 'Sí, eliminar',
          danger: true,
          async onConfirm(modalId) {
            Modal.close(modalId);
            await Store.deleteControl(id);
            Toast.success('Control eliminado', `El control del ${date} fue eliminado.`);
            App.navigate(`#/admin/patients/${patientId}`);
          },
        });
      });
    });
  },

  _metricCard(label, value, color, sub = '') {
    return `
      <div class="stat-card">
        <div class="stat-info">
          <div class="stat-label">${label}</div>
          <div class="stat-value" style="font-size:1.5rem">${value}</div>
          ${sub ? `<div class="stat-sub">${sub}</div>` : ''}
        </div>
      </div>`;
  },

  _infoField(label, value) {
    return `
      <div class="form-group">
        <label>${label}</label>
        <p style="color:var(--text-primary);margin-top:4px">${Utils.escapeHtml(String(value))}</p>
      </div>`;
  },

  _modalField(label, value) {
    return `
      <div>
        <p class="text-xs font-semibold text-muted" style="text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px">${label}</p>
        <p style="font-size:1rem;font-weight:600">${Utils.escapeHtml(String(value))}</p>
      </div>`;
  },
};
