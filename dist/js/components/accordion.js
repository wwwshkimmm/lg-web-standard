/**
 * LG Accordion — data-lg-toggle="accordion"
 */
export class LgAccordion {
  constructor(root) {
    this.root = root;
    this.mode = root.dataset.lgMode || 'single';
    this.items = root.querySelectorAll('[data-lg-item]');
    this._bindEvents();
  }
  _bindEvents() {
    this.items.forEach(item => {
      const trigger = item.querySelector('[data-lg-toggle="accordion"]');
      if (!trigger) return;
      trigger.addEventListener('click', () => {
        const isOpen = item.classList.contains('lg-accordion__item--open');
        if (this.mode === 'single' && !isOpen) {
          this.items.forEach(other => {
            other.classList.remove('lg-accordion__item--open');
            const t = other.querySelector('[data-lg-toggle="accordion"]');
            t?.setAttribute('aria-expanded', 'false');
          });
        }
        item.classList.toggle('lg-accordion__item--open');
        trigger.setAttribute('aria-expanded', String(item.classList.contains('lg-accordion__item--open')));
        this.root.dispatchEvent(new CustomEvent('lg-accordion:toggle', {
          bubbles: true,
          detail: {
            item,
            isOpen: item.classList.contains('lg-accordion__item--open')
          }
        }));
      });
    });
  }
  destroy() {}
}
export function initAccordion(root = document) {
  const instances = [];
  root.querySelectorAll('[data-lg-component="accordion"]').forEach(el => {
    instances.push(new LgAccordion(el));
  });
  return instances;
}
export default initAccordion;
//# sourceMappingURL=accordion.js.map
