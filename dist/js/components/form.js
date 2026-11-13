/**
 * Form — 유효성 검사 및 aria-invalid 바인딩
 */
const MESSAGES = {
  userName: '이름을 입력해 주세요.',
  phone: '휴대폰 번호를 입력해 주세요.',
  purchaseDate: '구입일자를 선택해 주세요.'
};
function getGroup(field) {
  return field.closest('.lg-form__group');
}
function getErrorEl(group) {
  return group ? group.querySelector('.lg-form__error-msg') : null;
}
function setFieldError(field, message) {
  const group = getGroup(field);
  const errorEl = getErrorEl(group);
  if (!field || !errorEl) return;
  field.setAttribute('aria-invalid', 'true');
  errorEl.textContent = message;
  errorEl.hidden = false;
}
function clearFieldError(field) {
  const group = getGroup(field);
  const errorEl = getErrorEl(group);
  if (!field) return;
  field.removeAttribute('aria-invalid');
  if (errorEl) {
    errorEl.textContent = '';
    errorEl.hidden = true;
  }
}
function validatePurchaseDate(form) {
  const year = form.querySelector('[name="purchaseYear"]');
  const month = form.querySelector('[name="purchaseMonth"]');
  const day = form.querySelector('[name="purchaseDay"]');
  const group = year ? getGroup(year) : null;
  const isValid = year?.value && month?.value && day?.value;
  if (isValid) {
    [year, month, day].forEach(clearFieldError);
    return true;
  }
  const errorEl = getErrorEl(group);
  [year, month, day].forEach(el => el?.setAttribute('aria-invalid', 'true'));
  if (errorEl) {
    errorEl.textContent = MESSAGES.purchaseDate;
    errorEl.hidden = false;
  }
  return false;
}
function validateForm(form) {
  let valid = true;
  const userName = form.querySelector('[name="userName"]');
  const phone = form.querySelector('[name="phone"]');
  if (!userName?.value.trim()) {
    setFieldError(userName, MESSAGES.userName);
    valid = false;
  } else {
    clearFieldError(userName);
  }
  if (!phone?.value.trim()) {
    setFieldError(phone, MESSAGES.phone);
    valid = false;
  } else {
    clearFieldError(phone);
  }
  if (!validatePurchaseDate(form)) {
    valid = false;
  }
  return valid;
}
function bindForm(form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!validateForm(form)) {
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      firstInvalid?.focus();
    }
  });
  form.querySelectorAll('.lg-form__input, .lg-form__select').forEach(field => {
    field.addEventListener('input', () => clearFieldError(field));
    field.addEventListener('change', () => clearFieldError(field));
  });
}
export default function initForm() {
  document.querySelectorAll('[data-lg-component="form"]').forEach(bindForm);
}
//# sourceMappingURL=form.js.map
