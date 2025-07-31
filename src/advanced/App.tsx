import React, { useState } from 'react';

import ShoppingCart from './components/cart/ShoppingCart';
import GuideToggle from './components/guide/GuideToggle';
import Header from './components/layout/Header';
import OrderSummary from './components/order/OrderSummary';
import { useOrderSummary } from './hooks/useOrderSummary';
import { PRODUCTS } from './lib/product';
import type { Product } from './types';

const initialCartItems: { productId: string; quantity: number }[] = [];

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [cartItems, setCartItems] = useState<{ productId: string; quantity: number }[]>(initialCartItems);

  // 장바구니에 담긴 상품의 총 수량 계산
  const cartTotalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const orderSummary = useOrderSummary(products, cartItems);

  return (
    <>
      <Header itemCount={cartTotalCount} />
      <div id="app" className="max-w-screen-xl h-screen max-h-800 p-0 flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden">
          <div className="flex-1 min-w-0 flex flex-col h-full min-h-0 bg-white border border-gray-200 p-8 overflow-y-auto">
            <GuideToggle />
            <ShoppingCart products={products} cartItems={cartItems} setCartItems={setCartItems} />
          </div>
          <OrderSummary summary={{ ...orderSummary, products, cartItems }} />
        </div>
      </div>
    </>
  );
};

export default App;
