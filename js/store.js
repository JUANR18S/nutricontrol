/* ============================================================
   NutriControl — Capa de datos (Supabase / PostgreSQL)
   Todas las operaciones son asíncronas (async/await)
   ============================================================ */

/* ── Mappers: snake_case (DB) ↔ camelCase (JS) ────────────── */
const _map = {
  user(r) {
    if (!r) return null;
    return {
      id: r.id, email: r.email, password: r.password, role: r.role,
      firstName: r.first_name, lastName: r.last_name,
      adminId: r.admin_id, documentType: r.document_type, documentNumber: r.document_number,
      registrationKeyHash: r.registration_key_hash, createdAt: r.created_at,
    };
  },
  patient(r) {
    if (!r) return null;
    return {
      id: r.id, userId: r.user_id, firstName: r.first_name, lastName: r.last_name,
      email: r.email, phone: r.phone, birthDate: r.birth_date, gender: r.gender,
      objective: r.objective, createdBy: r.created_by, createdAt: r.created_at,
    };
  },
  control(r) {
    if (!r) return null;
    return {
      id: r.id, patientId: r.patient_id, date: r.date,
      weight: r.weight != null ? Number(r.weight) : null,
      height: r.height != null ? Number(r.height) : null,
      bmi: r.bmi != null ? Number(r.bmi) : null,
      fatPercentage: r.fat_percentage != null ? Number(r.fat_percentage) : null,
      muscleMass: r.muscle_mass != null ? Number(r.muscle_mass) : null,
      waistCircumference: r.waist_circumference != null ? Number(r.waist_circumference) : null,
      notes: r.notes, dietPlan: r.diet_plan,
      registeredBy: r.registered_by, createdAt: r.created_at,
    };
  },
  /** Convierte objeto JS (camelCase) a objeto DB (snake_case) */
  toDB(obj) {
    const keyMap = {
      firstName: 'first_name', lastName: 'last_name', birthDate: 'birth_date',
      createdAt: 'created_at', createdBy: 'created_by', userId: 'user_id',
      patientId: 'patient_id', fatPercentage: 'fat_percentage', muscleMass: 'muscle_mass',
      waistCircumference: 'waist_circumference', dietPlan: 'diet_plan', registeredBy: 'registered_by',
      adminId: 'admin_id', documentType: 'document_type', documentNumber: 'document_number',
      registrationKeyHash: 'registration_key_hash',
    };
    const result = {};
    for (const [key, val] of Object.entries(obj)) {
      if (val === undefined) continue;
      result[keyMap[key] || key] = val;
    }
    return result;
  },
};

