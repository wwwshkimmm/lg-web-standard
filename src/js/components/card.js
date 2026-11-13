/**
 * LG Card — data-lg-component="card"
 */
export class LgCard {
  constructor(root) {
    this.root = root;
    this._initLazyImage();
  }

  _initLazyImage() {
    const img = this.root.querySelector('[data-lg-lazy]');
    if (!img || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const src = img.dataset.lgLazy;
          if (src) {
            img.src = src;
            img.removeAttribute('data-lg-lazy');
          }
          observer.unobserve(img);
        }
      });
    });

    observer.observe(img);
    this._observer = observer;
  }

  destroy() {
    this._observer?.disconnect();
  }
}

export function initCard(root = document) {
  const instances = [];
  root.querySelectorAll('[data-lg-component="card"]').forEach((el) => {
    instances.push(new LgCard(el));
  });
  return instances;
}

export default initCard;
