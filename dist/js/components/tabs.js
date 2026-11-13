"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
exports.initTabs = initTabs;
/**
 * Tabs 컴포넌트
 * 탭 전환 및 패널 표시 제어
 */
function initTabs() {
  var root = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;
  var tabGroups = root.querySelectorAll('[data-lg-tabs]');
  tabGroups.forEach(function (group) {
    var tabs = group.querySelectorAll('.lg-tabs__tab');
    var panels = group.querySelectorAll('.lg-tabs__panel');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var targetId = tab.dataset.lgTabTarget;
        tabs.forEach(function (t) {
          t.classList.remove('lg-tabs__tab--active');
          t.setAttribute('aria-selected', 'false');
        });
        panels.forEach(function (panel) {
          panel.classList.remove('lg-tabs__panel--active');
          panel.hidden = true;
        });
        tab.classList.add('lg-tabs__tab--active');
        tab.setAttribute('aria-selected', 'true');
        var targetPanel = group.querySelector("#".concat(targetId));
        if (targetPanel) {
          targetPanel.classList.add('lg-tabs__panel--active');
          targetPanel.hidden = false;
        }
      });
    });
  });
}
var _default = exports["default"] = initTabs;
//# sourceMappingURL=tabs.js.map
