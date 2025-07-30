// 순수 함수: 재고 메시지 생성
export function getStockInfoMessage(products) {
  let infoMsg = '';
  products.forEach(function (item) {
    if (item.quantity < 5) {
      if (item.quantity > 0) {
        infoMsg += item.name + ': 재고 부족 (' + item.quantity + '개 남음)\n';
      } else {
        infoMsg += item.name + ': 품절\n';
      }
    }
  });
  return infoMsg;
}
