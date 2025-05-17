// src/components/pages/Careers.jsx

import React from 'react';
import '../../styles/StaticPageStyle.css';

export default function Careers() {
  return (
    <div className="page-container">
      <h1>팀 소개</h1>
      <p>
        WAPPENABLE은 웹 상에서 사용자들이 직접 와펜(Wappen)을 조합하고 꾸밀 수 있는 기능을 중심으로 만든 커스터마이징 플랫폼입니다.
        우리는 사용자의 개성과 취향을 표현할 수 있는 새로운 문화를 만들어가고 있습니다.
      </p>

      <h2>프로젝트 개요</h2>
      <ul>
        <li>프로젝트명: WAPPENABLE</li>
        <li>특징: 웹 상에서 다양한 와펜을 직접 배치·디자인하고 저장하는 커스터마이징 기능 제공</li>
        <li>기술 스택: React, Node.js, Spring Boot, MySQL 등</li>
      </ul>

      <h2>팀원 구성</h2>
      <ul>
        <li><strong>오승민</strong> - PM (프로젝트 매니저)</li>
        <li><strong>양상훈</strong>, <strong>박재홍</strong> - 백엔드 개발</li>
        <li><strong>서종진</strong> - 프론트엔드 개발</li>
      </ul>

      <h2>참고 사항</h2>
      <p>
        본 프로젝트는 단국대학교 소프트웨어학과 자바3 수업 팀 프로젝트로 진행되었습니다. 실제 상용 수준의 와펜 커머스 웹사이트를 목표로 개발되었으며, 와펜 커스터마이징, 상품 등록/구매, 마이페이지 등 다양한 기능이 구현되어 있습니다.
      </p>
    </div>
  );
}
