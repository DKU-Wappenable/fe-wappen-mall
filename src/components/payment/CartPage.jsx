// src/components/CartPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

export default function CartPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axiosInstance.get('/cart');
        setCartItems(res.data);
      } catch (err) {
        console.warn('서버 실패, 로컬 장바구니로 대체');
        const saved = JSON.parse(localStorage.getItem('cart') || '[]');
        const products = JSON.parse(localStorage.getItem('products') || '[]');
        const synced = saved.map(item => {
          const updated = products.find(p => p.id === item.product.id);
          return updated ? { ...item, product: updated } : item;
        });
        setCartItems(synced);
        localStorage.setItem('cart', JSON.stringify(synced));
      }
    };

    fetchCart();
  }, []);

  const updateQuantity = async (id, amount) => {
    try {
      const item = cartItems.find(i => i.id === id);
      const newQty = Math.max(1, item.quantity + amount);
      await axiosInstance.put(`/cart/${id}`, { quantity: newQty });
      setCartItems(cartItems.map(i => i.id === id ? { ...i, quantity: newQty } : i));
    } catch (err) {
      console.warn('서버 실패, 로컬에서 수량 조정');
      const updated = cartItems.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item
      );
      setCartItems(updated);
      localStorage.setItem('cart', JSON.stringify(updated));
    }
  };

  const removeItem = async (id) => {
    try {
      await axiosInstance.delete(`/cart/${id}`);
      setCartItems(cartItems.filter(item => item.id !== id));
    } catch (err) {
      console.warn('서버 실패, 로컬에서 삭제');
      const filtered = cartItems.filter(item => item.id !== id);
      setCartItems(filtered);
      localStorage.setItem('cart', JSON.stringify(filtered));
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return alert('장바구니가 비어 있습니다.');

    try {
      await axiosInstance.post('/orders/bulk', cartItems);
      await axiosInstance.delete('/cart/clear');
      navigate('/order/complete');
    } catch (err) {
      console.warn('서버 실패, 로컬 주문으로 대체');
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
    }
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
