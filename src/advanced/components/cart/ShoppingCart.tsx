import React from 'react';

import type { Product } from '../../types';
import ProductPicker from './ProductPicker';

interface CartItem {
  productId: string;
  quantity: number;
}

interface ShoppingCartProps {
  products: Product[];
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ products, cartItems, setCartItems }) => {
  return (
    <>
      <ProductPicker products={products} cartItems={cartItems} setCartItems={setCartItems} />
      <div id="cart-items">
        {cartItems.map((item) => {
          const product = products.find((p) => p.id === item.productId);
          if (!product) return null;
          return (
            <div
              key={item.productId}
              className="grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0"
            >
              <div className="w-20 h-20 bg-gradient-black relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45" />
              </div>
              <div>
                <h3 className="text-base font-normal mb-1 tracking-tight">{product.name}</h3>
                <p className="text-xs text-black mb-3">₩{product.price.toLocaleString()}</p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() =>
                      setCartItems((prev) =>
                        prev.map((ci) =>
                          ci.productId === item.productId && ci.quantity > 1 ? { ...ci, quantity: ci.quantity - 1 } : ci
                        )
                      )
                    }
                    className="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      setCartItems((prev) =>
                        prev.map((ci) => (ci.productId === item.productId ? { ...ci, quantity: ci.quantity + 1 } : ci))
                      )
                    }
                    className="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg mb-2 tracking-tight tabular-nums">
                  <span className="text-purple-600">₩{(product.price * item.quantity).toLocaleString()}</span>
                </div>
                <button
                  onClick={() => setCartItems((prev) => prev.filter((ci) => ci.productId !== item.productId))}
                  className="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black"
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ShoppingCart;
