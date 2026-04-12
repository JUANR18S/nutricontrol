/* ============================================================
   NutriControl — Autenticación y manejo de sesión
   ============================================================ */
const Auth = {

  SESSION_KEY: 'nutri_session',

  /* ── Login ─────────────────────────────────────────────── */
  login(email, password) {
    const user = Store.getUserByEmail(email);

    if (!user) {
      return { success: false, error: 'Correo o contraseña incorrectos.' };
    }

    if (user.password !== Utils.hashPassword(password)) {
      return { success: false, error: 'Correo o contraseña incorrectos.' };
    }

    const session = {
      userId:    user.id,
      email:     user.email,
      role:      user.role,
      firstName: user.firstName,
      lastName:  user.lastName,
      loginAt:   new Date().toISOString(),
    };

    sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    return { success: true, session };
  },

  /* ── Logout ────────────────────────────────────────────── */
  logout() {
    sessionStorage.removeItem(this.SESSION_KEY);
    window.location.hash = '#/login';
  },

  /* ── Sesión actual ─────────────────────────────────────── */
  getSession() {
    try {
      const raw = sessionStorage.getItem(this.SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  },

  updateSessionName(firstName, lastName) {
    const session = this.getSession();
    if (!session) return;
    session.firstName = firstName;
    session.lastName  = lastName;
    sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
  },

  /* ── Helpers de rol ────────────────────────────────────── */
  isAuthenticated() { return !!this.getSession(); },
  isAdmin()         { return this.getSession()?.role === 'admin'; },
  isPatient()       { return this.getSession()?.role === 'patient'; },

  /* ── Guard de ruta ─────────────────────────────────────── */
  requireAuth(requiredRole = null) {
    const session = this.getSession();

    if (!session) {
      window.location.hash = '#/login';
      return false;
    }

    if (requiredRole && session.role !== requiredRole) {
      window.location.hash = session.role === 'admin'
        ? '#/admin/dashboard'
        : '#/patient/dashboard';
      return false;
    }

    return true;
  },

  /* ── Cambio de contraseña ──────────────────────────────── */
  changePassword(userId, currentPassword, newPassword) {
    const user = Store.getUserById(userId);
    if (!user) return { success: false, error: 'Usuario no encontrado.' };

    if (user.password !== Utils.hashPassword(currentPassword)) {
      return { success: false, error: 'La contraseña actual es incorrecta.' };
    }

    Store.updateUser(userId, { password: Utils.hashPassword(newPassword) });
    return { success: true };
  },
};
