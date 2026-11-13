/**
 * 통합 가이드 페이지 전용 스크립트
 */

let toastTimer = null;
function showToast(message = '복사 완료!') {
  let toast = document.querySelector('.lg-guide__toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'lg-guide__toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('lg-guide__toast--visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('lg-guide__toast--visible');
  }, 2000);
}
function initCopyButtons() {
  document.querySelectorAll('[data-lg-copy-btn]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const targetId = btn.dataset.copyTarget;
      const codeEl = document.getElementById(targetId);
      if (!codeEl) return;
      const text = codeEl.textContent;
      try {
        await navigator.clipboard.writeText(text);
        showToast('복사 완료!');
      } catch {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('복사 완료!');
      }
    });
  });
}
function initSidebarNav() {
  const navLinks = document.querySelectorAll('[data-lg-guide-nav]');
  const sections = Array.from(document.querySelectorAll('.lg-guide__section[id]'));
  if (!sections.length || !navLinks.length) return;
  const SCROLL_OFFSET = 100;
  let clickedNavHref = null;
  function setActiveNav(href) {
    navLinks.forEach(link => {
      link.classList.toggle('lg-guide__nav-link--active', link.getAttribute('href') === href);
    });
  }
  function getActiveSectionHref() {
    const scrollLine = window.scrollY + SCROLL_OFFSET;
    for (let i = sections.length - 1; i >= 0; i--) {
      const top = sections[i].getBoundingClientRect().top + window.scrollY;
      if (top <= scrollLine) {
        return `#${sections[i].id}`;
      }
    }
    return `#${sections[0].id}`;
  }
  function enableScrollSpy() {
    clickedNavHref = null;
  }
  window.addEventListener('wheel', enableScrollSpy, {
    passive: true
  });
  window.addEventListener('touchmove', enableScrollSpy, {
    passive: true
  });
  window.addEventListener('keydown', e => {
    if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(e.key)) {
      enableScrollSpy();
    }
  });
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const target = document.querySelector(targetId);
      if (!target) return;
      clickedNavHref = targetId;
      setActiveNav(targetId);
      const scrollTop = target.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
      window.scrollTo(0, scrollTop);
      history.replaceState(null, '', targetId);
    });
  });
  window.addEventListener('scroll', () => {
    if (clickedNavHref) {
      setActiveNav(clickedNavHref);
      return;
    }
    setActiveNav(getActiveSectionHref());
  }, {
    passive: true
  });
  setActiveNav(getActiveSectionHref());
}
function initPaginationDemo() {
  const pagination = document.querySelector('[data-lg-pagination-demo]');
  const statusEl = document.getElementById('pagination-demo-status');
  if (!pagination || !statusEl) return;
  pagination.addEventListener('lg-pagination:change', e => {
    statusEl.textContent = `AJAX 페이지 전환: ${e.detail.page}페이지`;
  });
}
function initGuide() {
  initCopyButtons();
  initSidebarNav();
  initPaginationDemo();
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGuide);
} else {
  initGuide();
}
export { initGuide, showToast };
//# sourceMappingURL=guide.js.map
