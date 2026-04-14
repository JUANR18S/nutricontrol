/* ============================================================
   NutriControl — Logger (usando loglevel)
   Módulo centralizado de logging con niveles:
   TRACE, DEBUG, INFO, WARN, ERROR
   
   Además persiste logs de actividad en Supabase (tabla activity_logs)
   para auditoría y seguimiento de acciones de usuarios.
   ============================================================ */

/* ── Configuración de loglevel ────────────────────────────── */
const Logger = (() => {
  // loglevel se carga desde CDN como window.log
  const _log = window.log || console;

  // Nivel por defecto: INFO en producción, DEBUG en desarrollo
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  if (_log.setLevel) {
    _log.setLevel(isLocal ? 'debug' : 'info');
  }

  /* ── Prefijos con color para la consola ──────────────── */
  const _prefix = (level) => {
    const ts = new Date().toLocaleTimeString('es-ES', { hour12: false });
    return `[${ts}] [${level.toUpperCase()}]`;
  };

  /* ── API Pública ─────────────────────────────────────── */
  return {
    /** Log de nivel TRACE (más detallado) */
    trace(...args) { _log.trace?.(_prefix('trace'), ...args) || console.log(_prefix('trace'), ...args); },

    /** Log de nivel DEBUG */
    debug(...args) { _log.debug?.(_prefix('debug'), ...args) || console.log(_prefix('debug'), ...args); },

    /** Log de nivel INFO */
    info(...args) { _log.info?.(_prefix('info'), ...args) || console.info(_prefix('info'), ...args); },

    /** Log de nivel WARN */
    warn(...args) { _log.warn?.(_prefix('warn'), ...args) || console.warn(_prefix('warn'), ...args); },

    /** Log de nivel ERROR */
    error(...args) { _log.error?.(_prefix('error'), ...args) || console.error(_prefix('error'), ...args); },

    /**
     * Registra una acción de usuario en la tabla activity_logs de Supabase.
     * @param {string} action  - Tipo de acción (LOGIN, LOGOUT, CREATE_PATIENT, etc.)
     * @param {string} detail  - Descripción legible de la acción
     * @param {string} [level] - Nivel del log: info, warn, error (default: info)
     */
    async logActivity(action, detail, level = 'info') {
      const session = Auth.getSession();
      const entry = {
        user_id:    session?.userId || null,
        user_email: null,
        action:     action,
        detail:     detail,
        level:      level,
        ip_address: null,
        user_agent: navigator.userAgent || null,
        created_at: new Date().toISOString(),
      };

      // Obtener email del usuario si hay sesión
      if (session?.userId) {
        try {
          const user = await Store.getUserById(session.userId);
          entry.user_email = user?.email || null;
        } catch { /* silenciar */ }
      }

      // Log en consola también
      this.info(`[${action}]`, detail);

      // Insertar en Supabase (sin bloquear la UI)
      try {
        await sb.from('activity_logs').insert([entry]);
      } catch (e) {
        this.warn('No se pudo guardar log en Supabase:', e.message);
      }
    },

    /**
     * Cambia el nivel de logging en tiempo real.
     * @param {'trace'|'debug'|'info'|'warn'|'error'|'silent'} level
     */
    setLevel(level) {
      if (_log.setLevel) _log.setLevel(level);
    },
  };
})();
