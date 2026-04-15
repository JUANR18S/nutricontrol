/* ============================================================
   NutriControl - Autenticacion Segura (Supabase Auth)
   ============================================================ */

const Auth = {
  initListener() {
    sb.auth.onAuthStateChange(async (event, authSession) => {
      if (event === 'SIGNED_IN' && authSession?.user) {
        if (!this.getSession()) {
          const { data: user } = await sb.from('users').select('*').eq('id', authSession.user.id).maybeSingle();

          if (user) {
            const localSession = {
              userId: user.id,
              role: user.role,
              firstName: user.first_name,
              lastName: user.last_name,
              loginAt: new Date().toISOString(),
            };

            sessionStorage.setItem('nutri_session', JSON.stringify(localSession));

            if (
              window.location.hash.includes('access_token=') ||
              window.location.hash === '' ||
              window.location.hash.startsWith('#/login') ||
              window.location.hash.startsWith('#/register') ||
              window.location.hash.startsWith('#/admin-access')
            ) {
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

  async login(email, password) {
    if (!email || !password) {
      return { ok: false, error: 'Por favor ingresa correo y contrasena.' };
    }

    try {
      const { data: authData, error: authError } = await sb.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) throw authError;

      const { data: user, error: dbError } = await sb
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .maybeSingle();

      if (dbError || !user) {
        await sb.auth.signOut();
        return { ok: false, error: 'Hubo un error cargando el perfil del usuario.' };
      }

      const session = {
        userId: user.id,
        role: user.role,
        firstName: user.first_name,
        lastName: user.last_name,
        loginAt: new Date().toISOString(),
      };

      sessionStorage.setItem('nutri_session', JSON.stringify(session));
      Logger.logActivity('LOGIN', `Inicio de sesion (Supabase Auth): ${user.email} (${user.role})`);

      return { ok: true, role: user.role };
    } catch (err) {
      console.error('Supabase Auth login error:', err);

      if (err.message.includes('Invalid login credentials')) {
        return { ok: false, error: 'Correo o contrasena incorrectos.' };
      }

      if (err.message.includes('Email not confirmed')) {
        return { ok: false, error: 'Debes confirmar tu correo electronico antes de ingresar.' };
      }

      return { ok: false, error: 'Error de conexion. Intenta de nuevo.' };
    }
  },

  async loginAdmin(email, password) {
    const result = await this.login(email, password);
    if (!result.ok) return result;

    if (result.role !== 'admin') {
      await this.logout();
      return { ok: false, error: 'Esta cuenta no tiene permisos de administrador.' };
    }

    return result;
  },

  async register(email, password, firstName, lastName) {
    if (!email || !password || !firstName || !lastName) {
      return { ok: false, error: 'Por favor completa todos los campos.' };
    }

    const emailClean = email.toLowerCase().trim();

    try {
      const { data: authData, error: authError } = await sb.auth.signUp({
        email: emailClean,
        password,
        options: {
          emailRedirectTo: this.getEmailConfirmationRedirect(),
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
          },
        },
      });

      if (authError) throw authError;

      if (authData?.user) {
        const patientToInsert = {
          user_id: authData.user.id,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: emailClean,
        };

        const { error: pErr } = await sb.from('patients').insert([patientToInsert]);
        if (pErr) console.warn('Aviso al crear paciente relacional:', pErr);
      }

      Logger.logActivity('REGISTER', `Nuevo auto-registro pendiente confirmacion: ${emailClean}`);

      return { ok: true, requireEmail: true, message: 'Revisa tu bandeja de entrada para verificar tu cuenta.' };
    } catch (error) {
      console.error('Supabase Auth register error:', error);

      if (error.message.includes('User already registered') || error.message.includes('already exists')) {
        return { ok: false, error: 'El correo ya esta registrado.' };
      }

      return { ok: false, error: `Error al registrar: ${error.message}` };
    }
  },

  async registerAdmin({ email, password, firstName, lastName, adminId, accessKey, documentType, documentNumber }) {
    if (!email || !password || !firstName || !lastName || !adminId || !accessKey || !documentType || !documentNumber) {
      return { ok: false, error: 'Completa todos los campos obligatorios del registro administrativo.' };
    }

    const emailClean = email.toLowerCase().trim();
    const adminIdClean = adminId.trim();
    const documentNumberClean = documentNumber.trim();

    try {
      const { data: authData, error: authError } = await sb.auth.signUp({
        email: emailClean,
        password,
        options: {
          emailRedirectTo: this.getEmailConfirmationRedirect('admin'),
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            role: 'admin',
            admin_id: adminIdClean,
            registration_key: accessKey,
            document_type: documentType,
            document_number: documentNumberClean,
          },
        },
      });

      if (authError) throw authError;

      if (authData?.user) {
        const { error: userError } = await sb.from('users').upsert([{
          id: authData.user.id,
          email: emailClean,
          password: Utils.hashPassword(password),
          role: 'admin',
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          admin_id: adminIdClean,
          document_type: documentType,
          document_number: documentNumberClean,
          registration_key_hash: Utils.hashPassword(accessKey),
          created_at: new Date().toISOString(),
        }]);

        if (userError) throw userError;
      }

      Logger.logActivity('REGISTER_ADMIN', `Nuevo administrador registrado: ${emailClean}`);
      return { ok: true, requireEmail: true, message: 'Confirma tu correo para activar el acceso administrativo. Te enviamos tu ID y llave temporal.' };
    } catch (error) {
      console.error('Supabase Auth register admin error:', error);

      if (error.message.includes('User already registered') || error.message.includes('already exists')) {
        return { ok: false, error: 'El correo ya esta registrado.' };
      }
      if (error.message.includes('users_admin_id_key')) {
        return { ok: false, error: 'Se genero un ID de administrador repetido. Intenta de nuevo.' };
      }
      if (error.message.includes('users_document_type_document_number_key')) {
        return { ok: false, error: 'Ya existe un administrador con ese tipo y numero de documento.' };
      }

      return { ok: false, error: `Error al registrar administrador: ${error.message}` };
    }
  },

  async logout() {
    const session = this.getSession();
    if (session) {
      Logger.logActivity('LOGOUT', `Cierre de sesion: ${session.firstName} ${session.lastName}`);
    }

    sessionStorage.removeItem('nutri_session');
    await sb.auth.signOut();
  },

  getSession() {
    try {
      return JSON.parse(sessionStorage.getItem('nutri_session'));
    } catch {
      return null;
    }
  },

  isAuthenticated() {
    return !!this.getSession();
  },

  requireAuth(requiredRole) {
    const session = this.getSession();
    if (!session) return false;
    if (requiredRole && session.role !== requiredRole) return false;
    return true;
  },

  updateSessionName(firstName, lastName) {
    const session = this.getSession();
    if (!session) return;

    session.firstName = firstName;
    session.lastName = lastName;
    sessionStorage.setItem('nutri_session', JSON.stringify(session));
  },

  getEmailConfirmationRedirect(mode = 'patient') {
    const baseUrl = `${window.location.origin}${window.location.pathname}`;
    return mode === 'admin'
      ? `${baseUrl}#/admin-access?confirmed=1`
      : `${baseUrl}#/login?confirmed=1`;
  },
};
