// src/pages/OrderDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { useUser } from '../../components/UserContext';
export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const { user } = useUser();
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axiosInstance.get(`/orders/${id}`);
        setOrder(res.data);
      } catch (err) {
        console.warn('서버 오류, 로컬로 대체');
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const found = orders.find(o => o.id.toString() === id.toString());
        setOrder(found);
      }
    };

    fetchOrder();
  }, [id]);

  if (!order) return <div style={{ padding: '2rem' }}>주문 정보를 찾을 수 없습니다.</div>;

  const {
    product, quantity, totalPrice, paymentMethod,
    receiver, receiverPhone1, address1, address2, memo
  } = order;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>주문 상세</h2>
      <p><strong>주문 ID:</strong> {order.id}</p>
      <p><strong>주문 날짜:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
   <p>
  {product.name
    ? `상품: ${product.name}`
    : `유저디자인: ${product.createdBy || product.owner || '알 수 없음'}`}
</p>

      <p><strong>수량:</strong> {quantity}개</p>
      <p><strong>총 결제 금액:</strong> {totalPrice.toLocaleString()}원</p>
      <p><strong>결제 수단:</strong> {paymentMethod || '신용카드'}</p>

      {product.images?.[0] && (
        <div style={{ marginTop: '1rem' }}>
          <p><strong>주문 디자인 미리보기:</strong></p>
          <img
            src={product.images[0]}
            alt="커스터마이징 이미지"
            style={{
              width: '200px',
              border: '1px solid #ccc',
              borderRadius: '8px',
              marginTop: '8px'
            }}
          />
        </div>
      )}

      <hr style={{ margin: '2rem 0' }} />
      <h3>배송 정보</h3>
      <p><strong>수령인:</strong> {receiver}</p>
      <p><strong>연락처:</strong> {receiverPhone1}</p>
      <p><strong>주소:</strong> {address1} {address2}</p>
      <p><strong>배송 메모:</strong> {memo || '(없음)'}</p>

      <button onClick={() => navigate('/my-page')} style={{ marginTop: '1.5rem' }}>
        ← 마이페이지로 돌아가기
      </button>
    </div>
  );
}
