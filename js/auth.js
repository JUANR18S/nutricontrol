/* ============================================================
   NutriControl — Autenticación (Supabase DB + sessionStorage)
   Login/logout contra la tabla 'users' en PostgreSQL.
   La sesión se almacena en sessionStorage (como antes).
   ============================================================ */

const Auth = {

  /**
   * Autentica al usuario contra la tabla 'users' en Supabase.
   * @returns {{ ok:boolean, error?:string, role?:string }}
   */
  async login(email, password) {
    if (!email || !password) {
      return { ok: false, error: 'Por favor ingresa correo y contraseña.' };
    }

    const hash = Utils.hashPassword(password);

    const { data: user, error } = await sb
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle();

    if (error) {
      console.error('Auth login error:', error);
      return { ok: false, error: 'Error de conexión. Intenta de nuevo.' };
    }

    if (!user || user.password !== hash) {
      return { ok: false, error: 'Correo o contraseña incorrectos.' };
    }

    /* Guardar sesión en sessionStorage */
    const session = {
      userId:    user.id,
      role:      user.role,
      firstName: user.first_name,
      lastName:  user.last_name,
      loginAt:   new Date().toISOString(),
    };
    sessionStorage.setItem('nutri_session', JSON.stringify(session));

    // Registrar log de actividad
    Logger.logActivity('LOGIN', `Inicio de sesión: ${user.email} (${user.role})`);

    return { ok: true, role: user.role };
  },

  /**
   * Cierra la sesión.
   */
  logout() {
    const session = this.getSession();
    if (session) {
      Logger.logActivity('LOGOUT', `Cierre de sesión: ${session.firstName} ${session.lastName}`);
    }
    sessionStorage.removeItem('nutri_session');
  },

  /**
   * Devuelve la sesión actual (síncrono — lee de sessionStorage).
   */
  getSession() {
    try {
      return JSON.parse(sessionStorage.getItem('nutri_session'));
    } catch {
      return null;
    }
  },

  /**
   * ¿Hay sesión activa?
   */
  isAuthenticated() {
    return !!this.getSession();
  },

  /**
   * Guard de ruta: verifica autenticación y rol.
   */
  requireAuth(requiredRole) {
    const session = this.getSession();
    if (!session) return false;
    if (requiredRole && session.role !== requiredRole) return false;
    return true;
  },

  /**
   * Actualiza el nombre en la sesión (ej. cuando el admin edita su perfil).
   */
  updateSessionName(firstName, lastName) {
    const session = this.getSession();
    if (!session) return;
    session.firstName = firstName;
    session.lastName  = lastName;
    sessionStorage.setItem('nutri_session', JSON.stringify(session));
  },
};
