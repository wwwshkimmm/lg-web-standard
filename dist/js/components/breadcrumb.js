"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
exports.initBreadcrumb = initBreadcrumb;
/**
 * Breadcrumb 컴포넌트
 * 현재 페이지 항목 하이라이트 처리
 */
function initBreadcrumb() {
  var root = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;
  var breadcrumbs = root.querySelectorAll('[data-lg-breadcrumb]');
  breadcrumbs.forEach(function (breadcrumb) {
    var currentPath = breadcrumb.dataset.lgBreadcrumbCurrent;
    if (!currentPath) return;
    var items = breadcrumb.querySelectorAll('.lg-breadcrumb__item');
    items.forEach(function (item) {
      var link = item.querySelector('.lg-breadcrumb__link');
      if (link && link.getAttribute('href') === currentPath) {
        item.classList.add('lg-breadcrumb__item--current');
        link.removeAttribute('href');
        link.setAttribute('aria-current', 'page');
      }
    });
  });
}
var _default = exports["default"] = initBreadcrumb;
//# sourceMappingURL=breadcrumb.js.map
