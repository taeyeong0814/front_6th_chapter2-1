import { CALCULATION_CONSTANTS, DISCOUNT_RATES, QUANTITY_THRESHOLDS } from '../utils/constants.js';
import { calculateBonusPoints } from './useBonusPoints.js';

// 순수 계산 함수: 할인, 포인트, 재고 등 계산만 담당
export function calculateCartSummary(products, cartItems, today = new Date()) {
  let subTot = 0;
  const itemDiscounts = [];
  let discRate = 0;
  let totalAmt = 0;
  let itemCnt = 0;

  // 카트 내 각 상품별 합계 및 할인 계산
  Array.from(cartItems).forEach((cartItem) => {
    const curItem = products.find((p) => p.id === cartItem.id);
    if (!curItem) return;
    const qtyElem = cartItem.querySelector('.quantity-number');
    const q = parseInt(qtyElem.textContent);
    const itemTot = curItem.discountPrice * q;
    let disc = 0;
    itemCnt += q;
    subTot += itemTot;
    // 할인율 적용
    if (q >= QUANTITY_THRESHOLDS.ITEM_DISCOUNT && curItem.discountRate) {
      disc = curItem.discountRate;
      if (disc > 0) {
        itemDiscounts.push({ name: curItem.name, discount: disc * CALCULATION_CONSTANTS.PERCENTAGE_MULTIPLIER });
      }
    }
    totalAmt += itemTot * (1 - disc);
  });

  // 대량구매 할인
  const originalTotal = subTot;
  if (itemCnt >= QUANTITY_THRESHOLDS.BULK_PURCHASE) {
    totalAmt = subTot * (1 - DISCOUNT_RATES.BULK_PURCHASE_RATE);
    discRate = DISCOUNT_RATES.BULK_PURCHASE_RATE;
  } else {
    discRate = subTot > 0 ? (subTot - totalAmt) / subTot : 0;
  }

  // 화요일 추가 할인
  const isTuesday = today.getDay() === DISCOUNT_RATES.TUESDAY_DAY;
  let tuesdayApplied = false;
  let tuesdayDiscount = 0;
  if (isTuesday && totalAmt > 0) {
    tuesdayDiscount = totalAmt * DISCOUNT_RATES.TUESDAY_SPECIAL_RATE;
    totalAmt = totalAmt - tuesdayDiscount;
    discRate = 1 - totalAmt / originalTotal;
    tuesdayApplied = true;
  }

  // 포인트 계산
  const { points, details } = calculateBonusPoints({
    cartItems,
    products,
    itemCnt,
    totalAmt,
  });

  // 재고 메시지
  const stockMsg = products.reduce((msg, item) => {
    if (item.quantity < 5) {
      if (item.quantity > 0) {
        return msg + item.name + ': 재고 부족 (' + item.quantity + '개 남음)\n';
      } else {
        return msg + item.name + ': 품절\n';
      }
    }
    return msg;
  }, '');

  return {
    itemCnt,
    subTot,
    totalAmt,
    discRate,
    savedAmount: originalTotal - totalAmt,
    itemDiscounts,
    isTuesday: tuesdayApplied,
    stockMsg,
    points,
    pointDetails: details,
  };
}
