/**
 * LG Button — data-lg-action
 */
export class LgButton {
  constructor(root) {
    this.root = root;
    this._bindClick();
  }
  _bindClick() {
    const action = this.root.dataset.lgAction;
    if (!action) return;
    this.root.addEventListener('click', e => {
      if (this.root.disabled || this.root.classList.contains('lg-btn--loading')) {
        e.preventDefault();
        return;
      }
      this.root.dispatchEvent(new CustomEvent('lg-btn:action', {
        bubbles: true,
        detail: {
          action
        }
      }));
    });
  }
  setLoading(isLoading) {
    this.root.classList.toggle('lg-btn--loading', isLoading);
    this.root.disabled = isLoading;
    if (isLoading) {
      this.root.setAttribute('aria-busy', 'true');
    } else {
      this.root.removeAttribute('aria-busy');
    }
  }
  destroy() {
    this.setLoading(false);
  }
}
export function initButton(root = document) {
  const instances = [];
  root.querySelectorAll('[data-lg-component="button"]').forEach(el => {
    instances.push(new LgButton(el));
  });
  return instances;
}
export default initButton;
//# sourceMappingURL=button.js.map
