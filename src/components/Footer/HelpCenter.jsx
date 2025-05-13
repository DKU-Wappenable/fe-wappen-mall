import React from 'react';
import '../../styles/StaticPageStyle.css';
export default function HelpCenter() {
  return (
    <div className="page-container">
      <h1>고객센터</h1>
      <h2>자주 묻는 질문 (FAQ)</h2>
      <p><strong>Q. 주문 취소는 어떻게 하나요?</strong><br />A. 마이페이지 --- 주문내역에서 직접 취소가 가능합니다.</p>
      <p><strong>Q. 배송은 얼마나 걸리나요?</strong><br />A. 일반적으로 결제일로부터 3~5일 이내에 배송됩니다.</p>
      <p><strong>Q. 반품은 가능한가요?</strong><br />A. 상품 수령 후 7일 이내 고객센터로 문의 바랍니다.</p>
      <h2>고객 문의</h2>
      <p>이메일: help@wappenable.com</p>
      <p>운영시간: 평일 10:00 ~ 18:00</p>
    </div>
  );
}