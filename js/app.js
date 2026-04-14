/* ============================================================
   NutriControl - Router principal (SPA hash-based)
   ============================================================ */

const App = {

  _routes: {
    '/login':               { page: 'login',              auth: false,    title: 'Iniciar Sesion' },
    '/register':            { page: 'register',           auth: false,    title: 'Crear Cuenta' },
    '/admin-access':        { page: 'admin-access',       auth: false,    title: 'Acceso Administrativo' },
    '/email-confirmation':  { page: 'email-confirmation', auth: false,    title: 'Confirmar Correo' },
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

  _dynamicRoutes: [
    { pattern: /^\/admin\/patients\/([^/]+)\/edit$/, page: 'admin-edit-patient', role: 'admin', param: 'id', title: 'Editar Paciente' },
    { pattern: /^\/admin\/patients\/([^/]+)$/, page: 'admin-patient-detail', role: 'admin', param: 'id', title: 'Perfil del Paciente' },
    { pattern: /^\/admin\/controls\/([^/]+)\/edit$/, page: 'admin-edit-control', role: 'admin', param: 'id', title: 'Editar Control' },
    { pattern: /^\/admin\/admins\/([^/]+)\/edit$/, page: 'admin-edit-admin', role: 'admin', param: 'id', title: 'Editar Administrador' },
    { pattern: /^\/admin\/admins\/([^/]+)$/, page: 'admin-admin-detail', role: 'admin', param: 'id', title: 'Administrador' },
  ],

  _currentPath: null,

  async init() {
    Auth.initListener();
    await Store.init();
    window.addEventListener('hashchange', () => this._handleRoute());
    await this._handleRoute();
  },

  async _handleRoute() {
    const hash = window.location.hash || '#/login';

    if (hash.includes('access_token=') || hash.includes('type=recovery')) {
      return;
    }

    const rawPath = hash.slice(1);
    const [pathOnly, queryString = ''] = rawPath.split('?');
    const path = pathOnly || '/login';

    let config = this._routes[path];
    let params = { query: this._parseQuery(queryString) };

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

    if (!config) {
      const session = Auth.getSession();
      if (!session) {
        window.location.hash = '#/login';
        return;
      }
      window.location.hash = session.role === 'admin' ? '#/admin/dashboard' : '#/patient/dashboard';
      return;
    }

    if (config.auth === false) {
      const session = Auth.getSession();
      if (session) {
        window.location.hash = session.role === 'admin' ? '#/admin/dashboard' : '#/patient/dashboard';
        return;
      }
    }

    if (config.role && !Auth.requireAuth(config.role)) {
      return;
    }

    if (config.title) {
      document.title = `${config.title} - NutriControl`;
    }

    this._currentPath = path;
    await this._renderPage(config.page, params);
  },

  async _renderPage(pageName, params = {}) {
    const appEl = document.getElementById('app');
    const session = Auth.getSession();
    const pages = window.NutriPages ?? {};

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
              <h2>Proximamente</h2>
              <p>Esta seccion esta en construccion. Vuelve pronto.</p>
              <a href="${dashHash}" class="btn btn-primary" style="margin-top:8px">Ir al inicio</a>
            </div>
          </main>
        </div>
      </div>
    `;

    Sidebar.init();
    Navbar.init();
  },

  navigate(hash) {
    const newPath = (hash.startsWith('#') ? hash.slice(1) : hash).split('?')[0];
    if (this._currentPath === newPath) {
      this._handleRoute();
    } else {
      window.location.hash = hash;
    }
  },

  _parseQuery(queryString = '') {
    const params = {};
    const searchParams = new URLSearchParams(queryString);
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  },
};

App.init();
