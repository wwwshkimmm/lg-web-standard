/**
 * LG Modal — data-lg-toggle="modal" / data-lg-toggle="modal-close"
 */
export class LgModal {
  constructor(root) {
    this.root = root;
    this.id = root.id;
    this.isDialog = root.tagName === 'DIALOG';
    this._onKeydown = this._handleKeydown.bind(this);
    this._bindTriggers();
    this._bindClose();
  }
  _bindTriggers() {
    if (!this.id) return;
    document.querySelectorAll(`[data-lg-toggle="modal"][data-lg-target="#${this.id}"]`).forEach(trigger => {
      trigger.addEventListener('click', e => {
        e.preventDefault();
        this.open();
      });
    });
  }
  _bindClose() {
    this.root.querySelectorAll('[data-lg-toggle="modal-close"]').forEach(btn => {
      btn.addEventListener('click', () => this.close());
    });
    if (this.isDialog) {
      this.root.addEventListener('click', e => {
        if (e.target === this.root) this.close();
      });
    }
  }
  _handleKeydown(e) {
    if (e.key === 'Escape') this.close();
  }
  open() {
    if (this.isDialog && typeof this.root.showModal === 'function') {
      this.root.showModal();
    } else {
      this.root.closest('.lg-modal-wrap')?.classList.add('lg-modal-wrap--visible');
      document.querySelector(`[data-lg-target="#${this.id}"][data-lg-toggle="modal-dim"]`)?.classList.add('lg-modal-dim--visible');
    }
    document.addEventListener('keydown', this._onKeydown);
    this.root.dispatchEvent(new CustomEvent('lg-modal:open', {
      bubbles: true
    }));
  }
  close() {
    if (this.isDialog && this.root.open) {
      this.root.close();
    } else {
      this.root.closest('.lg-modal-wrap')?.classList.remove('lg-modal-wrap--visible');
      document.querySelector(`[data-lg-target="#${this.id}"][data-lg-toggle="modal-dim"]`)?.classList.remove('lg-modal-dim--visible');
    }
    document.removeEventListener('keydown', this._onKeydown);
    this.root.dispatchEvent(new CustomEvent('lg-modal:close', {
      bubbles: true
    }));
  }
  destroy() {
    document.removeEventListener('keydown', this._onKeydown);
  }
}
export function initModal(root = document) {
  const instances = [];
  root.querySelectorAll('[data-lg-component="modal"]').forEach(el => {
    instances.push(new LgModal(el));
  });
  return instances;
}
export default initModal;
//# sourceMappingURL=modal.js.map
