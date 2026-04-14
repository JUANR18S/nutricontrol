/* ============================================================
   NutriControl — Router principal (SPA hash-based)
   Versión async para Supabase
   ============================================================ */

const App = {

  /* Rutas estáticas */
  _routes: {
    '/login':               { page: 'login',              auth: false,    title: 'Iniciar Sesión' },
    '/register':            { page: 'register',           auth: false,    title: 'Crear Cuenta' },
    '/admin/dashboard':     { page: 'admin-dashboard',    role: 'admin',  title: 'Dashboard' },
    '/admin/patients':      { page: 'admin-patients',     role: 'admin',  title: 'Pacientes' },
    '/admin/patients/new':  { page: 'admin-new-patient',  role: 'admin',  title: 'Nuevo Paciente' },
    '/admin/controls/new':  { page: 'admin-new-control',  role: 'admin',  title: 'Nuevo Control' },
    '/admin/admins':        { page: 'admin-admins',       role: 'admin',  title: 'Administradores' },
    '/admin/admins/new':    { page: 'admin-new-admin',    role: 'admin',  title: 'Nuevo Administrador' },
    '/admin/logs':          { page: 'admin-logs',         role: 'admin',  title: 'Logs de Actividad' },
    '/patient/dashboard':   { page: 'patient-dashboard',  role: 'patient',title: 'Inicio' },
    '/patient/profile':     { page: 'patient-profile',    role: 'patient',title: 'Mi Perfil' },
    '/patient/history':     { page: 'patient-history',    role: 'patient',title: 'Mis Controles' },
  },

  /* Rutas dinámicas (con parámetros) */
  _dynamicRoutes: [
    { pattern: /^\/admin\/patients\/([^/]+)\/edit$/, page: 'admin-edit-patient',   role: 'admin', param: 'id', title: 'Editar Paciente' },
    { pattern: /^\/admin\/patients\/([^/]+)$/,      page: 'admin-patient-detail', role: 'admin', param: 'id', title: 'Perfil del Paciente' },
    { pattern: /^\/admin\/controls\/([^/]+)\/edit$/, page: 'admin-edit-control',  role: 'admin', param: 'id', title: 'Editar Control' },
    { pattern: /^\/admin\/admins\/([^/]+)\/edit$/,  page: 'admin-edit-admin',     role: 'admin', param: 'id', title: 'Editar Administrador' },
    { pattern: /^\/admin\/admins\/([^/]+)$/,        page: 'admin-admin-detail',   role: 'admin', param: 'id', title: 'Administrador' },
  ],

  /* Ruta actual para detectar misma ruta */
  _currentPath: null,

  /* ─────────────────────────────────────────────────────── */
  async init() {
    await Store.init();
    window.addEventListener('hashchange', () => this._handleRoute());
    await this._handleRoute();
  },

  /* ─────────────────────────────────────────────────────── */
  async _handleRoute() {
    const hash = window.location.hash || '#/login';
    const path = hash.slice(1);

    let config = this._routes[path];
    let params = {};

    /* Intentar rutas dinámicas */
    if (!config) {
      for (const dr of this._dynamicRoutes) {
        const match = path.match(dr.pattern);
        if (match) {
          config = dr;
          params[dr.param] = match[1];
          break;
        }
      }
    }

    /* Si no existe la ruta → redirigir */
    if (!config) {
      const session = Auth.getSession();
      if (!session) { window.location.hash = '#/login'; return; }
      window.location.hash = session.role === 'admin' ? '#/admin/dashboard' : '#/patient/dashboard';
      return;
    }

    /* Guard: ruta pública (login) con sesión activa */
    if (config.auth === false) {
      const session = Auth.getSession();
      if (session) {
        window.location.hash = session.role === 'admin' ? '#/admin/dashboard' : '#/patient/dashboard';
        return;
      }
    }

    /* Guard: ruta protegida */
    if (config.role) {
      if (!Auth.requireAuth(config.role)) return;
    }

    /* Actualizar título de pestaña */
    if (config.title) {
      document.title = `${config.title} — NutriControl`;
    }

    this._currentPath = path;
    await this._renderPage(config.page, params);
  },

  /* ─────────────────────────────────────────────────────── */
  async _renderPage(pageName, params = {}) {
    const appEl   = document.getElementById('app');
    const session = Auth.getSession();
    const pages   = window.NutriPages ?? {};

    if (pages[pageName]) {
      appEl.innerHTML = '';
      await pages[pageName].render(appEl, params);
      if (typeof pages[pageName].init === 'function') {
        pages[pageName].init(params);
      }
    } else {
      this._renderPlaceholder(appEl, session);
    }
  },

  /* ─────────────────────────────────────────────────────── */
  _renderPlaceholder(appEl, session) {
    const dashHash = session?.role === 'admin' ? '#/admin/dashboard' : '#/patient/dashboard';

    appEl.innerHTML = `
      <div class="layout">
        ${Sidebar.render(session)}
        <div class="main-area">
          ${Navbar.render(session)}
          <main class="page-content">
            <div class="placeholder-page animate-up">
              <div class="placeholder-icon">🚧</div>
              <h2>Próximamente</h2>
              <p>Esta sección está en construcción. Vuelve pronto.</p>
              <a href="${dashHash}" class="btn btn-primary" style="margin-top:8px">Ir al inicio</a>
            </div>
          </main>
        </div>
      </div>
    `;

    Sidebar.init();
    Navbar.init();
  },

  /**
   * Navega a un hash. Si es la misma ruta actual,
   * fuerza el re-render directamente (hashchange no dispara en mismo hash).
   */
  navigate(hash) {
    const newPath = hash.startsWith('#') ? hash.slice(1) : hash;
    if (this._currentPath === newPath) {
      /* Misma ruta: forzar re-render sin doble salto */
      this._handleRoute();
    } else {
      window.location.hash = hash;
    }
  },
};

/* ── Arrancar la aplicación ──────────────────────────────── */
App.init();
