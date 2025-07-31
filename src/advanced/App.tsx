import React, { useState } from 'react';

import ShoppingCart from './components/cart/ShoppingCart';
import GuideToggle from './components/guide/GuideToggle';
import Header from './components/layout/Header';
import OrderSummary from './components/order/OrderSummary';
import type { Product } from './types';

const initialProducts: Product[] = [];
const initialCartItems: { productId: string; quantity: number }[] = [];

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [cartItems, setCartItems] = useState<{ productId: string; quantity: number }[]>(initialCartItems);

  // 예시: 장바구니/상품 데이터는 실제 로직에 맞게 fetch/추가/삭제 구현 필요

  return (
    <>
      <Header itemCount={cartItems.length} />
      <div id="app" className="max-w-screen-xl h-screen max-h-800 p-0 flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden">
          <div className="flex-1 min-w-0 flex flex-col h-full min-h-0 bg-white border border-gray-200 p-8 overflow-y-auto">
            <GuideToggle />
            <ShoppingCart products={products} cartItems={cartItems} setCartItems={setCartItems} />
          </div>
          <OrderSummary
            summary={{
              itemCnt: cartItems.length,
              subTot: 0, // 실제 계산 로직 필요
              totalAmt: 0, // 실제 계산 로직 필요
              discRate: 0,
              savedAmount: 0,
              itemDiscounts: [],
              isTuesday: false,
              stockMsg: '',
              points: 0,
              pointDetails: '',
              products,
              cartItems,
            }}
          />
        </div>
      </div>
    </>
  );
};

export default App;
