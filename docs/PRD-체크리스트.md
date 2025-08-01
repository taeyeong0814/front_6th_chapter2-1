# 장바구니 프로젝트 PRD 기반 체크리스트

| 구분     | 체크 항목                                       | 완료 여부 |
| -------- | ----------------------------------------------- | :-------: |
| 상품     | 상품 목록/가격/재고/할인율 PRD와 일치           |    [x]    |
| 상품     | 재고 5개 미만 "재고 부족" 표시                  |    [x]    |
| 상품     | 재고 0개 "품절" 표시 및 선택 불가               |    [x]    |
| 상품     | 전체 재고 50개 미만 드롭다운 테두리 색상 변경   |    [x]    |
| 할인     | 개별 상품 10개 이상 구매 시 할인율 적용         |    [x]    |
| 할인     | 할인된 상품 굵은 글씨 표시                      |    [x]    |
| 할인     | 전체 수량 30개 이상 25% 할인(더 큰 할인만 적용) |    [x]    |
| 할인     | 화요일 10% 추가 할인(중복 가능)                 |    [x]    |
| 할인     | 번개세일(⚡) 20% 할인, 드롭다운/알림 표시       |    [x]    |
| 할인     | 추천할인(💝) 5% 할인, 드롭다운/알림 표시        |    [x]    |
| 할인     | 번개+추천 동시 25% SUPER SALE                   |    [x]    |
| 포인트   | 결제금액 0.1% 포인트 적립                       |    [x]    |
| 포인트   | 화요일 2배, 세트/수량별 보너스                  |    [x]    |
| 포인트   | 포인트 실시간 계산/내역 표시                    |    [x]    |
| UI/UX    | 반응형 레이아웃, 각 영역 UI 구현                |    [x]    |
| UI/UX    | 할인/포인트/재고 상태 실시간 UI 반영            |    [x]    |
| UI/UX    | 버튼/모달/애니메이션 효과                       |    [x]    |
| UI/UX    | 시맨틱 HTML, aria-label, 키보드 네비 지원       |    [x]    |
| 기능     | 상품 추가/수량 변경/제거/재고 복구              |    [x]    |
| 기능     | 실시간 계산, 할인/포인트 자동 적용              |    [x]    |
| 기능     | 장바구니 상품 수, 재고 상태, 마지막 선택 표시   |    [x]    |
| 예외     | 재고 부족/초과/빈 장바구니/동시성 처리          |    [x]    |
| 기술     | 클라이언트 계산, 실시간 부드러운 전환           |    [x]    |
| 기술     | ES6+, Tailwind CSS, 커스텀 유틸리티             |    [x]    |
| 테스트   | 모든 요구사항 테스트/수동 검증                  |    [x]    |
| 리팩토링 | 변수명/함수명/전역변수/중복/매직넘버 개선       |    [x]    |
| 리팩토링 | 대형 함수 분리, 코드스멜 제거                   |    [x]    |
| 리팩토링 | 비즈니스 로직과 UI 분리                         |    [x]    |
| 리팩토링 | 일관된 코딩 스타일/주석 정리                    |    [x]    |

> 각 항목을 구현/점검할 때마다 [ ]를 [x]로 체크하며 진행하세요.

1. 대형 함수 분리/역할 명확화
   handleCalculateCartStuff 함수가 100줄 가까이 되며, UI 갱신, 할인/포인트/재고 계산, DOM 조작이 한 함수에 혼재되어 있습니다.
   개선 제안:
   할인/포인트/재고 계산 로직을 별도의 순수 함수(예: calculateCartSummary, getDiscountInfo, getPointInfo)로 분리
   UI 갱신(HTML 문자열 생성, DOM 업데이트)도 별도 함수로 분리
   이렇게 하면 테스트와 유지보수가 쉬워집니다.
2. 비즈니스 로직과 UI 코드 분리
   할인/포인트/재고 계산이 DOM 조작과 섞여 있습니다.
   개선 제안:
   계산 결과(예: 할인율, 포인트, 재고 메시지 등)를 객체로 반환하는 순수 함수로 분리
   UI 함수는 이 결과를 받아서 DOM만 갱신하도록 역할을 명확히 분리
3. 네이밍/역할 명확화
   handleCalculateCartStuff 등 함수명이 너무 포괄적입니다.
   개선 제안:
   updateCartSummaryUI, calculateCartTotals, renderCartSummary 등 역할이 명확한 이름으로 변경
4. 중복/매직넘버 제거
   상수는 잘 분리되어 있으나, 일부 DOM id/class 문자열, 텍스트 등은 하드코딩되어 있습니다.
   개선 제안:
   자주 쓰이는 DOM id/class, 텍스트는 상수 또는 별도 config로 분리
5. 테스트 용이성/순수 함수화
   많은 로직이 DOM에 의존적이어서 단위 테스트가 어렵습니다.
   개선 제안:
   계산/비즈니스 로직은 입력(상품/수량/날짜 등) → 출력(할인/포인트/메시지 등)만 다루는 순수 함수로 분리
   UI 함수는 이 결과를 받아서 DOM만 갱신
6. 기타
   이벤트 핸들러 내에서 익명 함수가 많아 추적이 어렵고, 중첩이 깊어질 수 있습니다.
   개선 제안:
   주요 이벤트 핸들러도 별도 함수로 분리

main 함수 역할별 분리 → 2. 이벤트 핸들러 함수화 → 3. 상수/매직넘버 정리
이후 상태 관리, 유틸/컴포넌트화, 타입/주석, 에러처리 등 점진적으로 적용
