/* ============================================================
   NutriControl — Página de Logs de Actividad (Admin)
   ============================================================ */
window.NutriPages = window.NutriPages || {};

window.NutriPages['admin-logs'] = {

  async render(container) {
    const session = Auth.getSession();

    /* Obtener logs desde Supabase */
    let logs = [];
    try {
      const { data, error } = await sb
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);
      if (!error && data) logs = data;
    } catch (e) {
      Logger.error('Error cargando logs:', e);
    }

    const logsRows = logs.length === 0
      ? `<tr><td colspan="6" class="text-center" style="padding:40px;color:var(--text-secondary)">No hay registros de actividad aún</td></tr>`
      : logs.map(l => {
          const levelCls =
            l.level === 'error' ? 'danger' :
            l.level === 'warn'  ? 'warning' : 'info';
          const levelLabel =
            l.level === 'error' ? 'Error' :
            l.level === 'warn'  ? 'Alerta' : 'Info';

          return `
            <tr>
              <td><span class="badge badge-${levelCls}">${Utils.escapeHtml(levelLabel)}</span></td>
              <td><code style="font-size:.8rem;color:var(--accent)">${Utils.escapeHtml(l.action)}</code></td>
              <td>${Utils.escapeHtml(l.detail || '—')}</td>
              <td>${Utils.escapeHtml(l.user_email || '—')}</td>
              <td style="white-space:nowrap">${Utils.formatDateTime(l.created_at)}</td>
              <td style="max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:.75rem;color:var(--text-secondary)" title="${Utils.escapeHtml(l.user_agent || '')}">${Utils.escapeHtml((l.user_agent || '—').substring(0, 40))}…</td>
            </tr>`;
        }).join('');

    container.innerHTML = `
      <div class="layout">
        ${Sidebar.render(session)}
        <div class="main-area">
          ${Navbar.render(session)}
          <main class="page-content">
            <div class="page-header animate-up">
              <div>
                <h1 class="page-title">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" width="28" height="28" style="vertical-align:middle;margin-right:8px;color:var(--accent)">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/>
                  </svg>
                  Logs de Actividad
                </h1>
                <p class="page-subtitle">Registro de todas las acciones realizadas en el sistema</p>
              </div>
              <div style="display:flex;gap:8px">
                <button class="btn btn-outline" id="logs-refresh-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182"/></svg>
                  Actualizar
                </button>
              </div>
            </div>

            <!-- Filtros rápidos -->
            <div class="glass-card animate-up" style="animation-delay:.05s;padding:16px;margin-bottom:20px;display:flex;gap:12px;flex-wrap:wrap;align-items:center">
              <label style="font-size:.85rem;color:var(--text-secondary);font-weight:500">Filtrar por nivel:</label>
              <button class="btn btn-sm btn-outline log-filter-btn active" data-filter="all">Todos</button>
              <button class="btn btn-sm btn-outline log-filter-btn" data-filter="info">
                <span class="badge badge-info" style="margin-right:4px">●</span> Info
              </button>
              <button class="btn btn-sm btn-outline log-filter-btn" data-filter="warn">
                <span class="badge badge-warning" style="margin-right:4px">●</span> Alerta
              </button>
              <button class="btn btn-sm btn-outline log-filter-btn" data-filter="error">
                <span class="badge badge-danger" style="margin-right:4px">●</span> Error
              </button>
              <div style="flex:1"></div>
              <input type="text" id="logs-search" class="input" placeholder="Buscar en logs…" style="max-width:240px;height:36px;font-size:.85rem">
            </div>

            <!-- Tabla de logs -->
            <div class="glass-card animate-up" style="animation-delay:.1s;overflow-x:auto">
              <table class="data-table" id="logs-table">
                <thead>
                  <tr>
                    <th style="width:80px">Nivel</th>
                    <th style="width:160px">Acción</th>
                    <th>Detalle</th>
                    <th style="width:180px">Usuario</th>
                    <th style="width:150px">Fecha</th>
                    <th style="width:140px">User Agent</th>
                  </tr>
                </thead>
                <tbody id="logs-tbody">
                  ${logsRows}
                </tbody>
              </table>
            </div>

            <p class="text-center" style="margin-top:16px;font-size:.8rem;color:var(--text-secondary)">
              Mostrando los últimos ${logs.length} registros
            </p>
          </main>
        </div>
      </div>
    `;
  },

  init() {
    Sidebar.init();
    Navbar.init();

    /* Botón refresh */
    const refreshBtn = document.getElementById('logs-refresh-btn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        App.navigate('#/admin/logs');
      });
    }

    /* Filtros por nivel */
    document.querySelectorAll('.log-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.log-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        const rows = document.querySelectorAll('#logs-tbody tr');
        rows.forEach(row => {
          if (filter === 'all') { row.style.display = ''; return; }
          const badge = row.querySelector('.badge');
          if (!badge) { row.style.display = ''; return; }
          const text = badge.textContent.toLowerCase();
          const matchMap = { info: 'info', warn: 'alerta', error: 'error' };
          row.style.display = text === matchMap[filter] ? '' : 'none';
        });
      });
    });

    /* Búsqueda */
    const searchInput = document.getElementById('logs-search');
    if (searchInput) {
      searchInput.addEventListener('input', Utils.debounce((e) => {
        const q = e.target.value.toLowerCase();
        const rows = document.querySelectorAll('#logs-tbody tr');
        rows.forEach(row => {
          row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
        });
      }, 250));
    }
  },
};
