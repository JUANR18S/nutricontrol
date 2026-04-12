/* ============================================================
   NutriControl — Sidebar de navegación lateral
   ============================================================ */
const Sidebar = {

  _adminItems: [
    {
      hash: '#/admin/dashboard',
      label: 'Dashboard',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"/></svg>`,
    },
    {
      hash: '#/admin/patients',
      label: 'Pacientes',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/></svg>`,
    },
    {
      hash: '#/admin/controls/new',
      label: 'Nuevo Control',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
    },
    {
      hash: '#/admin/admins',
      label: 'Administradores',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/></svg>`,
    },
  ],

  _patientItems: [
    {
      hash: '#/patient/dashboard',
      label: 'Inicio',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/></svg>`,
    },
    {
      hash: '#/patient/profile',
      label: 'Mi Perfil',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/></svg>`,
    },
    {
      hash: '#/patient/history',
      label: 'Mis Controles',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"/></svg>`,
    },
  ],

  render(session) {
    const items      = session.role === 'admin' ? this._adminItems : this._patientItems;
    const currentHash = window.location.hash;
    const initials   = Utils.initials(session.firstName, session.lastName);

    const navItems = items.map(item => `
      <a href="${item.hash}"
         class="sidebar__item ${currentHash === item.hash ? 'active' : ''}"
         id="sidebar-item-${item.hash.replace(/[^a-z0-9]/gi, '-')}">
        <span class="sidebar__icon">${item.icon}</span>
        <span class="sidebar__label">${Utils.escapeHtml(item.label)}</span>
      </a>
    `).join('');

    return `
      <aside class="sidebar" id="main-sidebar" aria-label="Navegación principal">
        <div class="sidebar__brand">
          <div class="sidebar__logo">NC</div>
          <span class="sidebar__brand-name">NutriControl</span>
        </div>

        <nav class="sidebar__nav" aria-label="Menú">
          ${navItems}
        </nav>

        <div class="sidebar__footer">
          <div class="sidebar__user">
            <div class="avatar avatar-sm">${Utils.escapeHtml(initials)}</div>
            <div class="sidebar__user-info">
              <span class="sidebar__user-name">${Utils.escapeHtml(session.firstName)}</span>
              <span class="sidebar__user-role">${Utils.escapeHtml(Utils.roleLabel(session.role))}</span>
            </div>
          </div>
          <button
            class="sidebar__logout"
            id="sidebar-logout-btn"
            title="Cerrar sesión"
            aria-label="Cerrar sesión"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="16" height="16">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"/>
            </svg>
          </button>
        </div>
      </aside>

      <!-- Mobile toggle -->
      <button class="sidebar-toggle" id="sidebar-toggle" aria-label="Abrir menú" aria-expanded="false">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="20" height="20">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
        </svg>
      </button>

      <div class="sidebar-overlay" id="sidebar-overlay"></div>
    `;
  },

  init() {
    const sidebar = document.getElementById('main-sidebar');
    const toggle  = document.getElementById('sidebar-toggle');
    const overlay = document.getElementById('sidebar-overlay');

    /* Toggle móvil */
    if (toggle && sidebar && overlay) {
      toggle.addEventListener('click', () => {
        const isOpen = sidebar.classList.toggle('open');
        overlay.classList.toggle('show', isOpen);
        toggle.setAttribute('aria-expanded', isOpen);
      });

      overlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('show');
        toggle.setAttribute('aria-expanded', 'false');
      });
    }

    /* Logout desde sidebar */
    const logoutBtn = document.getElementById('sidebar-logout-btn');
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

    /* Actualizar ítem activo en hashchange */
    window.addEventListener('hashchange', () => {
      const current = window.location.hash;
      document.querySelectorAll('.sidebar__item').forEach(el => {
        el.classList.toggle('active', el.getAttribute('href') === current);
      });
    });
  },
};
