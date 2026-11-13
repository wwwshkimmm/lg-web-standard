/**
 * LG Tab — data-lg-toggle="tab" data-lg-target="panel-id"
 */
export class LgTab {
  constructor(root) {
    this.root = root;
    this.tabs = root.querySelectorAll('[data-lg-toggle="tab"]');
    this.panels = root.querySelectorAll('[data-lg-panel]');
    this._bindEvents();
  }

  _bindEvents() {
    this.tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        if (tab.disabled) return;
        this.activate(tab.dataset.lgTarget);
      });
    });
  }

  activate(targetId) {
    this.tabs.forEach((tab) => {
      const isActive = tab.dataset.lgTarget === targetId;
      tab.classList.toggle('lg-tab__btn--active', isActive);
      tab.setAttribute('aria-selected', String(isActive));
      tab.tabIndex = isActive ? 0 : -1;
    });

    this.panels.forEach((panel) => {
      const isActive = panel.dataset.lgPanel === targetId;
      panel.classList.toggle('lg-tab__panel--active', isActive);
      panel.hidden = !isActive;
    });

    this.root.dispatchEvent(
      new CustomEvent('lg-tab:change', { bubbles: true, detail: { panelId: targetId } })
    );
  }

  destroy() {}
}

export function initTab(root = document) {
  const instances = [];
  root.querySelectorAll('[data-lg-component="tab"]').forEach((el) => {
    instances.push(new LgTab(el));
  });
  return instances;
}

export default initTab;
