import React, { useState } from 'react';
import '../styles/OrderFormPage.css';
import { useNavigate } from 'react-router-dom';

export default function OrderFormPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    requestNote: '',
    name: '',
    phone: '',
    email: '',
    receiver: '',
    receiverPhone1: '',
    receiverPhone2: '',
    address1: '',
    address2: '',
    memo: '',
    coupon: '',
    usePoints: false,
    agreeAll: false,
    agreeTerms: false,
    agreePrivacy: false,
    paymentMethod: '신용카드',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handlePayment = () => {
    if (!form.agreeTerms || !form.agreePrivacy) {
      alert('약관에 동의해 주세요.');
      return;
    }
    navigate('/order/complete');
  };

  return (
    <div className="order-form-container">
      <h2>📝 주문서 작성</h2>

      <section>
        <h3>1. 제작 요청사항</h3>
        <textarea
          name="requestNote"
          placeholder="요청사항이 있다면 작성해주세요"
          value={form.requestNote}
          onChange={handleChange}
        />
      </section>

      <section>
        <h3>2. 주문자 정보</h3>
        <input name="name" placeholder="이름" value={form.name} onChange={handleChange} />
        <input name="phone" placeholder="연락처" value={form.phone} onChange={handleChange} />
        <input name="email" placeholder="이메일" value={form.email} onChange={handleChange} />
      </section>

      <section>
        <h3>3. 배송지 정보</h3>
        <input name="receiver" placeholder="수령인" value={form.receiver} onChange={handleChange} />
        <input name="receiverPhone1" placeholder="연락처 1" value={form.receiverPhone1} onChange={handleChange} />
        <input name="receiverPhone2" placeholder="연락처 2 (선택)" value={form.receiverPhone2} onChange={handleChange} />
        <input name="address1" placeholder="주소" value={form.address1} onChange={handleChange} />
        <input name="address2" placeholder="상세 주소" value={form.address2} onChange={handleChange} />
        <input name="memo" placeholder="배송 메모" value={form.memo} onChange={handleChange} />
      </section>

      <section>
        <h3>4. 쿠폰/포인트 사용</h3>
        <input name="coupon" placeholder="쿠폰 코드 입력" value={form.coupon} onChange={handleChange} />
        <label>
          <input
            type="checkbox"
            name="usePoints"
            checked={form.usePoints}
            onChange={handleChange}
          /> 포인트 사용하기
        </label>
      </section>

      <section>
        <h3>5. 결제수단 선택</h3>
        <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange}>
          <option value="신용카드">신용카드</option>
          <option value="네이버페이">네이버페이</option>
          <option value="카카오페이">카카오페이</option>
          <option value="토스">토스</option>
          <option value="계좌이체">계좌이체</option>
          <option value="무통장 입금">무통장 입금</option>
        </select>
      </section>

      <section>
        <h3>6. 약관 동의</h3>
        <label>
          <input
            type="checkbox"
            name="agreeAll"
            checked={form.agreeAll}
            onChange={(e) => {
              const checked = e.target.checked;
              setForm({
                ...form,
                agreeAll: checked,
                agreeTerms: checked,
                agreePrivacy: checked,
              });
            }}
          /> 전체 동의합니다
        </label>
        <label>
          <input
            type="checkbox"
            name="agreeTerms"
            checked={form.agreeTerms}
            onChange={handleChange}
          /> 구매 동의 (필수)
        </label>
        <label>
          <input
            type="checkbox"
            name="agreePrivacy"
            checked={form.agreePrivacy}
            onChange={handleChange}
          /> 개인정보 수집 동의 (필수)
        </label>
      </section>

      <button className="pay-btn" onClick={handlePayment}>결제하기</button>
    </div>
  );
}
