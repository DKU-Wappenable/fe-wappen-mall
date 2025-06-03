import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../styles/OrderFormPage.css';

export default function OrderFormPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const isCartOrder = state?.items && Array.isArray(state.items); // 🛒 장바구니 결제 여부
  const [items, setItems] = useState([]);

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
    if (isCartOrder) {
      setItems(state.items);
    } else if (state?.product) {
      setItems([{ product: state.product, quantity: form.quantity }]);
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

    // 단일 상품일 경우 수량 변경 시 반영
    if (!isCartOrder && name === 'quantity') {
      setItems([{ product: state.product, quantity: Number(value) }]);
    }
  };

  const applyCoupon = () => {
    if (form.coupon.trim().toUpperCase() === 'WAPPEN3000') setDiscount(3000);
    else setDiscount(0);
  };

  const handlePayment = () => {
    if (!form.agreeTerms || !form.agreePrivacy) {
      alert('약관에 동의해 주세요.');
      return;
    }

    const totalPrice = items.reduce((sum, item) =>
      sum + item.product.price * item.quantity, 0) - discount;

    const buyer = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      address: `${form.address1} ${form.address2}`,
    };

    navigate('/payment/mock', {
      state: {
        items,
        amount: totalPrice,
        buyer,
        formData: form,
        discount,
      },
    });
  };

  if (items.length === 0) return <div className="order-form-container">상품 정보가 없습니다.</div>;

  const productTotal = items.reduce((sum, item) =>
    sum + item.product.price * item.quantity, 0);
  const totalPrice = productTotal - discount;

  return (
    <div className="order-form-container">
      <h2>📝 주문서 작성</h2>
      <div className="order-content">
        <div className="order-form-section">
          <section>
            <h3>1. 주문자 정보</h3>
            <div className="input-group">
              <input name="name" placeholder="이름" value={form.name} onChange={handleChange} />
              <input name="phone" placeholder="연락처" value={form.phone} onChange={handleChange} />
              <input name="email" placeholder="이메일" value={form.email} onChange={handleChange} />
            </div>
          </section>

          <section>
            <h3>2. 배송지 정보</h3>
            <div className="input-group">
              <input name="receiver" placeholder="수령인" value={form.receiver} onChange={handleChange} />
              <input name="receiverPhone1" placeholder="연락처 1" value={form.receiverPhone1} onChange={handleChange} />
              <input name="receiverPhone2" placeholder="연락처 2 (선택)" value={form.receiverPhone2} onChange={handleChange} />
              <input name="address1" placeholder="주소" value={form.address1} onChange={handleChange} />
              <input name="address2" placeholder="상세 주소" value={form.address2} onChange={handleChange} />
              <input name="memo" placeholder="배송 메모" value={form.memo} onChange={handleChange} />
            </div>
          </section>

          <section>
            <h3>3. 결제 수단</h3>
            <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange}>
              <option value="신용카드">신용카드</option>
              <option value="카카오페이">카카오페이</option>
              <option value="토스">토스</option>
              <option value="무통장입금">무통장 입금</option>
              <option value="네이버페이">네이버페이</option>
            </select>

            {!isCartOrder && (
              <div className="quantity-wrapper">
                <label htmlFor="quantity">수량</label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  min="1"
                  value={form.quantity}
                  onChange={handleChange}
                  className="quantity-input styled-input"
                />
              </div>
            )}
          </section>

          <section>
            <h3>4. 쿠폰 / 포인트</h3>
            <div className="coupon-group">
              <input
                name="coupon"
                placeholder="쿠폰 코드 입력"
                value={form.coupon}
                onChange={handleChange}
              />
              <button type="button" onClick={applyCoupon} className="coupon-btn">쿠폰 적용</button>
            </div>
            <div className="checkbox-block">
              <input
                type="checkbox"
                name="usePoints"
                checked={form.usePoints}
                onChange={handleChange}
                id="usePoints"
              />
              <label htmlFor="usePoints">포인트 사용하기</label>
            </div>
          </section>

          <section>
            <h3>5. 약관 동의</h3>
            <div className="checkbox-block">
              <input
                type="checkbox"
                id="agreeTerms"
                name="agreeTerms"
                checked={form.agreeTerms}
                onChange={handleChange}
              />
              <label htmlFor="agreeTerms">구매 동의 (필수)</label>
            </div>
            <div className="checkbox-block">
              <input
                type="checkbox"
                id="agreePrivacy"
                name="agreePrivacy"
                checked={form.agreePrivacy}
                onChange={handleChange}
              />
              <label htmlFor="agreePrivacy">개인정보 수집 동의 (필수)</label>
            </div>
          </section>

          <button className="pay-btn" onClick={handlePayment}>결제하기</button>
        </div>

        <div className="order-summary">
          <h3>주문 상품 정보</h3>
          {items.map((item, i) => (
            <div key={i} className="summary-item">
              <img
                src={item.product.images?.[0] || '/placeholder.png'}
                alt={item.product.name}
                className="summary-img"
                onError={(e) => (e.target.src = '/placeholder.png')}
              />
              <p>{item.product.name}</p>
              <p>수량: {item.quantity}개</p>
              <p>금액: {(item.product.price * item.quantity).toLocaleString()}원</p>
            </div>
          ))}
          {discount > 0 && <p>할인 금액: -{discount.toLocaleString()}원</p>}
          <p><strong>총 결제 금액: {totalPrice.toLocaleString()}원</strong></p>
        </div>
      </div>
    </div>
  );
}
