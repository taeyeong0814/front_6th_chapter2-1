import React, { useState } from 'react';

import type { Product } from '../../types';
import { ProductOptionLabel } from '../../utils/productOption.tsx';

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

  // 선택된 상품 정보 미리 계산
  const selectedProduct = products.find((p) => p.id === selectedId);
  const selectedCartItem = cartItems.find((item) => item.productId === selectedId);
  const selectedCartQty = selectedCartItem ? selectedCartItem.quantity : 0;
  const availableQty = selectedProduct ? selectedProduct.quantity - selectedCartQty : 0;
  const isSelectedSoldOut = availableQty <= 0;

  return (
    <div className="mb-6 pb-6 border-b border-gray-200">
      <select
        id="product-select"
        className="w-full p-3 border border-gray-300 rounded-lg text-base mb-3"
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
      >
        {products.map((product) => {
          const isSoldOut = product.quantity === 0;
          return (
            <option key={product.id} value={product.id} disabled={isSoldOut}>
              <ProductOptionLabel product={product} />
            </option>
          );
        })}
      </select>
      <button
        className="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all"
        onClick={handleAddToCart}
        disabled={isSelectedSoldOut}
      >
        Add to Cart
      </button>
      <div id="stock-status" className="text-xs mt-3 whitespace-pre-line">
        {products.some((p) => p.quantity === 0) ? (
          products
            .filter((p) => p.quantity === 0)
            .map((p) => {
              return <div key={p.id} className="text-red-500">{`${p.name}: 품절`}</div>;
            })
        ) : selectedProduct ? (
          selectedProduct.quantity - selectedCartQty <= 5 ? (
            <span className="text-red-500">{`${selectedProduct.name}: 재고 부족 (${selectedProduct.quantity - selectedCartQty}개 남음)`}</span>
          ) : (
            error
          )
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default ProductPicker;
