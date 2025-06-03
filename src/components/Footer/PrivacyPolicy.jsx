import React from 'react';
import '../../styles/StaticPageStyle.css';

export default function PrivacyPolicy() {
  return (
    <div className="page-container">
      <h1>개인정보 처리방침</h1>
      <p>
        WAPPENABLE은(는) 개인정보보호법에 따라 이용자의 개인정보를 보호하고, 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 다음과 같은 처리방침을 수립·공개합니다.
      </p>
      <h2>1. 개인정보 수집 항목</h2>
      <ul>
        <li>필수: 이메일, 비밀번호, 이름, 휴대전화번호</li>
        <li>선택: 주소, 생년월일, 결제 정보 등</li>
      </ul>
      <h2>2. 개인정보의 수집 및 이용 목적</h2>
      <ul>
        <li>회원 가입 및 관리</li>
        <li>상품 주문 및 결제, 배송</li>
        <li>이벤트 및 마케팅 활용 (선택 동의 시)</li>
      </ul>
      <h2>3. 개인정보 보유 및 이용 기간</h2>
      <p>이용자가 회원 탈퇴 시까지 또는 법령이 정한 기간 동안 보유합니다.</p>
      <h2>4. 제3자 제공 및 위탁</h2>
      <p>회사는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다. 다만, 배송 등 서비스 수행에 필요한 경우 별도 동의를 받아 위탁할 수 있습니다.</p>
      <h2>문의처</h2>
      <p>문의: privacy@wappenable.com / 010-1234-5678</p>
    </div>
  );
}