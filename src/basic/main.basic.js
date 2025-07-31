import { createCartItemElement } from './components/CartItem.js';
import { handleCartItemAction } from './components/CartItemActions.js';
import { CartItemDisplay } from './components/CartItemDisplay.js';
import { renderCartSummaryUI } from './components/CartSummary.js';
import { renderHeader } from './components/Header.js';
import { renderManualOverlay } from './components/ManualOverlay.js';
import { renderOrderSummary } from './components/OrderSummary.js';
import { products } from './data/productList.js';
import { addItemToCart } from './hooks/useAddToCart.js';
import { getUpdatedCartItems } from './hooks/useCartItems.js';
import { calculateCartSummary } from './hooks/useCartSummary.js';
import { DISCOUNT_RATES, TIME_DELAYS } from './utils/constants.js';
import { createElement } from './utils/dom.js';
import { htmlToElement } from './utils/htmlToElement.js';
import { updateSelectOptions } from './utils/updateSelectOptions.js';

function main() {
  // Header 분리된 컴포넌트 사용 (문자열 반환)
  const headerHtml = renderHeader();
  const gridContainer = createElement('div');
  const leftColumn = createElement('div');
  const selectorContainer = createElement('div');
  // OrderSummary 분리된 컴포넌트 사용 (문자열 반환)
  const rightColumnHtml = renderOrderSummary();
  // ManualOverlay 분리된 컴포넌트 사용 (문자열 반환)
  const { manualToggleHtml, manualOverlayHtml } = renderManualOverlay();
  let lastSel = null;

  const root = document.getElementById('app');
  const sel = createElement('select');
  sel.id = 'product-select';
  leftColumn['className'] = 'bg-white border border-gray-200 p-8 overflow-y-auto';
  selectorContainer.className = 'mb-6 pb-6 border-b border-gray-200';
  sel.className = 'w-full p-3 border border-gray-300 rounded-lg text-base mb-3';
  gridContainer.className = 'grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden';
  const addBtn = createElement('button');
  const stockInfo = createElement('div');
  addBtn.id = 'add-to-cart';
  stockInfo.id = 'stock-status';
  stockInfo.className = 'text-xs text-red-500 mt-3 whitespace-pre-line';
  addBtn.innerHTML = 'Add to Cart';
  addBtn.className =
    'w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all';
  selectorContainer.appendChild(sel);
  selectorContainer.appendChild(addBtn);
  selectorContainer.appendChild(stockInfo);
  leftColumn.appendChild(selectorContainer);
  const cartDisp = createElement('div');
  cartDisp.id = 'cart-items';
  leftColumn.appendChild(cartDisp);
  // rightColumn 삽입 (유틸 사용)
  const rightColumnEl = htmlToElement(rightColumnHtml);
  const sum = rightColumnEl.querySelector('#cart-total');
  gridContainer.appendChild(leftColumn);
  gridContainer.appendChild(rightColumnEl);
  // header 문자열을 DOM에 삽입 (유틸 사용)
  const headerEl = htmlToElement(headerHtml);
  root.appendChild(headerEl);
  root.appendChild(gridContainer);
  // ManualOverlay 삽입 (유틸 사용)
  const manualToggleBtn = htmlToElement(manualToggleHtml);
  root.appendChild(manualToggleBtn);
  const manualOverlayDiv = htmlToElement(manualOverlayHtml);
  root.appendChild(manualOverlayDiv);
  // ManualOverlay 이벤트 연결
  manualToggleBtn.addEventListener('click', () => {
    manualOverlayDiv.classList.toggle('hidden');
    const manualColumn = manualOverlayDiv.querySelector('#manual-column');
    manualColumn.classList.toggle('translate-x-full');
  });
  manualOverlayDiv.addEventListener('click', (e) => {
    if (e.target === manualOverlayDiv) {
      manualOverlayDiv.classList.add('hidden');
      const manualColumn = manualOverlayDiv.querySelector('#manual-column');
      manualColumn.classList.add('translate-x-full');
    }
  });
  const manualCloseBtn = manualOverlayDiv.querySelector('#manual-close');
  if (manualCloseBtn) {
    manualCloseBtn.addEventListener('click', () => {
      manualOverlayDiv.classList.add('hidden');
      const manualColumn = manualOverlayDiv.querySelector('#manual-column');
      manualColumn.classList.add('translate-x-full');
    });
  }
  updateSelectOptions(sel, products);
  handleCalculateCartStuff(cartDisp, stockInfo, sum);

  const lightningDelay = Math.random() * TIME_DELAYS.LIGHTNING_SALE_MAX;
  setTimeout(() => {
    setInterval(function () {
      const luckyIdx = Math.floor(Math.random() * products.length);
      const luckyItem = products[luckyIdx];
      if (luckyItem.quantity > 0 && !luckyItem.onSale) {
        luckyItem.discountPrice = Math.round(luckyItem.price * (1 - DISCOUNT_RATES.LIGHTNING_SALE_RATE));
        luckyItem.onSale = true;
        alert('⚡번개세일! ' + luckyItem.name + `이(가) ${DISCOUNT_RATES.LIGHTNING_SALE_RATE * 100}% 할인 중입니다!`);
        updateSelectOptions(sel, products);
        doUpdatePricesInCart(cartDisp, stockInfo, sum);
      }
    }, TIME_DELAYS.LIGHTNING_SALE_INTERVAL);
  }, lightningDelay);

  setTimeout(function () {
    setInterval(function () {
      if (lastSel) {
        const suggest = products.find((p) => p.id !== lastSel && p.quantity > 0 && !p.suggestSale);
        if (suggest) {
          alert(
            '💝 ' +
              suggest.name +
              `은(는) 어떠세요? 지금 구매하시면 ${DISCOUNT_RATES.SUGGEST_SALE_RATE * 100}% 추가 할인!`
          );
          suggest.discountPrice = Math.round(suggest.discountPrice * (1 - DISCOUNT_RATES.SUGGEST_SALE_RATE));
          suggest.suggestSale = true;
          updateSelectOptions(sel, products);
          doUpdatePricesInCart(cartDisp, stockInfo, sum);
        }
      }
    }, TIME_DELAYS.SUGGEST_SALE_INTERVAL);
  }, Math.random() * TIME_DELAYS.SUGGEST_SALE_MAX);
  // addBtn, cartDisp 이벤트 핸들러에 stockInfo 전달
  addBtn.addEventListener('click', function () {
    const selItem = sel.value;
    const { updatedProducts, addResult } = addItemToCart(products, cartDisp.children, selItem);
    if (!addResult) return;

    // 실제 products 배열 업데이트
    products.forEach((p, i) => {
      p.quantity = updatedProducts[i].quantity;
    });

    if (addResult.error === 'out-of-stock') {
      alert('재고가 부족합니다.');
      return;
    }

    // UI 처리 (컴포넌트 분리)
    if (addResult.isNew) {
      const newItem = createCartItemElement(addResult.item, 1);
      cartDisp.appendChild(newItem);
    } else {
      const item = document.getElementById(addResult.item.id);
      if (item) {
        const qtyElem = item.querySelector('.quantity-number');
        qtyElem.textContent = addResult.newQty;
      }
    }
    handleCalculateCartStuff(cartDisp, stockInfo, sum);
    lastSel = selItem;
  });

  cartDisp.addEventListener('click', function (event) {
    handleCartItemAction(
      event,
      products,
      cartDisp,
      updateSelectOptions,
      function () {
        handleCalculateCartStuff(cartDisp, stockInfo, sum);
      },
      sel
    );
  });
}

// 3. 기존 함수는 두 함수만 호출하도록 단순화
function handleCalculateCartStuff(cartDisp, stockInfo, sum) {
  const summary = calculateCartSummary(products, cartDisp.children, new Date());
  renderCartSummaryUI(summary, { cartDisp, stockInfo, sum, products });
}

// UI 적용 함수: 카트 내 상품 UI 업데이트 및 합계 재계산
function doUpdatePricesInCart(cartDisp, stockInfo, sum) {
  const updated = getUpdatedCartItems(cartDisp.children, products);
  updated.forEach(({ cartItem, product }) => {
    CartItemDisplay(cartItem, product);
  });
  handleCalculateCartStuff(cartDisp, stockInfo, sum);
}

main();
