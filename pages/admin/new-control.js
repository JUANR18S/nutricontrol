/* ============================================================
   NutriControl — Registrar Control Nutricional (Admin)
   ============================================================ */
window.NutriPages = window.NutriPages || {};

window.NutriPages['admin-new-control'] = {

  async render(container) {
    const session  = Auth.getSession();
    const patients = await Store.getPatients();

    /* Pre-selección de paciente desde URL: #/admin/controls/new?patientId=xxx */
    const hash       = window.location.hash;
    const qIndex     = hash.indexOf('?');
    const prePatient = qIndex !== -1
      ? new URLSearchParams(hash.slice(qIndex)).get('patientId') ?? ''
      : '';

    const patientOptions = patients.map(p =>
      `<option value="${p.id}" ${p.id === prePatient ? 'selected' : ''}>
        ${Utils.escapeHtml(p.firstName + ' ' + p.lastName)} — ${Utils.escapeHtml(p.email)}
       </option>`
    ).join('');

    const today = new Date().toISOString().split('T')[0];

    const content = `
      <div class="page-header">
        <div>
          <h1>Registrar Control Nutricional</h1>
          <p style="color:var(--text-secondary);margin-top:4px">Ingresa las medidas antropométricas del paciente.</p>
        </div>
        <button onclick="history.back()" class="btn btn-secondary btn-sm" id="nc-back-btn">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="15" height="15"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/></svg>
          Volver
        </button>
      </div>

      <form id="new-control-form" novalidate>

        <!-- Paciente y Fecha -->
        <div class="card" style="margin-bottom:20px">
          <div class="card__header">
            <h3 class="card__title">Selección de Paciente</h3>
          </div>
          ${patients.length === 0 ? `
            <div class="alert alert-warning">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z"/></svg>
              No hay pacientes registrados. <a href="#/admin/patients/new">Crea el primero aquí</a>.
            </div>
          ` : `
            <div class="form-grid form-grid-2">
              <div class="form-group">
                <label for="nc-patient">Paciente <span style="color:var(--danger)">*</span></label>
                <select id="nc-patient" required>
                  <option value="">Seleccionar paciente…</option>
                  ${patientOptions}
                </select>
              </div>
              <div class="form-group">
                <label for="nc-date">Fecha del Control <span style="color:var(--danger)">*</span></label>
                <input type="date" id="nc-date" value="${today}" max="${today}" required>
              </div>
            </div>
          `}
        </div>

        <!-- Medidas antropométricas -->
        <div class="card" style="margin-bottom:20px">
          <div class="card__header">
            <h3 class="card__title">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" width="18" height="18"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z"/></svg>
              Medidas Antropométricas
            </h3>
          </div>
          <div class="form-grid form-grid-3">
            <div class="form-group">
              <label for="nc-weight">Peso (kg) <span style="color:var(--danger)">*</span></label>
              <input type="number" id="nc-weight" placeholder="Ej: 72.5" min="20" max="300" step="0.1" required>
            </div>
            <div class="form-group">
              <label for="nc-height">Talla (cm) <span style="color:var(--danger)">*</span></label>
              <input type="number" id="nc-height" placeholder="Ej: 170" min="100" max="250" step="0.5" required>
            </div>
            <div class="form-group">
              <label for="nc-bmi">IMC (calculado automáticamente)</label>
              <input type="text" id="nc-bmi" placeholder="—" readonly
                style="background:var(--bg-surface);cursor:not-allowed;color:var(--text-secondary)">
              <div id="nc-bmi-badge" style="margin-top:6px"></div>
            </div>
            <div class="form-group">
              <label for="nc-fat">% Grasa Corporal</label>
              <input type="number" id="nc-fat" placeholder="Ej: 28.5" min="1" max="70" step="0.1">
            </div>
            <div class="form-group">
              <label for="nc-muscle">Masa Muscular (kg)</label>
              <input type="number" id="nc-muscle" placeholder="Ej: 45.2" min="5" max="100" step="0.1">
            </div>
            <div class="form-group">
              <label for="nc-waist">Circunferencia Cintura (cm)</label>
              <input type="number" id="nc-waist" placeholder="Ej: 88" min="40" max="200" step="0.5">
            </div>
          </div>
        </div>

        <!-- Notas y plan -->
        <div class="card" style="margin-bottom:20px">
          <div class="card__header">
            <h3 class="card__title">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" width="18" height="18"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/></svg>
              Notas y Plan Dietético
            </h3>
          </div>
          <div class="form-grid" style="gap:20px">
            <div class="form-group">
              <label for="nc-notes">Notas Clínicas</label>
              <textarea id="nc-notes" rows="4" placeholder="Observaciones del control, estado del paciente, evolución…"></textarea>
            </div>
            <div class="form-group">
              <label for="nc-diet">Plan Dietético</label>
              <textarea id="nc-diet" rows="4" placeholder="Indicaciones nutricionales, distribución de macros, kcal diarias…"></textarea>
            </div>
          </div>
        </div>

        <!-- Error y submit -->
        <div id="nc-error" class="alert alert-danger hidden" role="alert">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/></svg>
          <span id="nc-error-text"></span>
        </div>

        <div class="flex gap-2" style="justify-content:flex-end;margin-top:8px">
          <button type="button" onclick="history.back()" class="btn btn-secondary">Cancelar</button>
          <button type="submit" id="nc-submit" class="btn btn-primary" ${patients.length === 0 ? 'disabled' : ''}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="15" height="15"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <span id="nc-submit-text">Guardar Control</span>
            <span id="nc-submit-spinner" class="spinner spinner-sm hidden"></span>
          </button>
        </div>
      </form>
    `;

    container.innerHTML = Layout.wrap(session, 'admin-new-control', content);
    Layout.init();
  },

  init() {
    const weightInput = document.getElementById('nc-weight');
    const heightInput = document.getElementById('nc-height');
    const bmiInput    = document.getElementById('nc-bmi');
    const bmiBadge    = document.getElementById('nc-bmi-badge');
    const form        = document.getElementById('new-control-form');
    const errorEl     = document.getElementById('nc-error');
    const errorText   = document.getElementById('nc-error-text');
    const submitBtn   = document.getElementById('nc-submit');
    const submitText  = document.getElementById('nc-submit-text');
    const submitSpinner = document.getElementById('nc-submit-spinner');

    if (!form) return;

    /* Auto-calcular IMC */
    const calcBMI = () => {
      const w = parseFloat(weightInput?.value);
      const h = parseFloat(heightInput?.value);
      if (w > 0 && h > 0) {
        const bmi = Utils.calculateBMI(w, h);
        const cat = Utils.getBMICategory(bmi);
        bmiInput.value = bmi;
        bmiBadge.innerHTML = `<span class="badge badge-${cat.cls}">${cat.label}</span>`;
      } else {
        bmiInput.value = '';
        bmiBadge.innerHTML = '';
      }
    };

    weightInput?.addEventListener('input', calcBMI);
    heightInput?.addEventListener('input', calcBMI);

    /* Submit */
    form.addEventListener('submit', async e => {
      e.preventDefault();
      errorEl.classList.add('hidden');

      const session   = Auth.getSession();
      const patientId = document.getElementById('nc-patient')?.value;
      const date      = document.getElementById('nc-date')?.value;
      const weight    = parseFloat(document.getElementById('nc-weight')?.value);
      const height    = parseFloat(document.getElementById('nc-height')?.value);
      const fat       = parseFloat(document.getElementById('nc-fat')?.value) || null;
      const muscle    = parseFloat(document.getElementById('nc-muscle')?.value) || null;
      const waist     = parseFloat(document.getElementById('nc-waist')?.value) || null;
      const notes     = document.getElementById('nc-notes')?.value.trim() || '';
      const diet      = document.getElementById('nc-diet')?.value.trim() || '';

      /* Validaciones */
      if (!patientId) return this._showError(errorText, errorEl, 'Selecciona un paciente.');
      if (!date)      return this._showError(errorText, errorEl, 'Ingresa la fecha del control.');
      if (!weight || weight <= 0) return this._showError(errorText, errorEl, 'Ingresa un peso válido.');
      if (!height || height <= 0) return this._showError(errorText, errorEl, 'Ingresa una talla válida.');

      /* Loading */
      submitBtn.disabled = true;
      submitText.textContent = 'Guardando…';
      submitSpinner.classList.remove('hidden');

      const bmi = Utils.calculateBMI(weight, height);
      await Store.addControl({
        patientId,
        date,
        weight,
        height,
        bmi,
        fatPercentage:     fat,
        muscleMass:        muscle,
        waistCircumference: waist,
        notes,
        dietPlan:          diet,
        registeredBy:      session.userId,
      });

      Toast.success('Control registrado', `Control del ${Utils.formatDate(date)} guardado exitosamente.`);
      App.navigate(`#/admin/patients/${patientId}`);
    });
  },

  _showError(textEl, el, msg) {
    textEl.textContent = msg;
    el.classList.remove('hidden');
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  },
};
