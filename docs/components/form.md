# Form (입력 양식)

## 접근성 및 마크업 필수 규격

- **필수 입력 표시**: 필수 입력 항목 레이블 뒤에 `*` 마킹. 스크린리더 인지를 위해 `<span class="lg-form__required" aria-hidden="true">*</span>` 및 `<span class="lg-form__sr-only">(필수)</span>` 병행.
- **오류/유효성 메시지**: `.lg-form__error-msg`에 `role="alert"` · `aria-live="assertive"` 적용.
- **인라인 레이아웃**: Text Input + 버튼 조합은 `.lg-form__inline` 사용.
- **다중 필드 행**: 생년월일·카드번호 등은 `.lg-form__grid` (`.lg-form__grid--3`, `--4`)로 Flex/Grid 일관성 유지.

## HTML 코드 (표준 DOM 템플릿)

`src/components_html/form.html` 참조.

## JSTL 및 유효성 검사(Validation) 가이드

- 서버: `<c:out value="${formData.userName}"/>` 등 EL 바인딩.
- 클라이언트: `data-lg-component="form"` 초기화 시 누락 필드에 `aria-invalid="true"` 및 `.lg-form__error-msg` 노출.

`src/js/components/form.js` 참조.
