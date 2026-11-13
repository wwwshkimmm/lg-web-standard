/**
 * LG GNB — data-lg-toggle="gnb-menu" / data-lg-toggle="gnb-sub"
 */
export class LgGnb {
  constructor(root) {
    this.root = root;
    this.mobileToggle = root.querySelector('[data-lg-toggle="gnb-menu"]');
    this.mobilePanel = root.querySelector('[data-lg-target="gnb-mobile"]');
    this.dim = root.querySelector('[data-lg-target="gnb-dim"]');
    this._bindEvents();
  }

  _bindEvents() {
    if (this.mobileToggle) {
      this.mobileToggle.addEventListener('click', () => this._toggleMobile());
    }

    if (this.dim) {
      this.dim.addEventListener('click', () => this._closeMobile());
    }

    this.root.querySelectorAll('[data-lg-toggle="gnb-sub"]').forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const sub = trigger.nextElementSibling;
        if (sub) {
          sub.classList.toggle('lg-gnb__mobile-sub--open');
          trigger.setAttribute('aria-expanded', String(sub.classList.contains('lg-gnb__mobile-sub--open')));
        }
      });
    });
  }

  _toggleMobile() {
    const isOpen = this.mobilePanel?.classList.toggle('lg-gnb__mobile-panel--open');
    this.dim?.classList.toggle('lg-gnb__dim--visible', isOpen);
    this.mobileToggle?.setAttribute('aria-expanded', String(!!isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  _closeMobile() {
    this.mobilePanel?.classList.remove('lg-gnb__mobile-panel--open');
    this.dim?.classList.remove('lg-gnb__dim--visible');
    this.mobileToggle?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  destroy() {
    this._closeMobile();
  }
}

export function initGnb(root = document) {
  const instances = [];
  root.querySelectorAll('[data-lg-component="gnb"]').forEach((el) => {
    instances.push(new LgGnb(el));
  });
  return instances;
}

export default initGnb;
