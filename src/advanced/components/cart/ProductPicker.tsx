import React, { useState } from 'react';

import type { Product } from '../../types';

interface CartItem {
  productId: string;
  quantity: number;
}

interface ProductPickerProps {
  products: Product[];
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

const ProductPicker: React.FC<ProductPickerProps> = ({ products, cartItems, setCartItems }) => {
  const [selectedId, setSelectedId] = useState(products[0]?.id || '');
  const [error, setError] = useState('');

  const handleAddToCart = () => {
    const product = products.find((p) => p.id === selectedId);
    if (!product) return;
    // 장바구니에 담긴 수량
    const cartItem = cartItems.find((item) => item.productId === selectedId);
    const cartQty = cartItem ? cartItem.quantity : 0;
    const availableQty = product.quantity - cartQty;
    if (availableQty <= 0) {
      setError(`${product.name}: 품절`);
      return;
    }
    setError('');
    setCartItems((prev) => {
      const exist = prev.find((item) => item.productId === selectedId);
      if (exist) {
        // 재고 초과 방지
        if (product.quantity - exist.quantity <= 0) {
          setError(`${product.name}: 재고 부족`);
          return prev;
        }
        return prev.map((item) => (item.productId === selectedId ? { ...item, quantity: item.quantity + 1 } : item));
      } else {
        return [...prev, { productId: selectedId, quantity: 1 }];
      }
    });
  };

  return (
    <div className="mb-6 pb-6 border-b border-gray-200">
      <select
        id="product-select"
        className="w-full p-3 border border-gray-300 rounded-lg text-base mb-3"
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
      >
        {products.map((product) => (
          <option key={product.id} value={product.id}>
            {product.name} - {product.price}원
          </option>
        ))}
      </select>
      <button
        className="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all"
        onClick={handleAddToCart}
        disabled={(() => {
          const product = products.find((p) => p.id === selectedId);
          if (!product) return true;
          const cartItem = cartItems.find((item) => item.productId === selectedId);
          const cartQty = cartItem ? cartItem.quantity : 0;
          return product.quantity - cartQty <= 0;
        })()}
      >
        Add to Cart
      </button>
      <div id="stock-status" className="text-xs text-red-500 mt-3 whitespace-pre-line">
        {(() => {
          const product = products.find((p) => p.id === selectedId);
          if (!product) return '';
          const cartItem = cartItems.find((item) => item.productId === selectedId);
          const cartQty = cartItem ? cartItem.quantity : 0;
          if (product.quantity - cartQty <= 0) return `${product.name}: 품절`;
          return error;
        })()}
      </div>
    </div>
  );
};

export default ProductPicker;
