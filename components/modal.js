/* ============================================================
   NutriControl — Modal reutilizable
   ============================================================ */
const Modal = {

  _stack: [],

  /**
   * Abre un modal
   * @param {object} opts - { title, body, size?, confirmText?, cancelText?, onConfirm?, danger? }
   */
  open({ title, body, size = '', confirmText = 'Confirmar', cancelText = 'Cancelar', onConfirm = null, danger = false, hideFooter = false }) {
    const id = 'modal-' + Utils.generateId();

    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.id = id;

    const footerHtml = hideFooter ? '' : `
      <div class="modal__footer">
        <button class="btn btn-secondary" data-action="cancel">${Utils.escapeHtml(cancelText)}</button>
        ${onConfirm ? `<button class="btn ${danger ? 'btn-danger' : 'btn-primary'}" data-action="confirm">${Utils.escapeHtml(confirmText)}</button>` : ''}
      </div>
    `;

    backdrop.innerHTML = `
      <div class="modal ${size ? 'modal-' + size : ''}" role="dialog" aria-modal="true" aria-labelledby="${id}-title">
        <div class="modal__header">
          <h3 class="modal__title" id="${id}-title">${Utils.escapeHtml(title)}</h3>
          <button class="modal__close" data-action="close" aria-label="Cerrar">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div class="modal__body">${body}</div>
        ${footerHtml}
      </div>
    `;

    document.body.appendChild(backdrop);
    this._stack.push(id);
    document.body.style.overflow = 'hidden';

    // Eventos
    backdrop.addEventListener('click', e => {
      const action = e.target.closest('[data-action]')?.dataset.action;
      if (action === 'close' || action === 'cancel') { this.close(id); }
      if (action === 'confirm' && onConfirm) { onConfirm(id); }
      if (e.target === backdrop) { this.close(id); }
    });

    // Cerrar con ESC
    const onEsc = e => {
      if (e.key === 'Escape') { this.close(id); document.removeEventListener('keydown', onEsc); }
    };
    document.addEventListener('keydown', onEsc);

    return id;
  },

  /** Cierra un modal por id (o el último si no se indica) */
  close(id = null) {
    const targetId = id ?? this._stack[this._stack.length - 1];
    const el = document.getElementById(targetId);
    if (el) el.remove();
    this._stack = this._stack.filter(i => i !== targetId);
    if (this._stack.length === 0) document.body.style.overflow = '';
  },

  /** Cierra todos los modales abiertos */
  closeAll() {
    this._stack.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.remove();
    });
    this._stack = [];
    document.body.style.overflow = '';
  },

  /** Modal de confirmación rápida */
  confirm({ title = '¿Estás seguro?', message, confirmText = 'Eliminar', danger = true, onConfirm }) {
    return this.open({
      title,
      body: `<p style="color:var(--text-secondary)">${Utils.escapeHtml(message)}</p>`,
      confirmText,
      cancelText: 'Cancelar',
      danger,
      onConfirm,
    });
  },
};
