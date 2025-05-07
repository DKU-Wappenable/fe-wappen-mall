import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/OrderFormPage.css';

export default function OrderFormPage() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/order/complete');
  };

  return (
    <div className="order-form-container">
      <h2>주문서 작성</h2>
      <form onSubmit={handleSubmit} className="order-form">
        <label>
          수령인 이름
          <input type="text" name="name" required />
        </label>

        <label>
          연락처
          <input type="tel" name="phone" required placeholder="010-1234-5678" />
        </label>

        <label>
          배송지 주소
          <input type="text" name="address" required placeholder="서울시 강남구 ..." />
        </label>

        <label>
          수량
          <input type="number" name="quantity" defaultValue={1} min={1} required />
        </label>

        <label>
          결제 수단
          <select name="payment">
            <option value="card">신용카드</option>
            <option value="bank">무통장입금</option>
            <option value="kakaopay">카카오페이</option>
          </select>
        </label>

        <button type="submit" className="order-submit-btn">
          결제하기
        </button>
      </form>
    </div>
  );
}
