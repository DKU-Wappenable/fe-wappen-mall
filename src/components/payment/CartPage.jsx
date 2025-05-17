import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import axiosInstance from '../api/axiosInstance'; // 📝 서버 연동 시 사용

export default function CartPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('cart') || '[]');
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const synced = saved.map(item => {
      const updated = products.find(p => p.id === item.product.id);
      return updated ? { ...item, product: updated } : item;
    });
    setCartItems(synced);
    localStorage.setItem('cart', JSON.stringify(synced));

    // 📝 서버 연동 시:
    // axiosInstance.get('/cart').then(res => setCartItems(res.data));
  }, []);

  const updateQuantity = (id, amount) => {
    const updated = cartItems.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item
    );
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));

    // 📝 서버 연동 시:
    // axiosInstance.put(`/cart/${id}`, { quantity: newQty });
  };

  const removeItem = (id) => {
    const filtered = cartItems.filter(item => item.id !== id);
    setCartItems(filtered);
    localStorage.setItem('cart', JSON.stringify(filtered));

    // 📝 서버 연동 시:
    // axiosInstance.delete(`/cart/${id}`);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return alert('장바구니가 비어 있습니다.');

    const orders = cartItems.map(item => ({
      id: Date.now() + Math.random(),
      product: item.product,
      quantity: item.quantity,
      totalPrice: item.product.price * item.quantity,
      reviewed: false,
      createdAt: new Date().toISOString(),
    }));

    const prevOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    localStorage.setItem('orders', JSON.stringify([...orders, ...prevOrders]));
    localStorage.removeItem('cart');
    navigate('/order/form', { state: { fromCart: true, items: cartItems } });

    // 📝 서버 연동 시:
    /*
    axiosInstance.post('/orders/bulk', orders).then(() => {
      axiosInstance.delete('/cart/clear');
      navigate('/order/complete');
    }).catch(err => console.error(err));
    */
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity, 0
  );

  return (
    <div style={{ padding: '2rem' }}>
      <h2>장바구니</h2>
      {cartItems.length === 0 ? (
        <p>장바구니에 담긴 상품이 없습니다.</p>
      ) : (
        <ul>
          {cartItems.map(item => (
            <li key={item.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
              <img
                src={item.product.images?.[0] || '/placeholder.png'}
                alt={item.product.name}
                style={{ width: '80px', height: '80px', objectFit: 'cover', marginRight: '1rem', borderRadius: '8px' }}
              />
              <div>
                <strong>{item.product.name}</strong> / {item.product.price.toLocaleString()}원
                <br />
                <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                <span style={{ margin: '0 1rem' }}>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                <button onClick={() => removeItem(item.id)} style={{ marginLeft: '1rem' }}>삭제</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <hr />
      <p><strong>총 금액:</strong> {totalPrice.toLocaleString()}원</p>
      <button onClick={handleCheckout} disabled={cartItems.length === 0}>
        결제하기
      </button>
    </div>
  );
}
