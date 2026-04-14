/* ============================================================
   NutriControl — Listado de Pacientes (Admin) (async/Supabase)
   ============================================================ */
window.NutriPages = window.NutriPages || {};

window.NutriPages['admin-patients'] = {

  /* Caché local para búsqueda sin re-fetch */
  _allPatients: [],
  _controlsMap: {},

  async render(container) {
    const session = Auth.getSession();

    /* Loading */
    container.innerHTML = Layout.wrap(session, 'admin/patients',
      '<div style="display:flex;align-items:center;justify-content:center;padding:80px 0"><div class="spinner"></div></div>'
    );
    Layout.init();

    /* Fetch */
    const [patients, controls] = await Promise.all([
      Store.getPatients(),
      Store.getControls(),
    ]);

    this._allPatients = patients;

    /* Mapa: patientId → último control */
    this._controlsMap = {};
    controls.forEach(c => {
      if (!this._controlsMap[c.patientId]) {
        this._controlsMap[c.patientId] = c; // ya ordenados desc por fecha
      }
    });

    const tableHtml = this._buildTable(patients, '');

    const content = `
      <div class="page-header">
        <div>
          <h1>Pacientes</h1>
          <p style="color:var(--text-secondary);margin-top:4px">${patients.length} paciente${patients.length !== 1 ? 's' : ''} registrado${patients.length !== 1 ? 's' : ''}</p>
        </div>
        <div class="flex gap-2 items-center">
          <div class="search-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z"/></svg>
            <input type="text" id="patient-search" placeholder="Buscar paciente…" autocomplete="off">
          </div>
          <a href="#/admin/patients/new" class="btn btn-primary btn-sm" id="btn-new-patient">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="15" height="15"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
            Nuevo Paciente
          </a>
        </div>
      </div>

      <div class="card" style="padding:0">
        <div id="patients-table-container">
          ${tableHtml}
        </div>
      </div>
    `;

    container.innerHTML = Layout.wrap(session, 'admin/patients', content);
    Layout.init();
  },

  init() {
    const searchInput = document.getElementById('patient-search');
    if (!searchInput) return;

    searchInput.addEventListener('input', Utils.debounce(() => {
      const q = searchInput.value.trim().toLowerCase();
      const filtered = this._allPatients.filter(p =>
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(q) ||
        (p.email && p.email.toLowerCase().includes(q))
      );
      const container = document.getElementById('patients-table-container');
      if (container) container.innerHTML = this._buildTable(filtered, q);
      this._bindActions();
    }, 250));

    this._bindActions();
  },

  _buildTable(patients, query) {
    if (patients.length === 0) {
      const msg = query
        ? 'No se encontraron pacientes para esta búsqueda.'
        : 'No hay pacientes registrados aún.';
      return `
        <div class="empty-state">
          <div class="empty-state-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z"/>
            </svg>
          </div>
          <h3>Sin pacientes</h3>
          <p>${msg}</p>
          ${!query ? `<a href="#/admin/patients/new" class="btn btn-primary" style="margin-top:8px">Crear primer paciente</a>` : ''}
        </div>`;
    }

    const rows = patients.map(p => {
      const lastControl = this._controlsMap[p.id] || null;
      const age = p.birthDate ? Utils.calculateAge(p.birthDate) : '—';
      const gender = Utils.genderLabel(p.gender);

      return `
        <tr>
          <td>
            <div class="flex items-center gap-2">
              <div class="avatar avatar-sm">${Utils.escapeHtml(Utils.initials(p.firstName, p.lastName))}</div>
              <div>
                <div class="font-medium">${Utils.escapeHtml(p.firstName)} ${Utils.escapeHtml(p.lastName)}</div>
                <div class="text-xs text-muted">${Utils.escapeHtml(p.email || '')}</div>
              </div>
            </div>
          </td>
          <td>${age !== '—' ? age + ' años' : '—'}</td>
          <td><span class="badge badge-muted">${Utils.escapeHtml(gender)}</span></td>
          <td>
            ${lastControl
              ? `<div>${Utils.formatDate(lastControl.date)}</div><div class="text-xs text-muted">${lastControl.weight} kg · IMC ${lastControl.bmi}</div>`
              : `<span class="badge badge-warning">Sin controles</span>`
            }
          </td>
          <td>
            <div class="table-actions">
              <a href="#/admin/patients/${p.id}" class="btn btn-secondary btn-sm" title="Ver perfil">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="14" height="14"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                Ver
              </a>
              <a href="#/admin/controls/new?patientId=${p.id}" class="btn btn-primary btn-sm" title="Nuevo control">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="14" height="14"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
                Control
              </a>
              <button class="btn btn-danger btn-sm btn-icon btn-delete-patient" data-id="${p.id}" data-name="${Utils.escapeHtml(p.firstName + ' ' + p.lastName)}" title="Eliminar paciente">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="14" height="14"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/></svg>
              </button>
            </div>
          </td>
        </tr>`;
    }).join('');

    return `
      <div class="table-wrapper" style="border:none;border-radius:0">
        <table>
          <thead>
            <tr>
              <th>Paciente</th>
              <th>Edad</th>
              <th>Género</th>
              <th>Último Control</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
  },

  _bindActions() {
    document.querySelectorAll('.btn-delete-patient').forEach(btn => {
      btn.addEventListener('click', () => {
        const { id, name } = btn.dataset;
        Modal.confirm({
          title: 'Eliminar Paciente',
          message: `¿Seguro que deseas eliminar a "${name}"? Se eliminarán también todos sus controles. Esta acción no se puede deshacer.`,
          confirmText: 'Sí, eliminar',
          danger: true,
          async onConfirm(modalId) {
            Modal.close(modalId);
            await Store.deletePatient(id);
            Toast.success('Paciente eliminado', name + ' fue eliminado del sistema.');
            App.navigate('#/admin/patients');
          },
        });
      });
    });
  },
};
