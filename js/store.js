/* ============================================================
   NutriControl — Capa de datos (localStorage)
   ============================================================ */
const Store = {

  KEYS: {
    USERS:       'nutri_users',
    PATIENTS:    'nutri_patients',
    CONTROLS:    'nutri_controls',
    INITIALIZED: 'nutri_db_v1',
  },

  /* ── Helpers genéricos ─────────────────────────────────── */
  _get(key) {
    try {
      return JSON.parse(localStorage.getItem(key) ?? '[]');
    } catch { return []; }
  },

  _set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  /* ── Inicialización con seed data ─────────────────────── */
  init() {
    if (localStorage.getItem(this.KEYS.INITIALIZED)) return;

    const adminId       = Utils.generateId();
    const p1UserId      = Utils.generateId();
    const p2UserId      = Utils.generateId();
    const p1Id          = Utils.generateId();
    const p2Id          = Utils.generateId();
    const now           = new Date();
    const daysAgo = n  => new Date(now - n * 864e5).toISOString();

    /* ── Usuarios ─────────────────────────────────────────── */
    const users = [
      {
        id: adminId,
        email: 'admin@nutricontrol.com',
        password: Utils.hashPassword('Admin123'),
        role: 'admin',
        firstName: 'Administrador',
        lastName: 'Principal',
        createdAt: daysAgo(60),
      },
      {
        id: p1UserId,
        email: 'maria@ejemplo.com',
        password: Utils.hashPassword('Paciente123'),
        role: 'patient',
        firstName: 'María',
        lastName: 'González',
        createdAt: daysAgo(30),
      },
      {
        id: p2UserId,
        email: 'carlos@ejemplo.com',
        password: Utils.hashPassword('Paciente123'),
        role: 'patient',
        firstName: 'Carlos',
        lastName: 'Rodríguez',
        createdAt: daysAgo(15),
      },
    ];

    /* ── Pacientes ────────────────────────────────────────── */
    const patients = [
      {
        id: p1Id,
        userId: p1UserId,
        firstName: 'María',
        lastName: 'González',
        email: 'maria@ejemplo.com',
        phone: '+56 9 8765 4321',
        birthDate: '1990-03-15',
        gender: 'female',
        objective: 'Reducción de peso y mejora de composición corporal',
        createdAt: daysAgo(30),
        createdBy: adminId,
      },
      {
        id: p2Id,
        userId: p2UserId,
        firstName: 'Carlos',
        lastName: 'Rodríguez',
        email: 'carlos@ejemplo.com',
        phone: '+56 9 1234 5678',
        birthDate: '1985-07-22',
        gender: 'male',
        objective: 'Mantenimiento de peso y aumento de masa muscular',
        createdAt: daysAgo(15),
        createdBy: adminId,
      },
    ];

    /* ── Controles nutricionales ──────────────────────────── */
    const controls = [
      {
        id: Utils.generateId(),
        patientId: p1Id,
        date: daysAgo(28).split('T')[0],
        weight: 75.5,
        height: 165,
        bmi: Utils.calculateBMI(75.5, 165),
        fatPercentage: 32.5,
        muscleMass: 45.2,
        waistCircumference: 88,
        notes: 'Primer control. Paciente motivada y sin antecedentes clínicos relevantes.',
        dietPlan: 'Dieta hipocalórica 1.500 kcal/día. 5 comidas pequeñas. Restricción de azúcares añadidos.',
        registeredBy: adminId,
        createdAt: daysAgo(28),
      },
      {
        id: Utils.generateId(),
        patientId: p1Id,
        date: daysAgo(7).split('T')[0],
        weight: 74.2,
        height: 165,
        bmi: Utils.calculateBMI(74.2, 165),
        fatPercentage: 31.8,
        muscleMass: 45.5,
        waistCircumference: 86.5,
        notes: 'Evolución positiva. Perdió 1,3 kg en 3 semanas. Refiere mayor energía.',
        dietPlan: 'Mantener dieta hipocalórica. Incorporar 30 min de caminata diaria.',
        registeredBy: adminId,
        createdAt: daysAgo(7),
      },
      {
        id: Utils.generateId(),
        patientId: p2Id,
        date: daysAgo(12).split('T')[0],
        weight: 82,
        height: 178,
        bmi: Utils.calculateBMI(82, 178),
        fatPercentage: 22.1,
        muscleMass: 58.3,
        waistCircumference: 94,
        notes: 'Control inicial. Buen estado físico general. Objetivo: ganar masa muscular.',
        dietPlan: 'Dieta normocalórica 2.400 kcal/día. Proteínas 2 g/kg. Distribución 40/30/30.',
        registeredBy: adminId,
        createdAt: daysAgo(12),
      },
    ];

    this._set(this.KEYS.USERS,    users);
    this._set(this.KEYS.PATIENTS, patients);
    this._set(this.KEYS.CONTROLS, controls);
    localStorage.setItem(this.KEYS.INITIALIZED, 'true');
  },

  /* ── USUARIOS ──────────────────────────────────────────── */
  getUsers()                { return this._get(this.KEYS.USERS); },
  getUserById(id)           { return this.getUsers().find(u => u.id === id) ?? null; },
  getUserByEmail(email)     { return this.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase()) ?? null; },
  getAdmins()               { return this.getUsers().filter(u => u.role === 'admin'); },

  addUser(user) {
    const users = this.getUsers();
    users.push(user);
    this._set(this.KEYS.USERS, users);
    return user;
  },

  updateUser(id, updates) {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    users[idx] = { ...users[idx], ...updates, updatedAt: new Date().toISOString() };
    this._set(this.KEYS.USERS, users);
    return users[idx];
  },

  deleteUser(id) {
    this._set(this.KEYS.USERS, this.getUsers().filter(u => u.id !== id));
  },

  emailExists(email, excludeId = null) {
    return this.getUsers().some(u =>
      u.email.toLowerCase() === email.toLowerCase() && u.id !== excludeId
    );
  },

  /* ── PACIENTES ─────────────────────────────────────────── */
  getPatients()             { return this._get(this.KEYS.PATIENTS); },
  getPatientById(id)        { return this.getPatients().find(p => p.id === id) ?? null; },
  getPatientByUserId(uid)   { return this.getPatients().find(p => p.userId === uid) ?? null; },

  addPatient(patient) {
    const patients = this.getPatients();
    patients.push(patient);
    this._set(this.KEYS.PATIENTS, patients);
    return patient;
  },

  updatePatient(id, updates) {
    const patients = this.getPatients();
    const idx = patients.findIndex(p => p.id === id);
    if (idx === -1) return null;
    patients[idx] = { ...patients[idx], ...updates, updatedAt: new Date().toISOString() };
    this._set(this.KEYS.PATIENTS, patients);
    return patients[idx];
  },

  deletePatient(id) {
    this._set(this.KEYS.PATIENTS, this.getPatients().filter(p => p.id !== id));
  },

  /* ── CONTROLES NUTRICIONALES ───────────────────────────── */
  getControls()             { return this._get(this.KEYS.CONTROLS); },
  getControlById(id)        { return this.getControls().find(c => c.id === id) ?? null; },

  getControlsByPatient(patientId) {
    return this.getControls()
      .filter(c => c.patientId === patientId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  getLastControlByPatient(patientId) {
    return this.getControlsByPatient(patientId)[0] ?? null;
  },

  addControl(control) {
    const controls = this.getControls();
    controls.push(control);
    this._set(this.KEYS.CONTROLS, controls);
    return control;
  },

  updateControl(id, updates) {
    const controls = this.getControls();
    const idx = controls.findIndex(c => c.id === id);
    if (idx === -1) return null;
    controls[idx] = { ...controls[idx], ...updates, updatedAt: new Date().toISOString() };
    this._set(this.KEYS.CONTROLS, controls);
    return controls[idx];
  },

  deleteControl(id) {
    this._set(this.KEYS.CONTROLS, this.getControls().filter(c => c.id !== id));
  },

  /* ── ESTADÍSTICAS ──────────────────────────────────────── */
  getStats() {
    const patients = this.getPatients();
    const controls = this.getControls();
    const admins   = this.getAdmins();
    const recentControls = controls
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    return {
      totalPatients:  patients.length,
      totalControls:  controls.length,
      totalAdmins:    admins.length,
      recentControls,
    };
  },
};
