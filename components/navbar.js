/* ============================================================
   NutriControl — Barra de navegación superior
   ============================================================ */
const Navbar = {

  _titles: {
    'admin/dashboard':    { label: 'Dashboard',           parent: null },
    'admin/patients':     { label: 'Pacientes',           parent: null },
    'admin-new-patient':  { label: 'Nuevo Paciente',      parent: { label: 'Pacientes', hash: '#/admin/patients' } },
    'admin-patient-detail':{ label: 'Perfil del Paciente', parent: { label: 'Pacientes', hash: '#/admin/patients' } },
    'admin-edit-patient': { label: 'Editar Paciente',     parent: { label: 'Pacientes', hash: '#/admin/patients' } },
    'admin-new-control':  { label: 'Registrar Control',   parent: { label: 'Pacientes', hash: '#/admin/patients' } },
    'admin-edit-control': { label: 'Editar Control',      parent: { label: 'Pacientes', hash: '#/admin/patients' } },
    'admin/admins':       { label: 'Administradores',     parent: null },
    'admin-new-admin':    { label: 'Nuevo Administrador', parent: { label: 'Administradores', hash: '#/admin/admins' } },
    'admin-edit-admin':   { label: 'Editar Administrador',parent: { label: 'Administradores', hash: '#/admin/admins' } },
    'patient/dashboard':  { label: 'Inicio',              parent: null },
    'patient/profile':    { label: 'Mi Perfil',           parent: null },
    'patient/history':    { label: 'Mis Controles',       parent: null },
  },

  render(session, currentPage = '') {
    const info   = this._titles[currentPage] ?? { label: 'NutriControl', parent: null };
    const initials = Utils.initials(session.firstName, session.lastName);
    const roleLabel = Utils.roleLabel(session.role);

    const breadcrumb = info.parent
      ? `<a href="${info.parent.hash}">${Utils.escapeHtml(info.parent.label)}</a>
         <span class="sep">/</span>
         <strong>${Utils.escapeHtml(info.label)}</strong>`
      : `<strong>${Utils.escapeHtml(info.label)}</strong>`;

    return `
      <header class="navbar" id="main-navbar">
        <div class="navbar__left">
          <div class="navbar__breadcrumb">${breadcrumb}</div>
        </div>
        <div class="navbar__right">
          <div class="navbar__user">
            <div class="navbar__user-info">
              <span class="navbar__user-name">${Utils.escapeHtml(session.firstName)} ${Utils.escapeHtml(session.lastName)}</span>
              <span class="navbar__user-role">${Utils.escapeHtml(roleLabel)}</span>
            </div>
            <div class="avatar avatar-sm">${Utils.escapeHtml(initials)}</div>
          </div>
          <button
            id="navbar-logout-btn"
            class="btn btn-ghost btn-sm btn-icon"
            title="Cerrar sesión"
            aria-label="Cerrar sesión"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"/>
            </svg>
          </button>
        </div>
      </header>
    `;
  },

  init() {
    const logoutBtn = document.getElementById('navbar-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        Modal.confirm({
          title: 'Cerrar sesión',
          message: '¿Deseas cerrar tu sesión actual?',
          confirmText: 'Sí, cerrar sesión',
          danger: false,
          onConfirm(modalId) {
            Modal.close(modalId);
            Auth.logout();
          },
        });
      });
    }
  },
};
