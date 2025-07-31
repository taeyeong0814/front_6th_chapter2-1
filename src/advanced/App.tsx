import React from 'react';

import ShoppingCart from './components/cart/ShoppingCart';
import GuideToggle from './components/guide/GuideToggle';
import Header from './components/layout/Header';
import OrderSummary from './components/order/OrderSummary';

const App: React.FC = () => {
  return (
    <>
      <Header />
      <div id="app" className="max-w-screen-xl h-screen max-h-800 p-0 flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden">
          <div className="flex-1 min-w-0 flex flex-col h-full min-h-0 bg-white border border-gray-200 p-8 overflow-y-auto">
            <GuideToggle />
            <ShoppingCart />
          </div>
          <OrderSummary
            summary={{
              itemCnt: 0,
              subTot: 0,
              totalAmt: 0,
              discRate: 0,
              savedAmount: 0,
              itemDiscounts: [],
              isTuesday: false,
              stockMsg: '',
              points: 0,
              pointDetails: '',
              products: [],
              cartItems: [],
            }}
          />
        </div>
      </div>
    </>
  );
};

export default App;
