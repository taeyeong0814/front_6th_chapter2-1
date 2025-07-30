// 순수 함수: 장바구니에 상품 추가 및 재고 감소 로직
// 반환값: { updatedProducts, addResult: { id, isNew, newQty, item, error } | null }
export function addItemToCart(products, cartItems, selectedId) {
  const idx = products.findIndex((p) => p.id === selectedId);
  if (idx === -1) return { updatedProducts: products, addResult: null };
  const product = products[idx];
  if (!product || product.quantity <= 0) return { updatedProducts: products, addResult: null };

  // 카트에 이미 있는지 확인
  let cartQty = 0;
  for (let i = 0; i < cartItems.length; i++) {
    if (cartItems[i].id === selectedId) {
      const qtyElem = cartItems[i].querySelector('.quantity-number');
      cartQty = parseInt(qtyElem.textContent);
      break;
    }
  }

  // 실제 남은 재고(카트에 담긴 수량 + 남은 수량)
  const availableQty = product.quantity + cartQty;
  if (cartQty + 1 > availableQty) {
    return {
      updatedProducts: products,
      addResult: { id: selectedId, isNew: false, newQty: cartQty, item: product, error: 'out-of-stock' },
    };
  }

  // 재고 감소
  const updatedProducts = products.map((p, i) => (i === idx ? { ...p, quantity: p.quantity - 1 } : p));

  return {
    updatedProducts,
    addResult: {
      id: selectedId,
      isNew: cartQty === 0,
      newQty: cartQty + 1,
      item: { ...product, quantity: product.quantity - 1 },
      error: null,
    },
  };
}
