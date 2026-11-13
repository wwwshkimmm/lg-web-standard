# Alert Case — 타이틀 + 설명

## 접근성 및 스크립트 필수 규격

- `data-id="#laypop2"` 속성을 사용하여 모달 레이어 팝업의 고유 ID를 연동한다.
- `data-control="modal"` 속성을 통해 표준 모달 제어 이벤트를 바인딩한다.
- 사내 전용 UI 라이브러리(`lgkorUi.alert`)를 호출하여 커스텀 얼럿을 실행한다.
- `typeClass: 'type2'` 규격을 적용하여 얼럿의 시각적 형태를 오류/안내 전용 스타일로 지정한다.

## HTML 코드 (DOM 구조)

```html
<!-- DOM -->
<button type="button" data-id="#laypop2" data-control="modal" class="btn"><span>Alert- 타이틀 + 설명</span></button>
```

## 스크립트(Script) 가이드

```javascript
<script>
$(function() {
  $('.btn').on('click', function(e) {
    var id = $(e.currentTarget).data('id');
    var obj = { title: '', typeClass: '', ok: function() {} };
    var desc = '';

    if (id == "#laypop2") {
      obj = $.extend(obj, { typeClass: 'type2', title: '인증이 실패했습니다.' });
      desc = '<p>자세한 사항은 1577-4090 으로<br>문의부탁드립니다.</p>';
    }
    lgkorUi.alert(desc, obj);
  });
});
</script>
```
