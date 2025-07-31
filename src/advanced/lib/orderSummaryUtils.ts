import type { Product } from '../types';
import { DISCOUNT_RATES, POINT_RATES } from './constants';

// 상품별 합계 및 개별상품 할인 계산
function calculateCartItemTotals(products: Product[], cartItems: CartItem[]) {
  let subTot = 0;
  const itemDiscounts: { name: string; discount: number }[] = [];
  let totalAmt = 0;
  let itemCnt = 0;
  // 먼저 전체 수량을 계산
  cartItems.forEach((item) => {
    itemCnt += item.quantity;
  });
  // 30개 이상이면 개별상품 할인 계산 X
  const isBulk = itemCnt >= DISCOUNT_RATES.BULK_PURCHASE_THRESHOLD;
  cartItems.forEach((item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) return;
    const q = item.quantity;
    const itemTot = product.discountPrice * q;
    let disc = 0;
    subTot += itemTot;
    if (!isBulk && q >= DISCOUNT_RATES.ITEM_DISCOUNT_THRESHOLD && product.discountRate) {
      disc = product.discountRate;
      if (disc > 0) {
        itemDiscounts.push({ name: product.name, discount: Math.round(disc * 100) });
      }
    }
    totalAmt += itemTot * (1 - disc);
  });
  return { subTot, itemDiscounts, totalAmt, itemCnt };
}

// 대량구매/화요일 할인 계산
function calculateTotalDiscount(subTot: number, totalAmt: number, itemCnt: number, today: Date) {
  const originalTotal = subTot;
  let discRate = 0;
  let tuesdayApplied = false;
  if (itemCnt >= DISCOUNT_RATES.BULK_PURCHASE_THRESHOLD) {
    totalAmt = subTot * (1 - DISCOUNT_RATES.BULK_PURCHASE_RATE);
    discRate = DISCOUNT_RATES.BULK_PURCHASE_RATE;
  } else {
    discRate = subTot > 0 ? (subTot - totalAmt) / subTot : 0;
  }
  const isTuesday = today.getDay() === DISCOUNT_RATES.TUESDAY_DAY;
  if (isTuesday && totalAmt > 0) {
    const tuesdayDiscount = totalAmt * DISCOUNT_RATES.TUESDAY_SPECIAL_RATE;
    totalAmt = totalAmt - tuesdayDiscount;
    discRate = 1 - totalAmt / originalTotal;
    tuesdayApplied = true;
  }
  return { finalTotal: totalAmt, discRate, tuesdayApplied, originalTotal };
}

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
  const today = new Date();
  const { subTot, itemDiscounts, totalAmt, itemCnt } = calculateCartItemTotals(products, cartItems);
  const { finalTotal, discRate, tuesdayApplied, originalTotal } = calculateTotalDiscount(
    subTot,
    totalAmt,
    itemCnt,
    today
  );
  // 포인트 적립 (기본 포인트율 적용)
  const points = Math.floor(finalTotal * POINT_RATES.BASE_POINT_RATE);
  const pointDetails = `결제금액의 ${POINT_RATES.BASE_POINT_RATE * 100}% 적립`;
  return {
    itemCnt,
    subTot,
    totalAmt: finalTotal,
    discRate,
    savedAmount: originalTotal - finalTotal,
    itemDiscounts,
    isTuesday: tuesdayApplied,
    stockMsg: '',
    points,
    pointDetails,
  };
}
