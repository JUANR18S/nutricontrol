/* ============================================================
   NutriControl — Utilidades generales
   ============================================================ */
const Utils = {

  /** Genera un UUID v4 */
  generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  },

  /** Formatea fecha ISO → dd/mm/aaaa */
  formatDate(isoDate) {
    if (!isoDate) return '—';
    const d = new Date(isoDate + (isoDate.includes('T') ? '' : 'T00:00:00'));
    return d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  },

  /** Formatea fecha y hora ISO → dd/mm/aaaa HH:MM */
  formatDateTime(isoDate) {
    if (!isoDate) return '—';
    return new Date(isoDate).toLocaleString('es-ES', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  },

  /** Calcula edad a partir de fecha de nacimiento */
  calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  },

  /** Calcula IMC (peso en kg, talla en cm) */
  calculateBMI(weight, height) {
    if (!weight || !height) return 0;
    const h = height / 100;
    return Math.round((weight / (h * h)) * 10) / 10;
  },

  /** Devuelve categoría y clase CSS según IMC */
  getBMICategory(bmi) {
    if (bmi < 18.5) return { label: 'Bajo peso',    cls: 'info' };
    if (bmi < 25)   return { label: 'Peso normal',  cls: 'success' };
    if (bmi < 30)   return { label: 'Sobrepeso',    cls: 'warning' };
    return              { label: 'Obesidad',     cls: 'danger' };
  },

  /**
   * Hash simple (djb2) — sólo para MVP local.
   * En producción se debe usar bcrypt en el servidor.
   */
  hashPassword(password) {
    let hash = 5381;
    for (let i = 0; i < password.length; i++) {
      hash = ((hash << 5) + hash) + password.charCodeAt(i);
      hash = hash & hash; // convertir a 32-bit int
    }
    return hash.toString(36);
  },

  /** Escapa HTML para evitar XSS al inyectar texto de usuario */
  escapeHtml(text) {
    if (text == null) return '';
    const div = document.createElement('div');
    div.textContent = String(text);
    return div.innerHTML;
  },

  /** Título de role en español */
  roleLabel(role) {
    return role === 'admin' ? 'Administrador' : 'Paciente';
  },

  /** Iniciales de nombre y apellido */
  initials(firstName, lastName) {
    return ((firstName?.[0] ?? '') + (lastName?.[0] ?? '')).toUpperCase();
  },

  /** Género en español */
  genderLabel(gender) {
    const map = { male: 'Masculino', female: 'Femenino', other: 'Otro' };
    return map[gender] ?? gender;
  },

  /** Debounce */
  debounce(fn, wait) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
  },

  /** Rellena un número con ceros a la izquierda */
  pad(n, len = 2) {
    return String(n).padStart(len, '0');
  },

  generateAdminId() {
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const randomPart = Array.from(crypto.getRandomValues(new Uint8Array(8)))
      .map(n => alphabet[n % alphabet.length])
      .join('');
    return `ADM-${randomPart}`;
  },

  generateAccessKey(length = 18) {
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
    return Array.from(crypto.getRandomValues(new Uint8Array(length)))
      .map(n => alphabet[n % alphabet.length])
      .join('');
  },
};
