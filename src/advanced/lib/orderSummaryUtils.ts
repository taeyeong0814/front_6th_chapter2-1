import type { Product } from '../types';
import { DISCOUNT_RATES, POINT_RATES } from './constants';

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface OrderSummaryResult {
  itemCnt: number;
  subTot: number;
  totalAmt: number;
  discRate: number;
  savedAmount: number;
  itemDiscounts: { name: string; discount: number }[];
  isTuesday: boolean;
  stockMsg: string;
  points: number;
  pointDetails: string;
}

export function calculateOrderSummary(products: Product[], cartItems: CartItem[]): OrderSummaryResult {
  const cartTotalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const today = new Date();
  const isTuesday = today.getDay() === DISCOUNT_RATES.TUESDAY_DAY;
  let subTot = 0;
  let totalAmt = 0;
  let discRate = 0;
  let savedAmount = 0;
  const itemDiscounts: { name: string; discount: number }[] = [];
  let points = 0;
  let pointDetails = '';

  // 상품별 합계 및 할인 계산
  cartItems.forEach((item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) return;
    subTot += product.price * item.quantity;
    if (item.quantity >= DISCOUNT_RATES.ITEM_DISCOUNT_THRESHOLD) {
      itemDiscounts.push({ name: product.name, discount: Math.round(product.discountRate * 100) });
    }
  });

  // 대량구매 할인(30개 이상)
  if (cartTotalCount >= DISCOUNT_RATES.BULK_PURCHASE_THRESHOLD) {
    discRate += DISCOUNT_RATES.BULK_PURCHASE_RATE;
  }

  // 개별 상품별 할인(10개 이상)
  let itemDiscountTotal = 0;
  cartItems.forEach((item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) return;
    if (item.quantity >= DISCOUNT_RATES.ITEM_DISCOUNT_THRESHOLD) {
      itemDiscountTotal += product.price * item.quantity * product.discountRate;
      discRate += product.discountRate / cartItems.length; // 단순 평균
    }
  });

  // 화요일 추가 할인
  let tuesdayDiscount = 0;
  if (isTuesday && subTot > 0) {
    tuesdayDiscount = (subTot - itemDiscountTotal) * DISCOUNT_RATES.TUESDAY_SPECIAL_RATE;
    discRate += DISCOUNT_RATES.TUESDAY_SPECIAL_RATE;
  }

  // 총 할인 금액
  savedAmount = 0;
  if (cartTotalCount >= DISCOUNT_RATES.BULK_PURCHASE_THRESHOLD) {
    savedAmount = subTot * DISCOUNT_RATES.BULK_PURCHASE_RATE;
  } else {
    savedAmount = itemDiscountTotal;
  }
  savedAmount += tuesdayDiscount;

  // 최종 결제 금액
  totalAmt = subTot - savedAmount;
  if (totalAmt < 0) totalAmt = 0;

  // 포인트 적립 (기본 포인트율 적용)
  points = Math.floor(totalAmt * POINT_RATES.BASE_POINT_RATE);
  pointDetails = `결제금액의 ${POINT_RATES.BASE_POINT_RATE * 100}% 적립`;

  return {
    itemCnt: cartItems.length,
    subTot,
    totalAmt,
    discRate,
    savedAmount,
    itemDiscounts,
    isTuesday,
    stockMsg: '',
    points,
    pointDetails,
  };
}
