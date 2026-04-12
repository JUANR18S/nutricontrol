/* ============================================================
   NutriControl — Layout envolvente para páginas autenticadas
   ============================================================ */
const Layout = {

  /**
   * Genera el HTML completo de una página con sidebar, navbar y contenido.
   * @param {object} session   - Sesión activa del usuario
   * @param {string} navKey    - Clave para el breadcrumb en Navbar._titles
   * @param {string} content   - HTML del contenido de la página
   */
  wrap(session, navKey, content) {
    return `
      <div class="layout">
        ${Sidebar.render(session)}
        <div class="main-area">
          ${Navbar.render(session, navKey)}
          <main class="page-content animate-up">
            ${content}
          </main>
        </div>
      </div>
    `;
  },

  /** Inicializa sidebar y navbar (llamar después de inyectar el HTML) */
  init() {
    Sidebar.init();
    Navbar.init();
  },
};
