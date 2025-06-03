import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function IamportPayment() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { items, amount, buyer, formData, discount } = state || {};

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.iamport.kr/js/iamport.payment-1.2.0.js';
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  const handlePayment = () => {
    const { IMP } = window;
    if (!IMP) {
      alert('아임포트 라이브러리가 로드되지 않았습니다.');
      return;
    }

    IMP.init('imp19424728'); // 테스트용 imp 코드

    let pg = 'html5_inicis.INIpayTest';
    let pay_method = 'card';

    switch (formData.paymentMethod) {
      case '카카오페이':
        pg = 'kakaopay.TC0ONETIME';
        pay_method = 'kakaopay';
        break;
      case '토스':
        pg = 'tosspay.tosstest';
        pay_method = 'tosspay';
        break;
      case '무통장입금':
        alert('무통장입금은 별도 안내가 진행됩니다.');
        navigate('/order/complete');
        return;
      default:
        pg = 'html5_inicis.INIpayTest';
        pay_method = 'card';
    }

    const orderName = items.length === 1
  ? items[0].product.name || '유저디자인'
  : `${items[0].product.name || '유저디자인'} 외 ${items.length - 1}개`;


    IMP.request_pay({
      pg,
      pay_method,
      merchant_uid: `order_${new Date().getTime()}`,
      name: orderName,
      amount: amount || 1000,
      buyer_email: buyer?.email || 'test@example.com',
      buyer_name: buyer?.name || '홍길동',
      buyer_tel: buyer?.phone || '01012345678',
      buyer_addr: buyer?.address || '서울시 테스트구',
      buyer_postcode: '123-456',
      product_desc: orderName,
    }, function (rsp) {
      if (rsp.success) {
        const now = new Date().toISOString();
        const newOrders = items.map(item => ({
          id: Date.now() + Math.random(),
          product: item.product,
          quantity: item.quantity,
          totalPrice: item.product.price * item.quantity,
          reviewed: false,
          createdAt: now,
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          receiver: formData.receiver,
          receiverPhone1: formData.receiverPhone1,
          receiverPhone2: formData.receiverPhone2,
          address1: formData.address1,
          address2: formData.address2,
          memo: formData.memo,
          paymentMethod: formData.paymentMethod,
        }));

        const prevOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        localStorage.setItem('orders', JSON.stringify([...newOrders, ...prevOrders]));

        // 포인트 적립
        const earnedPoint = Math.floor(amount * 0.05);
        const history = JSON.parse(localStorage.getItem('pointHistory') || '[]');
        history.unshift({
          type: '적립',
          amount: earnedPoint,
          date: now.split('T')[0],
          description: `${orderName} 결제 포인트 적립`,
        });
        localStorage.setItem('pointHistory', JSON.stringify(history));

        alert('결제 성공!');
        localStorage.removeItem('cart'); // 장바구니 비우기
        navigate('/order/complete');
      } else {
        alert('결제 실패: ' + rsp.error_msg);
      }
    });
  };

  if (!items || !amount || !buyer) {
    return <div style={{ padding: '2rem' }}>❗ 결제 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h2> 아임포트 결제 테스트</h2>
      <h3>총 결제 금액: {amount.toLocaleString()}원</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {items.map((item, i) => (
          <li key={i} style={{ marginBottom: '1rem' }}>
             {item.product.name} - {item.quantity}개 - {(item.product.price * item.quantity).toLocaleString()}원
          </li>
        ))}
      </ul>
      <button
        onClick={handlePayment}
        style={{
          padding: '0.8rem 2rem',
          background: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          fontSize: '16px'
        }}
      >
        결제하기
      </button>
    </div>
  );
}
