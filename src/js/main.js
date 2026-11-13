import initGnb from './components/gnb.js';
import initCard from './components/card.js';
import initModal from './components/modal.js';
import initButton from './components/button.js';
import initTab from './components/tab.js';
import initAccordion from './components/accordion.js';
import initPagination from './components/pagination.js';
import initForm from './components/form.js';

/**
 * LG전자 웹 운영 표준화 - 메인 엔트리
 * 각 컴포넌트는 독립 Class 인스턴스로 초기화됩니다.
 */
function initApp() {
  initGnb();
  initCard();
  initModal();
  initButton();
  initTab();
  initAccordion();
  initPagination();
  initForm();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

export { initApp };
