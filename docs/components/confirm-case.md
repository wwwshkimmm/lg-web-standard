# Confirm Case — 타이틀

## 접근성 및 스크립트 필수 규격

- `data-id="#laypop3"` 속성을 사용하여 컨펌 레이어 팝업의 고유 ID를 연동한다.
- `data-control="modal"` 속성을 통해 표준 모달 제어 이벤트를 바인딩한다.
- 사용자 선택(확인/취소) 분기 처리를 위해 사내 전용 UI 라이브러리(`lgkorUi.alert`) 객체 내에 `title` 컨디션을 동적으로 매핑한다.

## HTML 코드 (DOM 구조)

```html
<!-- DOM -->
<button type="button" data-id="#laypop3" data-control="modal" class="btn"><span>Confirm Case- 타이틀</span></button>
```

## 스크립트(Script) 가이드

```javascript
<script>
$(function() {
  $('.btn').on('click', function(e) {
    var id = $(e.currentTarget).data('id');
    var obj = { title: '', typeClass: '', ok: function() {} };
    var desc = '';

    if (id == "#laypop3") {
      obj = $.extend(obj, { title: '선택한 제품을 삭제하시겠습니까?' });
      desc = '';
    }
    lgkorUi.alert(desc, obj);
  });
});
</script>
```
