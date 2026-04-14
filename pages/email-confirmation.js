/* ============================================================
   NutriControl - Confirmacion de Correo
   ============================================================ */
window.NutriPages = window.NutriPages || {};

window.NutriPages['email-confirmation'] = {
  render(container, params = {}) {
    const email = params.query?.email ? decodeURIComponent(params.query.email) : '';
    const mode = params.query?.mode === 'admin' ? 'admin' : 'patient';
    const loginHref = mode === 'admin'
      ? (email ? `#/admin-access?email=${encodeURIComponent(email)}` : '#/admin-access')
      : (email ? `#/login?email=${encodeURIComponent(email)}` : '#/login');

    container.innerHTML = `
      <div class="login-page">
        <div class="login-bg">
          <div class="blob blob-1"></div>
          <div class="blob blob-2"></div>
          <div class="blob blob-3"></div>
        </div>

        <div class="login-content login-content--centered">
          <div class="glass-card login-card confirmation-card">
            <div class="login-card__header">
              <div class="confirmation-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="white">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"/>
                </svg>
              </div>
              <h2>Confirma tu correo</h2>
              <p>Te enviamos un enlace de verificacion para activar tu cuenta.</p>
            </div>

            <div class="confirmation-copy">
              <p>Revisa tu bandeja de entrada y tambien la carpeta de spam.</p>
              ${email ? `<p class="confirmation-email">${Utils.escapeHtml(email)}</p>` : ''}
              <p>Cuando abras el enlace, volveras a NutriControl y podras ${mode === 'admin' ? 'entrar al acceso administrativo' : 'iniciar sesion'}.</p>
            </div>

            <div class="confirmation-actions">
              <a href="${loginHref}" class="btn btn-primary btn-full">${mode === 'admin' ? 'Ir al acceso admin' : 'Ir al login'}</a>
              <a href="${mode === 'admin' ? '#/admin-access?tab=register' : '#/register'}" class="btn btn-outline btn-full">Volver al registro</a>
            </div>
          </div>
        </div>
      </div>
    `;
  },
};
