/* ============================================================
   NutriControl — Listado de Administradores (Admin)
   ============================================================ */
window.NutriPages = window.NutriPages || {};

window.NutriPages['admin-admins'] = {

  async render(container) {
    const session = Auth.getSession();
    const admins  = await Store.getAdmins();

    const rows = admins.map(admin => {
      const isMe = admin.id === session.userId;
      return `
        <tr>
          <td>
            <div class="flex items-center gap-2">
              <div class="avatar avatar-sm">${Utils.escapeHtml(Utils.initials(admin.firstName, admin.lastName))}</div>
              <div>
                <div class="font-medium">
                  ${Utils.escapeHtml(admin.firstName)} ${Utils.escapeHtml(admin.lastName)}
                  ${isMe ? `<span class="badge badge-success" style="margin-left:6px">Tú</span>` : ''}
                </div>
                <div class="text-xs text-muted">${Utils.escapeHtml(admin.email)}</div>
              </div>
            </div>
          </td>
          <td>${Utils.formatDate(admin.createdAt)}</td>
          <td>
            <div class="table-actions">
              <a href="#/admin/admins/${admin.id}/edit" class="btn btn-secondary btn-sm" title="Editar">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="14" height="14"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"/></svg>
                Editar
              </a>
              ${!isMe ? `
                <button class="btn btn-danger btn-sm btn-icon btn-delete-admin"
                  data-id="${admin.id}" data-name="${Utils.escapeHtml(admin.firstName + ' ' + admin.lastName)}" title="Eliminar">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="14" height="14"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/></svg>
                </button>
              ` : `
                <span class="btn btn-ghost btn-sm" style="opacity:.35;cursor:not-allowed" title="No puedes eliminarte a ti mismo">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="14" height="14"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/></svg>
                </span>
              `}
            </div>
          </td>
        </tr>`;
    }).join('');

    const content = `
      <div class="page-header">
        <div>
          <h1>Administradores</h1>
          <p style="color:var(--text-secondary);margin-top:4px">${admins.length} administrador${admins.length !== 1 ? 'es' : ''} registrado${admins.length !== 1 ? 's' : ''}</p>
        </div>
        <a href="#/admin/admins/new" class="btn btn-primary btn-sm" id="btn-new-admin">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="15" height="15"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
          Nuevo Administrador
        </a>
      </div>

      <div class="card" style="padding:0">
        ${admins.length > 0 ? `
          <div class="table-wrapper" style="border:none;border-radius:0">
            <table>
              <thead>
                <tr>
                  <th>Administrador</th>
                  <th>Registrado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
        ` : `
          <div class="empty-state">
            <div class="empty-state-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/>
              </svg>
            </div>
            <h3>Sin administradores</h3>
            <p>Agrega el primer administrador al sistema.</p>
          </div>
        `}
      </div>
    `;

    container.innerHTML = Layout.wrap(session, 'admin/admins', content);
    Layout.init();
  },

  init() {
    document.querySelectorAll('.btn-delete-admin').forEach(btn => {
      btn.addEventListener('click', () => {
        const { id, name } = btn.dataset;
        Modal.confirm({
          title: 'Eliminar Administrador',
          message: `¿Deseas eliminar al administrador "${name}"? Esta acción no se puede deshacer.`,
          confirmText: 'Sí, eliminar',
          danger: true,
          async onConfirm(modalId) {
            Modal.close(modalId);
            await Store.deleteUser(id);
            Toast.success('Administrador eliminado', name + ' fue eliminado del sistema.');
            App.navigate('#/admin/admins');
          },
        });
      });
    });
  },
};