/* ── Store ─────────────────────────────────────────────────── */
const Store = {

  /* ── Inicialización (seed si BD vacía) ──────────────────── */
  async init() {
    try {
      const { data } = await sb.from('users').select('id').limit(1);
      if (!data || data.length === 0) {
        console.log('NutriControl: Base de datos vacía, insertando datos de prueba…');
        await this._seed();
      }
    } catch (e) {
      console.error('Error inicializando:', e);
    }
  },

  async _seed() {
    /* Admin */
    const { data: adminArr } = await sb.from('users').insert([{
      email: 'admin@nutricontrol.com',
      password: Utils.hashPassword('Admin123'),
      role: 'admin',
      first_name: 'Administrador',
      last_name: 'Principal',
      created_at: '2026-02-05T10:00:00Z',
    }]).select();
    const admin = adminArr[0];

    /* Pacientes (users) */
    const { data: pUsersArr } = await sb.from('users').insert([
      { email: 'maria@ejemplo.com', password: Utils.hashPassword('Paciente123'), role: 'patient', first_name: 'María', last_name: 'González', created_at: '2026-03-07T10:00:00Z' },
      { email: 'carlos@ejemplo.com', password: Utils.hashPassword('Paciente123'), role: 'patient', first_name: 'Carlos', last_name: 'Rodríguez', created_at: '2026-03-10T10:00:00Z' },
    ]).select();
    const uMaria  = pUsersArr[0];
    const uCarlos = pUsersArr[1];

    /* Pacientes (perfil) */
    const { data: patsArr } = await sb.from('patients').insert([
      { user_id: uMaria.id, first_name: 'María', last_name: 'González', email: 'maria@ejemplo.com', phone: '+56 9 8765 4321', birth_date: '1990-03-15', gender: 'F', objective: 'Bajar de peso y mejorar hábitos alimenticios. Meta: alcanzar IMC normal en 6 meses.', created_by: admin.id, created_at: '2026-03-07T10:00:00Z' },
      { user_id: uCarlos.id, first_name: 'Carlos', last_name: 'Rodríguez', email: 'carlos@ejemplo.com', phone: '+56 9 1234 5678', birth_date: '1985-11-22', gender: 'M', objective: 'Aumentar masa muscular y reducir porcentaje de grasa corporal.', created_by: admin.id, created_at: '2026-03-10T10:00:00Z' },
    ]).select();
    const pMaria  = patsArr[0];
    const pCarlos = patsArr[1];

    /* Controles */
    await sb.from('controls').insert([
      { patient_id: pMaria.id, date: '2026-03-31', weight: 73, height: 165, bmi: 26.8, fat_percentage: 31.8, muscle_mass: 45.5, waist_circumference: 86.5, notes: 'Evolución positiva. Perdió 1,3 kg en 3 semanas. Refiere mayor energía.', diet_plan: 'Mantener dieta hipocalórica. Incorporar 30 min de caminata diaria.', registered_by: admin.id, created_at: '2026-03-31T10:00:00Z' },
      { patient_id: pCarlos.id, date: '2026-03-26', weight: 82, height: 178, bmi: 25.9, fat_percentage: 22.1, muscle_mass: 62.3, waist_circumference: 91.0, notes: 'Buen progreso en masa muscular. Incrementar proteínas a 2g/kg.', diet_plan: 'Dieta hiperproteica 2800 kcal. Suplementar con creatina 5g/día.', registered_by: admin.id, created_at: '2026-03-26T10:00:00Z' },
    ]);

    console.log('NutriControl: Datos de prueba insertados ✓');
  },

  /* ── Users / Admins ─────────────────────────────────────── */
  async getUsers() {
    const { data, error } = await sb.from('users').select('*').order('created_at', { ascending: false });
    if (error) { console.error(error); return []; }
    return (data || []).map(_map.user);
  },

  async addUser(user) {
    const row = _map.toDB(user);
    delete row.id; // let DB generate
    const { data, error } = await sb.from('users').insert([row]).select();
    if (error) throw error;
    Logger.logActivity('CREATE_USER', `Usuario creado: ${row.email} (${row.role})`);
    return _map.user(data[0]);
  },

  async updateUser(id, updates) {
    const row = _map.toDB(updates);
    const { error } = await sb.from('users').update(row).eq('id', id);
    if (error) throw error;
  },

  async deleteUser(id) {
    const { error } = await sb.from('users').delete().eq('id', id);
    if (error) throw error;
    Logger.logActivity('DELETE_USER', `Usuario eliminado: ID ${id}`);
  },

  async getUserById(id) {
    if (!id) return null;
    const { data, error } = await sb.from('users').select('*').eq('id', id).maybeSingle();
    if (error) { console.error(error); return null; }
    return _map.user(data);
  },

  async emailExists(email, excludeId = null) {
    let q = sb.from('users').select('id').eq('email', email);
    if (excludeId) q = q.neq('id', excludeId);
    const { data } = await q;
    return data && data.length > 0;
  },

  async getAdmins() {
    const { data, error } = await sb.from('users').select('*').eq('role', 'admin').order('created_at', { ascending: false });
    if (error) { console.error(error); return []; }
    return (data || []).map(_map.user);
  },

  /* ── Patients ───────────────────────────────────────────── */
  async getPatients() {
    const { data, error } = await sb.from('patients').select('*').order('created_at', { ascending: false });
    if (error) { console.error(error); return []; }
    return (data || []).map(_map.patient);
  },

  async addPatient(patient) {
    const row = _map.toDB(patient);
    delete row.id;
    const { data, error } = await sb.from('patients').insert([row]).select();
    if (error) throw error;
    Logger.logActivity('CREATE_PATIENT', `Paciente creado: ${row.first_name} ${row.last_name}`);
    return _map.patient(data[0]);
  },

  async updatePatient(id, updates) {
    const row = _map.toDB(updates);
    const { error } = await sb.from('patients').update(row).eq('id', id);
    if (error) throw error;
  },

  async deletePatient(id) {
    const patient = await this.getPatientById(id);
    await sb.from('controls').delete().eq('patient_id', id);
    await sb.from('patients').delete().eq('id', id);
    if (patient && patient.userId) {
      await sb.from('users').delete().eq('id', patient.userId);
    }
    Logger.logActivity('DELETE_PATIENT', `Paciente eliminado: ID ${id}`);
  },

  async getPatientById(id) {
    if (!id) return null;
    const { data, error } = await sb.from('patients').select('*').eq('id', id).maybeSingle();
    if (error) { console.error(error); return null; }
    return _map.patient(data);
  },

  async getPatientByUserId(userId) {
    if (!userId) return null;
    const { data, error } = await sb.from('patients').select('*').eq('user_id', userId).maybeSingle();
    if (error) { console.error(error); return null; }
    return _map.patient(data);
  },

  /* ── Controls ───────────────────────────────────────────── */
  async getControls() {
    const { data, error } = await sb.from('controls').select('*').order('date', { ascending: false });
    if (error) { console.error(error); return []; }
    return (data || []).map(_map.control);
  },

  async addControl(control) {
    const row = _map.toDB(control);
    delete row.id;
    const { data, error } = await sb.from('controls').insert([row]).select();
    if (error) throw error;
    Logger.logActivity('CREATE_CONTROL', `Control nutricional creado para paciente ID ${row.patient_id}`);
    return _map.control(data[0]);
  },

  async updateControl(id, updates) {
    const row = _map.toDB(updates);
    const { error } = await sb.from('controls').update(row).eq('id', id);
    if (error) throw error;
  },

  async deleteControl(id) {
    const { error } = await sb.from('controls').delete().eq('id', id);
    if (error) throw error;
    Logger.logActivity('DELETE_CONTROL', `Control eliminado: ID ${id}`);
  },

  async getControlById(id) {
    if (!id) return null;
    const { data, error } = await sb.from('controls').select('*').eq('id', id).maybeSingle();
    if (error) { console.error(error); return null; }
    return _map.control(data);
  },

  async getControlsByPatient(patientId) {
    if (!patientId) return [];
    const { data, error } = await sb.from('controls').select('*').eq('patient_id', patientId).order('date', { ascending: false });
    if (error) { console.error(error); return []; }
    return (data || []).map(_map.control);
  },

  /* ── Stats ──────────────────────────────────────────────── */
  async getStats() {
    const [patients, controls, admins] = await Promise.all([
      this.getPatients(),
      this.getControls(),
      this.getAdmins(),
    ]);
    return {
      totalPatients: patients.length,
      totalControls: controls.length,
      totalAdmins:   admins.length,
    };
  },
};
