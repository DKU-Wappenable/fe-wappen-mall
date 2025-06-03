//  수정된 OrderFormPage.jsx - 무통장입금일 때만 저장하고 결제창 이동 안 함
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../../components/UserContext';
import '../../styles/OrderFormPage.css';

export default function OrderFormPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  const isCartOrder = state?.items && Array.isArray(state.items);
  const [items, setItems] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    receiver: '', receiverPhone1: '', receiverPhone2: '',
    address1: '', address2: '', memo: '',
    coupon: '', usePoints: false,
    agreeTerms: false, agreePrivacy: false,
    paymentMethod: '신용카드', quantity: 1
  });
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
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
      const localShared = JSON.parse(localStorage.getItem('sharedWappens') || '[]');
      const found = localShared.find((s) => s.id === state.product.id) || {};

      const enriched = {
        ...state.product,
        images: state.product.images?.length ? state.product.images : [state.product.image || '/assets/default.png'],
        name: state.product.name || state.product.title || '유저 디자인',
        nickname: state.product.nickname || state.product.owner || state.product.author || state.product.email || 'user',
        category: state.product.category || (state.product.title ? '유저디자인' : ''),
        ...found
      };

      setItems([{ product: enriched, quantity: form.quantity }]);
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

    if (!isCartOrder && name === 'quantity') {
      setItems([{ product: state.product, quantity: Number(value) }]);
    }
  };

  const applyCoupon = () => {
    if (form.coupon.trim().toUpperCase() === 'WAPPEN3000') setDiscount(3000);
    else setDiscount(0);
  };

  const handlePayment = () => {
    if (isProcessing) return;
    setIsProcessing(true);

    if (!form.agreeTerms || !form.agreePrivacy) {
      alert('약관에 동의해 주세요.');
      setIsProcessing(false);
      return;
    }

    const productTotal = items.reduce((sum, item) =>
      sum + item.product.price * item.quantity, 0);
    const totalPrice = productTotal - discount;

    const buyer = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      address: `${form.address1} ${form.address2}`,
    };

    if (form.paymentMethod === '무통장입금') {
      const now = new Date().toISOString();
      const newOrders = items.map(item => ({
  id: `${Date.now()}_${Math.floor(Math.random() * 1000000)}`,
  product: {
    ...item.product,
    createdBy: item.product.createdBy || user?.email || 'unknown',
  },
  quantity: item.quantity,
  totalPrice: item.product.price * item.quantity,
  reviewed: false,
  createdAt: now,
  name: form.name,
  phone: form.phone,
  email: form.email,
  receiver: form.receiver,
  receiverPhone1: form.receiverPhone1,
  receiverPhone2: form.receiverPhone2,
  address1: form.address1,
  address2: form.address2,
  memo: form.memo,
  paymentMethod: form.paymentMethod,
}));


      const prevOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const filteredNewOrders = newOrders.filter(newOrder =>
        !prevOrders.some(existing => existing.id === newOrder.id)
      );
      const nextOrders = [...filteredNewOrders, ...prevOrders];
      localStorage.setItem('orders', JSON.stringify(nextOrders));

      if (isCartOrder) localStorage.removeItem('cart');

      setIsProcessing(false);
      navigate('/order/complete');
      return; //  반드시 여기서 종료
    }

    setIsProcessing(false);
    navigate('/payment/mock', {
      state: {
        items,
        amount: totalPrice,
        buyer,
        formData: form,
        discount,
      }
    });
  };

  if (items.length === 0) return <div className="order-form-container">상품 정보가 없습니다.</div>;

  const productTotal = items.reduce((sum, item) =>
    sum + item.product.price * item.quantity, 0);
  const totalPrice = productTotal - discount;

  return (
    <div className="order-form-container">
      <div className="order-form-layout">
        <div className="order-form">
          <h2> 주문서 작성</h2>

          <section>
            <h3>1. 주문자 정보</h3>
            <input name="name" placeholder="이름" value={form.name} onChange={handleChange} />
            <input name="phone" placeholder="연락처" value={form.phone} onChange={handleChange} />
            <input name="email" placeholder="이메일" value={form.email} onChange={handleChange} />
          </section>

          <section>
            <h3>2. 배송지 정보</h3>
            <input name="receiver" placeholder="수령인" value={form.receiver} onChange={handleChange} />
            <input name="receiverPhone1" placeholder="연락처 1" value={form.receiverPhone1} onChange={handleChange} />
            <input name="receiverPhone2" placeholder="연락처 2 (선택)" value={form.receiverPhone2} onChange={handleChange} />
            <input name="address1" placeholder="주소" value={form.address1} onChange={handleChange} />
            <input name="address2" placeholder="상세 주소" value={form.address2} onChange={handleChange} />
            <input name="memo" placeholder="배송 메모" value={form.memo} onChange={handleChange} />
          </section>

          <section>
            <h3>3. 결제 수단</h3>
            <div className="horizontal-group">
              <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange}>
                <option value="신용카드">신용카드</option>
                <option value="카카오페이">카카오페이</option>
                <option value="토스">토스</option>
                <option value="무통장입금">무통장 입금</option>
              </select>
              {!isCartOrder && (
                <input type="number" name="quantity" value={form.quantity} onChange={handleChange} min={1} className="quantity-input" />
              )}
            </div>
          </section>

          <section>
            <h3>4. 쿠폰 / 포인트</h3>
            <div className="coupon-row">
              <input name="coupon" placeholder="쿠폰 발행 전입니다! " value={form.coupon} onChange={handleChange} />
              <button type="button" onClick={applyCoupon} className="coupon-btn">X</button>
            </div>
            <div className="checkbox-inline">
              <input type="checkbox" id="usePoints" name="usePoints" checked={form.usePoints} onChange={handleChange} />
              <label htmlFor="usePoints">이벤트 포인트 사용하기(이벤트 기간X) </label>
            </div>
          </section>

          <section>
            <h3>5. 약관 동의</h3>
            <div className="checkbox-group">
              <div className="checkbox-inline">
                <input type="checkbox" id="agreeTerms" name="agreeTerms" checked={form.agreeTerms} onChange={handleChange} />
                <label htmlFor="agreeTerms">구매 동의 (필수)</label>
              </div>
              <div className="checkbox-inline">
                <input type="checkbox" id="agreePrivacy" name="agreePrivacy" checked={form.agreePrivacy} onChange={handleChange} />
                <label htmlFor="agreePrivacy">개인정보 수집 동의 (필수)</label>
              </div>
            </div>
          </section>

          <button className="submit-btn" onClick={handlePayment}>결제하기</button>
        </div>

        <div className="order-summary">
          <h3>주문 상품 정보</h3>
          {items.map((item, i) => (
            <div key={i} className="summary-item">
              <img
                src={item.product.images?.[0] || '/placeholder.png'}
                alt={item.product.name}
                className="summary-image"
                onError={(e) => (e.target.src = '/placeholder.png')}
              />
              <div>
                <p>{item.product.name}</p>
                {item.product.category === '유저디자인' && (
                  <p style={{ fontSize: '13px', color: '#666' }}>
                    by {item.product.createdBy || item.product.owner || item.product.nickname || 'unknown'}
                  </p>
                )}
                <p>수량: {item.quantity}개</p>
                <p>금액: {(item.product.price * item.quantity).toLocaleString()}원</p>
              </div>
            </div>
          ))}

          {discount > 0 && <p>할인 금액: -{discount.toLocaleString()}원</p>}
          <p><strong>총 결제 금액: {totalPrice.toLocaleString()}원</strong></p>
        </div>
      </div>
    </div>
  );
}
