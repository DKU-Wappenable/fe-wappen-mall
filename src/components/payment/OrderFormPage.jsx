//  수정된 OrderFormPage.jsx - 무통장입금일 때만 저장하고 결제창 이동 안 함
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [form, setForm] = useState({
    receiver: '',
    receiverPhone1: '',
    receiverPhone2: '',
    address1: '',
    address2: '',
    memo: '',
    paymentMethod: 'CARD',
    coupon: '',
    usePoints: false,
    agreeTerms: false,
    agreePrivacy: false,
    agreeFinancial: false,
    agreeMarketing: false,
    agreeAll: false,
  });
  const [discount, setDiscount] = useState(0);

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

  const handleAgreeAll = (e) => {
    const { checked } = e.target;
    setForm(prev => ({
      ...prev,
      agreeAll: checked,
      agreeTerms: checked,
      agreePrivacy: checked,
      agreeFinancial: checked,
      agreeMarketing: checked,
    }));
  };

  const handleIndividualAgree = (e) => {
    const { name, checked } = e.target;
    const updatedForm = {
      ...form,
      [name]: checked
    };
    
    const allRequired = updatedForm.agreeTerms && updatedForm.agreePrivacy && updatedForm.agreeFinancial;
    const allChecked = allRequired && updatedForm.agreeMarketing;
    
    setForm({
      ...updatedForm,
      agreeAll: allChecked
    });
  };

  const applyCoupon = () => {
    if (form.coupon.trim().toUpperCase() === 'WAPPEN3000') setDiscount(3000);
    else setDiscount(0);
  };

  const handlePayment = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    // 필수 약관 동의 확인
    if (!form.agreeTerms || !form.agreePrivacy || !form.agreeFinancial) {
      alert('필수 약관에 모두 동의해 주세요.');
      setIsProcessing(false);
      return;
    }

    const productTotal = items.reduce((sum, item) =>
      sum + item.product.price * item.quantity, 0);
    const totalPrice = productTotal - discount;

    // ✅ 무통장입금이 아닌 경우 실제 주문 생성 API 호출
    if (form.paymentMethod !== 'BANK') {
      try {
        // ✅ 1단계: 약관 동의 저장
        await axiosInstance.put('/users/agree-terms', {
          terms: form.agreeTerms,
          privacy: form.agreePrivacy,
          financial: form.agreeFinancial,
          marketing: form.agreeMarketing,
        });

        // ✅ 2단계: 실제 주문 생성 API 호출
        const orderRequest = {
          items: items.map(item => ({
            productId: item.product.id,
            quantity: item.quantity
          })),
          paymentMethod: form.paymentMethod,
          deliveryAddress: `${form.address1} ${form.address2}`,
          deliveryRequest: form.memo || ''
        };

        const orderResponse = await axiosInstance.post('/orders', orderRequest);
        console.log('✅ 주문 생성 성공:', orderResponse.data);

        // 주문 생성 성공 시 결제 페이지로 이동
        const buyer = {
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: `${form.address1} ${form.address2}`,
        };

        setIsProcessing(false);
        navigate('/payment/mock', {
          state: {
            items,
            amount: totalPrice,
            buyer,
            formData: form,
            discount,
            orderId: orderResponse.data.orderId // 생성된 주문 ID 전달
          }
        });
        return;

      } catch (err) {
        console.warn('주문 생성 실패, 로컬 처리로 fallback:', err);
        // 실패 시 기존 로컬 처리 로직 실행
      }
    }

    // ✅ 무통장입금이거나 API 실패 시 기존 로컬 처리
    if (form.paymentMethod === 'BANK') {
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
      return;
    }

    // 기타 결제 수단 처리
    const buyer = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      address: `${form.address1} ${form.address2}`,
    };

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
            <h4>4. 쿠폰 / 포인트</h4>
            <div className="coupon-row">
              <input name="coupon" placeholder="쿠폰 발행 전입니다! " value={form.coupon} onChange={handleChange} />
              <button type="button" onClick={applyCoupon} className="coupon-btn">적용</button>
            </div>
            <div className="checkbox-row">
              <label htmlFor="usePoints">이벤트 포인트 사용하기(이벤트 기간X)</label>
              <input type="checkbox" id="usePoints" name="usePoints" checked={form.usePoints} onChange={handleChange} />
            </div>
          </section>

          <section>
            <h3>5. 약관 동의</h3>
            <div className="terms-agreement">
              <div className="checkbox-row all-agree">
                <label htmlFor="agreeAll">전체 동의</label>
                <input 
                  type="checkbox" 
                  id="agreeAll" 
                  name="agreeAll" 
                  checked={form.agreeAll} 
                  onChange={handleAgreeAll} 
                />
              </div>
              
              <div className="terms-divider"></div>
              
              <div className="checkbox-row">
                <label htmlFor="agreeTerms">(필수) 이용약관 동의</label>
                <input 
                  type="checkbox" 
                  id="agreeTerms" 
                  name="agreeTerms" 
                  checked={form.agreeTerms} 
                  onChange={handleIndividualAgree} 
                />
              </div>
              <div className="checkbox-row">
                <label htmlFor="agreePrivacy">(필수) 개인정보 수집 및 이용 동의</label>
                <input 
                  type="checkbox" 
                  id="agreePrivacy" 
                  name="agreePrivacy" 
                  checked={form.agreePrivacy} 
                  onChange={handleIndividualAgree} 
                />
              </div>
              <div className="checkbox-row">
                <label htmlFor="agreeFinancial">(필수) 전자금융거래 이용약관 동의</label>
                <input 
                  type="checkbox" 
                  id="agreeFinancial" 
                  name="agreeFinancial" 
                  checked={form.agreeFinancial} 
                  onChange={handleIndividualAgree} 
                />
              </div>
              <div className="checkbox-row">
                <label htmlFor="agreeMarketing">(선택) 마케팅 정보 수신 동의</label>
                <input 
                  type="checkbox" 
                  id="agreeMarketing" 
                  name="agreeMarketing" 
                  checked={form.agreeMarketing} 
                  onChange={handleIndividualAgree} 
                />
              </div>
            </div>
          </section>

          <h2>총 결제 금액: {totalPrice.toLocaleString()}원</h2>
          <button className="submit-btn" onClick={handlePayment}>결제하기</button>
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
                  <p style={{ fontSize: '13px', color: '#666' }}>
                    by {user.email}
                  </p>
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
