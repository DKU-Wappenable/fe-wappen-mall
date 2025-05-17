export default function deleteProductEverywhere(productId, userEmail = '') {
  const idStr = String(productId);
  const keys = ['products', 'sharedWappens', 'liked', 'cart', 'orders'];

  keys.forEach((key) => {
    const raw = localStorage.getItem(key);
    if (!raw) return;
    let parsed = JSON.parse(raw);

    if (key === 'orders') {
      parsed = parsed.map(order => {
        if (String(order.product?.id) === idStr) {
          return {
            ...order,
            product: null,
            reviewed: false,
            review: undefined,
            deleted: true
          };
        }
        return order;
      });
    } else if (key === 'cart') {
      parsed = parsed.filter(c => String(c.product?.id) !== idStr);
    } else if (key === 'products' || key === 'liked' || key === 'sharedWappens') {
      parsed = parsed.filter(p => {
        const allowDuplicate = p.__allowDuplicate || false;
        // ✅ 고유 키와 함께 여러 개 저장된 와펜은 모두 제거 (id가 완전히 일치하지 않아도 고유키 포함된 경우도 제거)
        return allowDuplicate || !(String(p.id) === idStr || String(p.uniqueKey)?.includes(idStr));
      });
    }

    localStorage.setItem(key, JSON.stringify(parsed));
  });

  if (userEmail) {
    const userKey = `savedWappens_${userEmail}`;
    const saved = JSON.parse(localStorage.getItem(userKey) || '[]');
    const filtered = saved.filter(w => String(w.id) !== idStr && !String(w.uniqueKey)?.includes(idStr));
    localStorage.setItem(userKey, JSON.stringify(filtered));
  }

  ['products', 'sharedWappens', 'liked', 'cart', 'orders'].forEach((key) => {
    window.dispatchEvent(new StorageEvent('storage', { key }));
  });
}
