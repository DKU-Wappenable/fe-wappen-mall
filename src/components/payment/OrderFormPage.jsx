// ✅ OrderFormPage.jsx - 서버 연동 + 공유 와펜 대응 결제 처리 리팩토링

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../../components/UserContext';
import axiosInstance from '../../api/axiosInstance';
import '../../styles/OrderFormPage.css';

const IMAGE_BASE_URL = 'http://localhost:8080';

export default function OrderFormPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();

  const isCartOrder = state?.items && Array.isArray(state.items);
  const [items, setItems] = useState([]);

  const [form, setForm] = useState({
    receiver: '',
    receiverPhone1: '',
    receiverPhone2: '',
    address1: '',
    address2: '',
    memo: '',
    paymentMethod: 'CARD',
    agree1: false,
    agree2: false,
  });

  useEffect(() => {
    // 유저 정보로 기본 값 세팅
    if (user) {
      setForm(prev => ({
        ...prev,
        name: user.id || user.name || '',
        email: user.email || '',
      }));
    }

    if (isCartOrder) {
      setItems(state.items);
    } else if (state?.product) {
      setItems([{ product: state.product, quantity: 1 }]);
    } else {
      alert('잘못된 접근입니다.');
      navigate('/');
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async () => {
    if (!form.agree1 || !form.agree2) {
      alert('약관에 모두 동의하셔야 합니다.');
      return;
    }

    try {
      if (items.length === 1) {
        const { product, quantity } = items[0];
        await axiosInstance.post('/orders', {
          paymentMethod: form.paymentMethod,
          deliveryAddress: `${form.address1} ${form.address2}`.trim(),
          deliveryRequest: form.memo,
          items: [
            {
              productId: product.id,
              quantity: quantity
            }
          ]
        });
      } else {
        await axiosInstance.post('/orders/checkout', null, {
          params: {
            address: `${form.address1} ${form.address2}`.trim(),
            requestMessage: form.memo
          }
        });
      }
      alert('주문이 완료되었습니다.');
      navigate('/my-page');
    } catch (err) {
      console.error('주문 실패:', err);
      alert('주문에 실패했습니다.');
    }
  };

  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="order-form-container">
      <div className="order-form-layout">
        <div className="order-form">
          <h2> 주문서 작성</h2>

          <section>
            <h3>1. 주문자 정보</h3>
            <input value="admin" disabled />
            <input value="010-0000-0000" disabled />
          </section>

          <section>
            <h3>2. 배송지 정보</h3>
            <input name="receiver" placeholder="수령인" onChange={handleChange} />
            <input name="receiverPhone1" placeholder="연락처 1" onChange={handleChange} />
            <input name="receiverPhone2" placeholder="연락처 2 (선택)" onChange={handleChange} />
            <input name="address1" placeholder="주소" onChange={handleChange} />
            <input name="address2" placeholder="상세 주소" onChange={handleChange} />
            <input name="memo" placeholder="배송 메모" onChange={handleChange} />
          </section>

          <section>
            <h3>3. 결제 수단</h3>
            <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange}>
              <option value="CARD">신용카드</option>
              <option value="BANK">무통장 입금</option>
              <option value="KAKAO">카카오페이</option>
              <option value="TOSS">토스</option>
            </select>
          </section>

          <section>
            <h3>4. 약관 동의</h3>
            <label>
              <input type="checkbox" name="agree1" onChange={handleChange} /> 구매 동의 (필수)
            </label>
            <label>
              <input type="checkbox" name="agree2" onChange={handleChange} /> 개인정보 수집 동의 (필수)
            </label>
          </section>

          <h2>총 결제 금액: {totalPrice.toLocaleString()}원</h2>
          <button className="submit-btn" onClick={handleSubmit}>결제하기</button>
        </div>

        <div className="order-summary">
          <h3>주문 상품 정보</h3>
          {items.map((item, i) => (
            <div key={i} className="summary-item">
              <img
                src={IMAGE_BASE_URL + item.product.imageUrls?.[0] || '/placeholder.png'}
                alt={item.product.name}
                className="summary-image"
                onError={(e) => (e.target.src = '/placeholder.png')}
              />
              <div>
                <p>{item.product.name}</p>
                {item.product.nickname && (
                  <p style={{ fontSize: '13px', color: '#666' }}>by {item.product.nickname}</p>
                )}
                <p>수량: {item.quantity}개</p>
                <p>금액: {(item.product.price * item.quantity).toLocaleString()}원</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
