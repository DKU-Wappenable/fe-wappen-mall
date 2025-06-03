// src/components/Login/TermsModal.jsx
import React, { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import "../../styles/TermsModal.css";

export default function TermsModal({ onAgree }) {
  const [checked, setChecked] = useState({
    all: false,
    terms: false,
    privacy: false,
    financial: false,
    marketing: false,
  });

  const [activeDetail, setActiveDetail] = useState(null);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setActiveDetail(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const handleCheck = (key) => {
    if (key === "all") {
      const newState = {
        all: !checked.all,
        terms: !checked.all,
        privacy: !checked.all,
        financial: !checked.all,
        marketing: !checked.all,
      };
      setChecked(newState);
    } else {
      const newChecked = {
        ...checked,
        [key]: !checked[key],
      };
      const requiredAll =
        newChecked.terms && newChecked.privacy && newChecked.financial;
      newChecked.all = requiredAll && newChecked.marketing;
      setChecked(newChecked);
    }
  };

  const isRequiredAllChecked = useMemo(() => {
    return checked.terms && checked.privacy && checked.financial;
  }, [checked]);

  const modalRoot = document.getElementById("modal-root") || document.body;

  const detailContent =
    activeDetail &&
    createPortal(
      <div className="popup-overlay" onClick={() => setActiveDetail(null)}>
        <div className="popup-content" onClick={(e) => e.stopPropagation()}>
          <h3>약관 상세 내용</h3>
          <p>
            {
              {
                terms: "이용 약관에 대한 상세 내용입니다.",
                privacy: "개인정보 수집 및 이용 관련 설명입니다.",
                financial: "전자 금융 거래 약관 관련 설명입니다.",
                marketing: "마케팅 수신 동의 안내입니다.",
              }[activeDetail]
            }
          </p>
          <button className="close-btn" onClick={() => setActiveDetail(null)}>
            닫기
          </button>
        </div>
      </div>,
      modalRoot
    );

  const modalContent = (
    <>
      <div className="terms-modal-overlay">
        <div className="terms-modal">
          <h2>WAPPENABLE 이용약관 동의</h2>
          <p className="subtext">
            WAPPENABLE 서비스 시작 및 가입을 위해 <br />
            정보 제공에 동의해 주세요!
          </p>

          <div className="terms-list">
            <label className={`terms-checkbox all ${checked.all ? "checked" : ""}`}>
              <div className="checkbox-left">
                <input
                  type="checkbox"
                  checked={checked.all}
                  onChange={() => handleCheck("all")}
                />
                <span className="all-label">전체 약관 동의</span>
              </div>
            </label>

             {/* (필수) 이용약관 동의 */}
  <label className="terms-checkbox">
    <div className="checkbox-left">
      <input
        type="checkbox"
        checked={checked.terms}
        onChange={() => handleCheck("terms")}
      />
      <span>(필수) 이용약관 동의</span>
    </div>
    <button className="more-btn" onClick={() => setActiveDetail("terms")}>
      더보기
    </button>
  </label>

  {/* (필수) 개인정보 수집 동의 */}
  <label className="terms-checkbox">
    <div className="checkbox-left">
      <input
        type="checkbox"
        checked={checked.privacy}
        onChange={() => handleCheck("privacy")}
      />
      <span>(필수) 개인정보 수집 동의</span>
    </div>
    <button className="more-btn" onClick={() => setActiveDetail("privacy")}>
      더보기
    </button>
  </label>

  {/* (필수) 전자 금융 거래 이용 약관 동의 */}
  <label className="terms-checkbox">
    <div className="checkbox-left">
      <input
        type="checkbox"
        checked={checked.financial}
        onChange={() => handleCheck("financial")}
      />
      <span>(필수) 전자 금융 거래 이용 약관 동의</span>
    </div>
    <button className="more-btn" onClick={() => setActiveDetail("financial")}>
      더보기
    </button>
  </label>

  {/* (선택) 마케팅 이용 약관 동의 */}
  <label className="terms-checkbox">
    <div className="checkbox-left">
      <input
        type="checkbox"
        checked={checked.marketing}
        onChange={() => handleCheck("marketing")}
      />
      <span>(선택) 이벤트/마케팅 이용 약관 동의</span>
    </div>
    <button className="more-btn" onClick={() => setActiveDetail("marketing")}>
      더보기
    </button>
  </label>
</div>

          <button
            className="next-button"
            disabled={!isRequiredAllChecked}
            onClick={onAgree}
          >
            다음
          </button>
        </div>
      </div>
      {detailContent}
    </>
  );

  return createPortal(modalContent, modalRoot);
}
