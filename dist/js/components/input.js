"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
exports.initInput = initInput;
/**
 * Input 컴포넌트
 * 유효성 검사 및 에러 메시지 표시
 */
function initInput() {
  var root = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;
  var inputs = root.querySelectorAll('[data-lg-input]');
  inputs.forEach(function (wrapper) {
    var field = wrapper.querySelector('.lg-input__field');
    var errorEl = wrapper.querySelector('.lg-input__error');
    if (!field) return;
    var validate = function validate() {
      var isRequired = field.hasAttribute('required');
      var isEmpty = field.value.trim() === '';
      var isInvalid = isRequired && isEmpty;
      field.classList.toggle('lg-input__field--error', isInvalid);
      if (errorEl) {
        errorEl.hidden = !isInvalid;
      }
      return !isInvalid;
    };
    field.addEventListener('blur', validate);
    field.addEventListener('input', function () {
      if (field.classList.contains('lg-input__field--error')) {
        validate();
      }
    });
  });
}
var _default = exports["default"] = initInput;
//# sourceMappingURL=input.js.map
