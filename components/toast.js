/* ============================================================
   NutriControl — Notificaciones Toast
   ============================================================ */
const Toast = {

  _icons: {
    success: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
    error:   `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/></svg>`,
    warning: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/></svg>`,
    info:    `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"/></svg>`,
  },

  _defaults: {
    success: 'Operación exitosa',
    error:   'Ha ocurrido un error',
    warning: 'Advertencia',
    info:    'Información',
  },

  show(type, title, message = '', duration = 4000) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const id   = Utils.generateId();
    const el   = document.createElement('div');
    el.className = `toast ${type}`;
    el.id = `toast-${id}`;
    el.setAttribute('role', 'alert');

    el.innerHTML = `
      <span class="toast-icon">${this._icons[type] ?? ''}</span>
      <div class="toast-body">
        <div class="toast-title">${Utils.escapeHtml(title)}</div>
        ${message ? `<div class="toast-message">${Utils.escapeHtml(message)}</div>` : ''}
      </div>
    `;

    container.appendChild(el);

    const remove = () => {
      el.classList.add('removing');
      el.addEventListener('animationend', () => el.remove(), { once: true });
    };

    const timer = setTimeout(remove, duration);
    el.addEventListener('click', () => { clearTimeout(timer); remove(); });
  },

  success(title, message = '') { this.show('success', title, message); },
  error(title, message = '')   { this.show('error',   title, message); },
  warning(title, message = '') { this.show('warning', title, message); },
  info(title, message = '')    { this.show('info',    title, message); },
};
