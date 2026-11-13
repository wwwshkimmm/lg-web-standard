# LG전자 웹 운영 표준화 — 코드 재사용 가이드라인

LG전자 웹 운영 표준화 프로젝트의 **7종 공통 UI 컴포넌트**와 **Gulp 빌드 환경**을 실무 JSP/JSTL 프로젝트에 이식·재사용하기 위한 가이드입니다.

---

## 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [로컬 개발 환경 실행 방법](#2-로컬-개발-환경-실행-방법)
3. [JSP/JSTL 환경 이관 가이드](#3-jspjstl-환경-이관-가이드)
4. [컴포넌트별 마크업 및 JSTL 예시](#4-컴포넌트별-마크업-및-jstl-예시)
5. [JavaScript 초기화 및 동적 DOM 처리](#5-javascript-초기화-및-동적-dom-처리)
6. [디렉터리 구조 참조](#6-디렉터리-구조-참조)

---

## 1. 프로젝트 개요

| 구분 | 기술 |
|------|------|
| Markup | HTML (JSP/JSTL include 대상 조각) |
| Styling | SCSS → Gulp → CSS |
| Script | Vanilla JavaScript (ES6+ 모듈) |
| 빌드 | Gulp 5 (SCSS 컴파일, JS 트랜스파일/미니파이, BrowserSync) |

### 제공 컴포넌트 7종

| # | 컴포넌트 | 스코프 클래스 | data 속성 | HTML 조각 |
|---|---------|-------------|-----------|-----------|
| 1 | GNB | `.lg-gnb` | `data-lg-gnb` | `src/components_html/gnb.html` |
| 2 | Card | `.lg-card` | `data-lg-card` | `src/components_html/card.html` |
| 3 | Modal | `.lg-modal` | `data-lg-modal` | `src/components_html/modal.html` |
| 4 | Button | `.lg-btn` | `data-lg-btn` | `src/components_html/button.html` |
| 5 | Tab | `.lg-tab` | `data-lg-tab` | `src/components_html/tab.html` |
| 6 | Accordion | `.lg-accordion` | `data-lg-accordion` | `src/components_html/accordion.html` |
| 7 | Pagination | `.lg-pagination` | `data-lg-pagination` | `src/components_html/pagination.html` |

---

## 2. 로컬 개발 환경 실행 방법

### 2-1. 사전 요구사항

- **Node.js** 18 LTS 이상 권장 (20 LTS 권장)
- **npm** 9 이상

### 2-2. 최초 설치

프로젝트 루트(`lg-web-standard/`)에서 실행합니다.

```bash
npm install
```

### 2-3. 개발 서버 실행 (`gulp dev`)

```bash
npm run dev
# 또는
npx gulp dev
```

실행 시 다음 작업이 **자동으로 연동**됩니다.

| 단계 | 동작 | 산출물 |
|------|------|--------|
| 1 | SCSS 컴파일 (소스맵 포함) | `dist/css/main.css` |
| 2 | JS 트랜스파일 (Babel, 소스맵 포함) | `dist/js/**/*.js` |
| 3 | BrowserSync 로컬 서버 기동 | `http://localhost:3000` |
| 4 | 파일 변경 감시 | SCSS/JS/HTML 저장 시 자동 반영 |

> BrowserSync UI: `http://localhost:3001`

### 2-4. 프로덕션 빌드

JSP 서버에 배포할 **압축 산출물**을 생성합니다.

```bash
npm run build
# 또는
npx gulp build
```

| 산출물 | 경로 | 설명 |
|--------|------|------|
| CSS (압축) | `dist/css/main.min.css` | clean-css 적용 |
| JS (압축) | `dist/js/**/*.js` | Babel + uglify, 폴더 구조 유지 |

### 2-5. 개별 Gulp 태스크

```bash
npx gulp compileScss   # SCSS만 컴파일
npx gulp compileJs     # JS만 트랜스파일
```

### 2-6. 퍼블리셔 작업 흐름 (권장)

```
1. src/scss/, src/components_html/ 수정
2. npm run dev 로 브라우저에서 확인
3. npm run build 로 배포용 dist/ 생성
4. dist/ 산출물 + JSP 변환본을 백엔드 프로젝트에 전달
```

---

## 3. JSP/JSTL 환경 이관 가이드

### 3-1. 이관 대상 파일

퍼블리싱 산출물에서 JSP 프로젝트로 **복사해야 할 파일**은 아래와 같습니다.

```
[퍼블 프로젝트]                    [JSP 프로젝트 (예시)]
dist/css/main.min.css       →     /webapp/resources/css/lg/main.min.css
dist/js/main.js             →     /webapp/resources/js/lg/main.js
dist/js/components/*.js     →     /webapp/resources/js/lg/components/
src/components_html/*.html  →     /webapp/WEB-INF/views/common/component/*.jsp (변환)
src/scss/                   →     (선택) 퍼블 유지보수용으로 별도 저장소 보관
```

> CSS/JS 경로는 프로젝트 표준 static 리소스 규칙에 맞게 조정하세요.

### 3-2. JSP 레이아웃에 CSS/JS 등록

공통 레이아웃 JSP(`layout.jsp` 또는 `header.jsp`)에 한 번만 등록합니다.

```jsp
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>

<%-- CSS --%>
<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/lg/main.min.css" />

<%-- JS (ES Module) --%>
<script type="module" src="${pageContext.request.contextPath}/resources/js/lg/main.js"></script>
```

> `main.js`는 ES Module(`import/export`) 구조입니다. 반드시 `type="module"`로 로드해야 합니다.  
> 구형 브라우저 대응이 필요하면 Webpack/Rollup 등으로 번들링 후 단일 파일로 교체하세요.

### 3-3. HTML 조각 → JSP 파일 분리 전략

`src/components_html/`의 HTML 조각은 **페이지 단위가 아닌 컴포넌트 단위 JSP**로 변환합니다.

#### 권장 JSP 디렉터리 구조 (예시)

```
WEB-INF/views/
└── common/
    └── component/
        ├── gnb.jsp
        ├── card.jsp
        ├── modal.jsp
        ├── button.jsp
        ├── tab.jsp
        ├── accordion.jsp
        └── pagination.jsp
```

#### Include 방식 선택 가이드

| 방식 | 사용 시점 | 예시 |
|------|----------|------|
| `<jsp:include>` | 같은 WAR 내 JSP, request 파라미터 전달 | `<jsp:include page="/WEB-INF/views/common/component/card.jsp"><jsp:param name="cardId" value="1"/></jsp:include>` |
| `<c:import>` | 다른 컨텍스트/외부 리소스 포함 | `<c:import url="/common/component/gnb.jsp"/>` |
| 커스텀 태그 | 반복 사용·파라미터가 많을 때 | `<lg:card item="${card}"/>` |

#### JSP 변환 체크리스트

- [ ] HTML 주석의 JSTL 가상 코드를 실제 `<c:forEach>`, `<c:if>` 태그로 교체
- [ ] `${pageContext.request.contextPath}` 로 context path 처리
- [ ] 이미지/링크 URL을 서버 EL(`${...}`)로 치환
- [ ] `data-lg-*` 속성과 BEM 클래스명은 **변경하지 않음** (JS/CSS 연동 유지)
- [ ] JSP 상단에 `<%@ taglib prefix="c" uri="jakarta.tags.core" %>` 선언

#### 페이지에서 컴포넌트 조합 예시

```jsp
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ include file="/WEB-INF/views/common/layout/header.jsp" %>

<%-- GNB: Controller에서 gnbMenuList 모델 주입 --%>
<jsp:include page="/WEB-INF/views/common/component/gnb.jsp" />

<main>
  <%-- Card 목록 --%>
  <div class="product-grid">
    <c:forEach var="card" items="${productList}">
      <jsp:include page="/WEB-INF/views/common/component/card.jsp">
        <jsp:param name="cardData" value="${card}" />
      </jsp:include>
    </c:forEach>
  </div>

  <%-- Pagination --%>
  <jsp:include page="/WEB-INF/views/common/component/pagination.jsp" />
</main>

<%@ include file="/WEB-INF/views/common/layout/footer.jsp" %>
```

> `jsp:param`으로 객체를 직접 넘기기 어려운 경우, Controller에서 `request.setAttribute()`로 모델을 주입하는 방식을 사용하세요.

---

## 4. 컴포넌트별 마크업 및 JSTL 예시

### 4-1. GNB (메인 내비게이션)

#### 정적 HTML 마크업 (핵심 구조)

```html
<header class="lg-gnb" data-lg-gnb role="banner">
  <div class="lg-gnb__inner">
    <div class="lg-gnb__logo">
      <a href="/">LG</a>
    </div>
    <nav class="lg-gnb__nav" aria-label="메인 메뉴">
      <ul class="lg-gnb__list" role="menubar">
        <!-- Depth 1 -->
        <li class="lg-gnb__item" role="none">
          <a href="/products" class="lg-gnb__link" role="menuitem">제품</a>
          <!-- Depth 2 -->
          <ul class="lg-gnb__sub" role="menu">
            <li class="lg-gnb__sub-item" role="none">
              <a href="/products/tv" class="lg-gnb__sub-link" role="menuitem">TV/오디오</a>
              <!-- Depth 3 -->
              <ul class="lg-gnb__depth3" role="menu">
                <li role="none">
                  <a href="/products/tv/oled" class="lg-gnb__depth3-link" role="menuitem">OLED</a>
                </li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
    <button type="button" class="lg-gnb__mobile-toggle" data-lg-gnb-toggle aria-expanded="false">☰</button>
  </div>
  <div class="lg-gnb__dim" data-lg-gnb-dim></div>
  <div class="lg-gnb__mobile-panel" data-lg-gnb-mobile><!-- 모바일 메뉴 --></div>
</header>
```

#### JSTL 적용 가상 코드 (Depth 1~3 루프)

**Controller 모델 예시**

```java
// gnbMenuList: List<GnbMenuVO>
// GnbMenuVO: menuId, menuName, menuUrl, currentYn, children (List<GnbMenuVO>)
request.setAttribute("gnbMenuList", menuService.getGnbMenuList());
```

**gnb.jsp**

```jsp
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>

<header class="lg-gnb" data-lg-gnb role="banner">
  <div class="lg-gnb__inner">
    <div class="lg-gnb__logo">
      <a href="${pageContext.request.contextPath}/">LG</a>
    </div>

    <nav class="lg-gnb__nav" aria-label="메인 메뉴">
      <ul class="lg-gnb__list" role="menubar">
        <c:forEach var="menu" items="${gnbMenuList}">
          <li class="lg-gnb__item${menu.currentYn eq 'Y' ? ' lg-gnb__item--active' : ''}" role="none">
            <a href="${menu.menuUrl}"
               class="lg-gnb__link${menu.currentYn eq 'Y' ? ' lg-gnb__link--current' : ''}"
               role="menuitem">${menu.menuName}</a>

            <c:if test="${not empty menu.children}">
              <ul class="lg-gnb__sub" role="menu">
                <c:forEach var="sub" items="${menu.children}">
                  <li class="lg-gnb__sub-item${sub.currentYn eq 'Y' ? ' lg-gnb__sub-item--active' : ''}" role="none">
                    <a href="${sub.menuUrl}" class="lg-gnb__sub-link" role="menuitem">${sub.menuName}</a>

                    <c:if test="${not empty sub.children}">
                      <ul class="lg-gnb__depth3" role="menu">
                        <c:forEach var="depth3" items="${sub.children}">
                          <li role="none">
                            <a href="${depth3.menuUrl}" class="lg-gnb__depth3-link" role="menuitem">${depth3.menuName}</a>
                          </li>
                        </c:forEach>
                      </ul>
                    </c:if>
                  </li>
                </c:forEach>
              </ul>
            </c:if>
          </li>
        </c:forEach>
      </ul>
    </nav>

    <button type="button" class="lg-gnb__mobile-toggle" data-lg-gnb-toggle aria-expanded="false" aria-label="메뉴 열기">
      <span aria-hidden="true">&#9776;</span>
    </button>
  </div>

  <div class="lg-gnb__dim" data-lg-gnb-dim></div>
  <div class="lg-gnb__mobile-panel" data-lg-gnb-mobile>
    <ul class="lg-gnb__mobile-list">
      <c:forEach var="menu" items="${gnbMenuList}">
        <li class="lg-gnb__mobile-item">
          <c:choose>
            <c:when test="${not empty menu.children}">
              <button type="button" class="lg-gnb__mobile-link" data-lg-gnb-accordion aria-expanded="false">
                ${menu.menuName} <span aria-hidden="true">&#9660;</span>
              </button>
              <ul class="lg-gnb__mobile-sub">
                <c:forEach var="sub" items="${menu.children}">
                  <li><a href="${sub.menuUrl}" class="lg-gnb__mobile-sub-link">${sub.menuName}</a></li>
                </c:forEach>
              </ul>
            </c:when>
            <c:otherwise>
              <a href="${menu.menuUrl}" class="lg-gnb__mobile-link">${menu.menuName}</a>
            </c:otherwise>
          </c:choose>
        </li>
      </c:forEach>
    </ul>
  </div>
</header>
```

---

### 4-2. Card (이미지·텍스트·버튼 세트)

#### 정적 HTML 마크업 (영역 분리)

```html
<article class="lg-card" data-lg-card>
  <!-- [영역 A] 이미지: 데이터 없으면 통째로 omit -->
  <div class="lg-card__media">
    <img src="/images/product.jpg" alt="제품명" loading="lazy" />
    <span class="lg-card__badge">NEW</span>
  </div>

  <div class="lg-card__body">
    <!-- [영역 B] 텍스트 -->
    <p class="lg-card__eyebrow">프리미엄</p>
    <h3 class="lg-card__title">LG OLED evo TV</h3>
    <p class="lg-card__desc">제품 설명 텍스트</p>

    <!-- [영역 C] 버튼 -->
    <div class="lg-card__actions">
      <a href="/detail" class="lg-btn lg-btn--primary lg-btn--md" data-lg-btn>자세히 보기</a>
      <a href="/compare" class="lg-btn lg-btn--outline lg-btn--md" data-lg-btn>비교하기</a>
    </div>
  </div>
</article>
```

#### JSTL 적용 가상 코드 (조건부 영역 렌더링)

**Controller 모델 예시**

```java
// productList: List<CardVO>
// CardVO: imageUrl, imageAlt, badgeText, eyebrow, title, description,
//         primaryBtnUrl, primaryBtnText, secondaryBtnUrl, secondaryBtnText
request.setAttribute("productList", productService.getList());
```

**card.jsp (단일 카드)**

```jsp
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>

<%-- card 변수는 forEach var 또는 request attribute로 전달 --%>

<article class="lg-card" data-lg-card>
  <%-- 영역 A: 이미지 --%>
  <c:if test="${not empty card.imageUrl}">
    <div class="lg-card__media">
      <img src="${card.imageUrl}" alt="${card.imageAlt}" loading="lazy" />
      <c:if test="${not empty card.badgeText}">
        <span class="lg-card__badge">${card.badgeText}</span>
      </c:if>
    </div>
  </c:if>

  <div class="lg-card__body">
    <c:if test="${not empty card.eyebrow}">
      <p class="lg-card__eyebrow">${card.eyebrow}</p>
    </c:if>
    <c:if test="${not empty card.title}">
      <h3 class="lg-card__title">${card.title}</h3>
    </c:if>
    <c:if test="${not empty card.description}">
      <p class="lg-card__desc">${card.description}</p>
    </c:if>

    <%-- 영역 C: 버튼 (하나라도 있을 때만 wrapper 출력) --%>
    <c:if test="${not empty card.primaryBtnUrl or not empty card.secondaryBtnUrl}">
      <div class="lg-card__actions">
        <c:if test="${not empty card.primaryBtnUrl}">
          <a href="${card.primaryBtnUrl}" class="lg-btn lg-btn--primary lg-btn--md" data-lg-btn>
            ${card.primaryBtnText}
          </a>
        </c:if>
        <c:if test="${not empty card.secondaryBtnUrl}">
          <a href="${card.secondaryBtnUrl}" class="lg-btn lg-btn--outline lg-btn--md" data-lg-btn>
            ${card.secondaryBtnText}
          </a>
        </c:if>
      </div>
    </c:if>
  </div>
</article>
```

**목록 페이지에서 Card 반복**

```jsp
<div class="product-grid">
  <c:forEach var="card" items="${productList}">
    <jsp:include page="/WEB-INF/views/common/component/card.jsp" />
  </c:forEach>
</div>
```

---

### 4-3. Pagination (페이지네이션)

#### 정적 HTML 마크업

```html
<nav class="lg-pagination" data-lg-pagination aria-label="페이지 네비게이션">
  <ul class="lg-pagination__list">
    <li class="lg-pagination__item">
      <a href="?page=1" class="lg-pagination__btn lg-pagination__btn--prev" data-lg-page-btn="1">이전</a>
    </li>
    <li class="lg-pagination__item">
      <button type="button" class="lg-pagination__btn lg-pagination__btn--active" aria-current="page">1</button>
    </li>
    <li class="lg-pagination__item">
      <a href="?page=2" class="lg-pagination__btn" data-lg-page-btn="2">2</a>
    </li>
    <li class="lg-pagination__item">
      <span class="lg-pagination__ellipsis" aria-hidden="true">&hellip;</span>
    </li>
    <li class="lg-pagination__item">
      <a href="?page=2" class="lg-pagination__btn lg-pagination__btn--next" data-lg-page-btn="2">다음</a>
    </li>
  </ul>
</nav>
```

#### JSTL 적용 가상 코드

**Controller 모델 예시**

```java
// currentPage, totalPages, pageList (List<PageVO>)
// PageVO: pageNum, activeYn, type ("page" | "ellipsis")
// prevDisabledYn, nextDisabledYn, baseUrl
PaginationVO pagination = paginationService.build(currentPage, totalPages, baseUrl);
request.setAttribute("pagination", pagination);
```

**pagination.jsp**

```jsp
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>

<nav class="lg-pagination" data-lg-pagination aria-label="페이지 네비게이션"
     <c:if test="${pagination.ajaxYn eq 'Y'}">data-lg-pagination-ajax="true"</c:if>>
  <ul class="lg-pagination__list">

    <%-- 이전 --%>
    <li class="lg-pagination__item">
      <c:choose>
        <c:when test="${pagination.prevDisabledYn eq 'Y'}">
          <button type="button" class="lg-pagination__btn lg-pagination__btn--prev" disabled aria-label="이전 페이지">이전</button>
        </c:when>
        <c:otherwise>
          <a href="${pagination.baseUrl}${pagination.currentPage - 1}"
             class="lg-pagination__btn lg-pagination__btn--prev"
             data-lg-page-btn="${pagination.currentPage - 1}" aria-label="이전 페이지">이전</a>
        </c:otherwise>
      </c:choose>
    </li>

    <%-- 페이지 번호 --%>
    <c:forEach var="page" items="${pagination.pageList}">
      <li class="lg-pagination__item">
        <c:choose>
          <c:when test="${page.type eq 'ellipsis'}">
            <span class="lg-pagination__ellipsis" aria-hidden="true">&hellip;</span>
          </c:when>
          <c:when test="${page.activeYn eq 'Y'}">
            <button type="button" class="lg-pagination__btn lg-pagination__btn--active"
                    data-lg-page-btn="${page.pageNum}" aria-current="page"
                    aria-label="현재 페이지 ${page.pageNum}">${page.pageNum}</button>
          </c:when>
          <c:otherwise>
            <a href="${pagination.baseUrl}${page.pageNum}"
               class="lg-pagination__btn"
               data-lg-page-btn="${page.pageNum}"
               aria-label="페이지 ${page.pageNum}">${page.pageNum}</a>
          </c:otherwise>
        </c:choose>
      </li>
    </c:forEach>

    <%-- 다음 --%>
    <li class="lg-pagination__item">
      <c:choose>
        <c:when test="${pagination.nextDisabledYn eq 'Y'}">
          <button type="button" class="lg-pagination__btn lg-pagination__btn--next" disabled aria-label="다음 페이지">다음</button>
        </c:when>
        <c:otherwise>
          <a href="${pagination.baseUrl}${pagination.currentPage + 1}"
             class="lg-pagination__btn lg-pagination__btn--next"
             data-lg-page-btn="${pagination.currentPage + 1}" aria-label="다음 페이지">다음</a>
        </c:otherwise>
      </c:choose>
    </li>
  </ul>
</nav>
```

---

### 4-4. 기타 컴포넌트 (요약)

상세 HTML/JSTL 가이드는 `src/components_html/` 원본 파일을 참조하세요.

| 컴포넌트 | 핵심 data 속성 | JSTL 포인트 |
|---------|---------------|------------|
| **Modal** | `data-lg-modal`, `data-lg-modal-open="{id}"` | `id` 속성 필수, 본문은 `jsp:include`로 분리 |
| **Button** | `data-lg-btn`, `data-lg-btn-action` | `c:set`으로 variant/size 클래스 조합 |
| **Tab** | `data-lg-tab`, `data-lg-tab-btn`, `data-lg-tab-panel` | `tabList` forEach, `activeYn`으로 초기 탭 지정 |
| **Accordion** | `data-lg-accordion`, `data-lg-accordion-item` | `faqList` forEach, `openYn`으로 초기 펼침 |

---

## 5. JavaScript 초기화 및 동적 DOM 처리

### 5-1. 자동 초기화 (기본)

`dist/js/main.js`를 `type="module"`로 로드하면 **DOMContentLoaded** 시점에 모든 컴포넌트가 자동 초기화됩니다.

```jsp
<script type="module" src="${pageContext.request.contextPath}/resources/js/lg/main.js"></script>
```

`main.js` 내부 동작:

```javascript
function initApp() {
  initGnb();        // [data-lg-gnb]
  initCard();       // [data-lg-card]
  initModal();      // [data-lg-modal]
  initButton();     // [data-lg-btn]
  initTab();        // [data-lg-tab]
  initAccordion();  // [data-lg-accordion]
  initPagination(); // [data-lg-pagination]
}
```

각 `init*` 함수는 페이지 내 해당 `data-lg-*` 요소마다 **독립 Class 인스턴스**를 생성하므로, 동일 컴포넌트가 여러 개 있어도 서로 충돌하지 않습니다.

### 5-2. 개별 컴포넌트 초기화

특정 영역만 초기화하려면 **컨테이너 요소를 root 인자로 전달**합니다.

```javascript
import { initTab } from './components/tab.js';
import { initPagination } from './components/pagination.js';

const ajaxResult = document.getElementById('ajax-result');
initTab(ajaxResult);
initPagination(ajaxResult);
```

### 5-3. AJAX / 동적 HTML 삽입 후 재초기화

AJAX로 HTML을 삽입한 경우, **삽입된 DOM subtree만** 대상으로 init 함수를 호출합니다.

```javascript
import initTab from './components/tab.js';
import initAccordion from './components/accordion.js';
import initPagination from './components/pagination.js';
import initModal from './components/modal.js';
import initButton from './components/button.js';

async function loadContent(url, targetId) {
  const response = await fetch(url);
  const html = await response.text();
  const container = document.getElementById(targetId);
  container.innerHTML = html;

  // ✅ 삽입된 영역만 초기화 (권장)
  initTab(container);
  initAccordion(container);
  initPagination(container);
  initModal(container);
  initButton(container);
}

// AJAX Pagination 이벤트 수신 예시
document.addEventListener('lg-pagination:change', (e) => {
  const page = e.detail.page;
  loadContent(`/api/list?page=${page}`, 'list-area');
});
```

#### ⚠️ 주의: 이중 바인딩 방지

| 방법 | 설명 |
|------|------|
| ✅ **권장** | 새로 삽입된 `container`만 init 함수에 전달 |
| ❌ **지양** | `initApp()`을 동일 페이지에서 반복 호출 (이벤트 중복 바인딩 발생) |
| ✅ **대안** | DOM 교체 시 `innerHTML`로 기존 노드를 완전히 제거한 뒤 새 subtree init |

이미 초기화된 요소를 다시 init하지 않도록, 삽입 전 컨테이너를 비우거나(`innerHTML = ''`) 새 wrapper 요소를 생성하는 패턴을 사용하세요.

### 5-4. 커스텀 이벤트 훅

컴포넌트는 비즈니스 로직과 분리하기 위해 **CustomEvent**를 발행합니다.

| 이벤트명 | 발생 컴포넌트 | detail |
|---------|-------------|--------|
| `lg-btn:action` | Button | `{ action }` |
| `lg-modal:open` | Modal | — |
| `lg-modal:close` | Modal | — |
| `lg-tab:change` | Tab | `{ panelId }` |
| `lg-accordion:toggle` | Accordion | `{ item, isOpen }` |
| `lg-pagination:change` | Pagination (AJAX 모드) | `{ page }` |

```javascript
// 버튼 action 처리
document.addEventListener('lg-btn:action', (e) => {
  if (e.detail.action === 'submit') {
    // 폼 제출 로직
  }
});

// AJAX 페이징 (data-lg-pagination-ajax="true" 필요)
document.addEventListener('lg-pagination:change', (e) => {
  loadContent(`/list?page=${e.detail.page}`, 'list-container');
});
```

### 5-5. Button loading 상태 (API 예시)

```javascript
import { LgButton } from './components/button.js';

const btn = document.querySelector('[data-lg-btn-action="submit"]');
const lgBtn = new LgButton(btn);

lgBtn.setLoading(true);   // 로딩 시작
// ... API 호출 ...
lgBtn.setLoading(false);  // 로딩 종료
```

### 5-6. Modal 프로그래밍 방식 제어

```javascript
import { LgModal } from './components/modal.js';

const modal = new LgModal(document.getElementById('lg-modal-sample'));
modal.open();
modal.close();
```

---

## 6. 디렉터리 구조 참조

```
lg-web-standard/
├── gulpfile.js                 # Gulp 빌드 설정
├── package.json
├── index.html                  # 로컬 컴포넌트 프리뷰
├── README.md                   # 본 가이드
├── src/
│   ├── scss/
│   │   ├── abstracts/
│   │   │   └── _variables.scss # LG 브랜드 CSS 변수
│   │   ├── components/         # 컴포넌트별 SCSS (7종)
│   │   └── main.scss           # SCSS 엔트리
│   ├── js/
│   │   ├── components/         # 컴포넌트별 JS (7종, Class 기반)
│   │   └── main.js             # JS 엔트리 (자동 초기화)
│   └── components_html/        # JSP 변환용 HTML 조각 (7종)
└── dist/                       # 빌드 산출물 (배포 대상)
    ├── css/
    │   ├── main.css            # 개발용
    │   └── main.min.css        # 배포용
    └── js/
        ├── main.js
        └── components/
```

---

## 부록: 브랜드 CSS 변수

`_variables.scss`에 정의된 LG 공식 컬러입니다. JSP 환경에서도 `main.min.css` 로드 시 전역 사용 가능합니다.

```css
:root {
  --brand-active-red: #FD312E;
  --brand-heritage-red: #A50034;
  --text-primary: #222222;
  --text-secondary: #666666;
  --text-disabled: #999999;
}
```

---

> **문의/수정**  
> 컴포넌트 추가·변경 시 `src/scss/components/`, `src/js/components/`, `src/components_html/` 3곳을 함께 수정하고 `npm run build` 후 dist 산출물을 JSP 프로젝트에 재배포하세요.
