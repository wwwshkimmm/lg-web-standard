/**
 * LG Pagination — data-lg-toggle="page" data-lg-target="N"
 */
export class LgPagination {
  constructor(root) {
    this.root = root;
    this._bindEvents();
  }
  _bindEvents() {
    this.root.querySelectorAll('[data-lg-toggle="page"]').forEach(btn => {
      btn.addEventListener('click', e => {
        if (btn.disabled || btn.classList.contains('lg-pagination__btn--active')) {
          e.preventDefault();
          return;
        }
        const page = btn.dataset.lgTarget;
        const isAjax = this.root.dataset.lgAjax === 'true';
        if (isAjax) {
          e.preventDefault();
          this.root.dispatchEvent(new CustomEvent('lg-pagination:change', {
            bubbles: true,
            detail: {
              page: Number(page)
            }
          }));
        }
      });
    });
  }
  destroy() {}
}
export function initPagination(root = document) {
  const instances = [];
  root.querySelectorAll('[data-lg-component="pagination"]').forEach(el => {
    instances.push(new LgPagination(el));
  });
  return instances;
}
export default initPagination;
//# sourceMappingURL=pagination.js.map
