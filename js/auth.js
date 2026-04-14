/* ============================================================
   NutriControl — Autenticación Segura (Supabase Auth)
   Login/logout seguro utilizando las credenciales nativas.
   Mantenemos sessionStorage como caché local para la SPA.
   ============================================================ */

const Auth = {

  /**
   * Inicializa el listener de estado para sincronizar inicios de sesión por Links/Email.
   */
  initListener() {
    sb.auth.onAuthStateChange(async (event, authSession) => {
      if (event === 'SIGNED_IN' && authSession?.user) {
        // Si no hay sesión local (ej: vino de un link de email directo)
        if (!this.getSession()) {
          const { data: user } = await sb.from('users').select('*').eq('id', authSession.user.id).maybeSingle();
          if (user) {
            const localSession = {
              userId:    user.id,
              role:      user.role,
              firstName: user.first_name,
              lastName:  user.last_name,
              loginAt:   new Date().toISOString(),
            };
            sessionStorage.setItem('nutri_session', JSON.stringify(localSession));
            
            // Si la URL tiene el token de recuperación o login, limpiar hash y redirigir
            if (window.location.hash.includes('access_token=') || window.location.hash === '' || window.location.hash === '#/login' || window.location.hash === '#/register') {
              window.location.hash = user.role === 'admin' ? '#/admin/dashboard' : '#/patient/dashboard';
            }
          }
        }
      } else if (event === 'SIGNED_OUT') {
        sessionStorage.removeItem('nutri_session');
        if (!window.location.hash.includes('login') && !window.location.hash.includes('register')) {
          window.location.hash = '#/login';
        }
      }
    });
  },

  /**
   * Autentica al usuario contra Supabase Auth.
   * @returns {{ ok:boolean, error?:string, role?:string }}
   */
  async login(email, password) {
    if (!email || !password) {
      return { ok: false, error: 'Por favor ingresa correo y contraseña.' };
    }

    try {
      // 1. Iniciar sesión segura a nivel de red con Supabase Auth
      const { data: authData, error: authError } = await sb.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (authError) {
        throw authError; // Sera capturado por el catch
      }

      // 2. Obtener el perfil de la tabla relacional (para roles, nombre, etc)
      const { data: user, error: dbError } = await sb
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .maybeSingle();

      if (dbError || !user) {
        // En caso excepcional que falte el registro DB
        await sb.auth.signOut(); 
        return { ok: false, error: 'Hubo un error cargando el perfil del usuario.' };
      }

      /* 3. Guardar sesión local de acceso rápido (UI) */
      const session = {
        userId:    user.id,
        role:      user.role,
        firstName: user.first_name,
        lastName:  user.last_name,
        loginAt:   new Date().toISOString(),
      };
      sessionStorage.setItem('nutri_session', JSON.stringify(session));

      Logger.logActivity('LOGIN', `Inicio de sesión (Supabase Auth): ${user.email} (${user.role})`);

      return { ok: true, role: user.role };

    } catch (err) {
      console.error('Supabase Auth login error:', err);
      if (err.message.includes('Invalid login credentials')) {
        return { ok: false, error: 'Correo o contraseña incorrectos.' };
      }
      if (err.message.includes('Email not confirmed')) {
        return { ok: false, error: 'Debes confirmar tu correo electrónico (si esto es un error, desactívalo en el Dashboard de Supabase).' };
      }
      return { ok: false, error: 'Error de conexión. Intenta de nuevo.' };
    }
  },

  /**
   * Registra un nuevo paciente utilizando Supabase Auth.
   */
  async register(email, password, firstName, lastName) {
    if (!email || !password || !firstName || !lastName) {
      return { ok: false, error: 'Por favor completa todos los campos.' };
    }

    const emailClean = email.toLowerCase().trim();

    try {
      // 1. Crear el usuario en auth.users de Supabase
      const { data: authData, error: authError } = await sb.auth.signUp({
        email: emailClean,
        password: password,
        options: {
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim()
          }
        }
      });

      if (authError) throw authError;

      // ¡Importante! Aquí asumimos que el Trigger SQL insertará en public.users
      
      // 2. Insertar perfil del paciente (asociado al ID del User que generó Supabase)
      if (authData?.user) {
        const patientToInsert = {
          user_id: authData.user.id,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: emailClean,
        };
        const { error: pErr } = await sb.from('patients').insert([patientToInsert]);
        if (pErr) console.warn("Aviso al crear paciente relacional:", pErr);
      }

      Logger.logActivity('REGISTER', `Nuevo auto-registro pendiente confirmación: ${emailClean}`);

      // Como los correos están activados, no hacemos auto login.
      // Supabase enviará un correo de verificación.
      return { ok: true, requireEmail: true, message: 'Revisa tu bandeja de entrada para verificar tu cuenta.' };

    } catch (error) {
      console.error('Supabase Auth register error:', error);
      if (error.message.includes('User already registered') || error.message.includes('already exists')) {
        return { ok: false, error: 'El correo ya está registrado.' };
      }
      return { ok: false, error: 'Error al registrar: ' + error.message };
    }
  },

  /**
   * Cierra la sesión local y en la red.
   */
  async logout() {
    const session = this.getSession();
    if (session) {
      Logger.logActivity('LOGOUT', `Cierre de sesión: ${session.firstName} ${session.lastName}`);
    }
    // Borrar caché local
    sessionStorage.removeItem('nutri_session');
    // Matar token de red de Supabase
    await sb.auth.signOut();
  },

  /**
   * Devuelve la sesión actual en memoria (lectura síncrona súper rápda para el UI).
   */
  getSession() {
    try {
      return JSON.parse(sessionStorage.getItem('nutri_session'));
    } catch {
      return null;
    }
  },

  /**
   * ¿Hay sesión activa en UI?
   */
  isAuthenticated() {
    return !!this.getSession();
  },

  /**
   * Guard de ruta para la SPA.
   */
  requireAuth(requiredRole) {
    const session = this.getSession();
    if (!session) return false;
    if (requiredRole && session.role !== requiredRole) return false;
    return true;
  },

  /**
   * Actualiza el nombre en la sesión (ej. tras editar perfil).
   */
  updateSessionName(firstName, lastName) {
    const session = this.getSession();
    if (!session) return;
    session.firstName = firstName;
    session.lastName  = lastName;
    sessionStorage.setItem('nutri_session', JSON.stringify(session));
  },
};
