// dom.js - DOM 관련 유틸 함수

/**
 * DOM 엘리먼트에 클래스 추가
 */
export function addClass(el, className) {
  if (el && !el.classList.contains(className)) {
    el.classList.add(className);
  }
}

/**
 * DOM 엘리먼트에서 클래스 제거
 */
export function removeClass(el, className) {
  if (el && el.classList.contains(className)) {
    el.classList.remove(className);
  }
}

/**
 * DOM 엘리먼트 생성 (tag, className)
 */
export function createElement(tag, className = '') {
  const el = document.createElement(tag);
  if (className) el.className = className;
  return el;
}
