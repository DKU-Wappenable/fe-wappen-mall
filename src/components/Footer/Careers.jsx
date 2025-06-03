import React from 'react';
import '../../styles/StaticPageStyle.css';

export default function Careers() {
  return (
    <div className="page-container">
      <h1>채용 안내</h1>
      <p>
        WAPPENABLE과 함께 성장할 인재를 찾습니다. 창의적이고 열정적인 팀원들과 함께 혁신적인 와펜 문화를 만들어갈 분들의 많은 지원 바랍니다.
      </p>
      <h2>모집 부문</h2>
      <ul>
        <li>프론트엔드 개발자 - React 기반 프로젝트 경험자 우대</li>
        <li>UI/UX 디자이너 - Figma, Photoshop 능숙자</li>
        <li>콘텐츠 마케터 - SNS 운영, 콘텐츠 기획 경험자</li>
      </ul>
      <h2>근무 조건</h2>
      <ul>
        <li>근무형태: 정규직 / 인턴</li>
        <li>근무시간: 주 5일 (유연근무 가능)</li>
        <li>근무장소: 서울 성수동</li>
      </ul>
      <h2>지원 방법</h2>
      <p>이력서 및 포트폴리오를 recruit@wappenable.com 으로 제출해주세요.</p>
    </div>
  );
}