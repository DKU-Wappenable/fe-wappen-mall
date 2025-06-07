// src/components/WappenCustomize.jsx
import React, { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
import axiosInstance from '../api/axiosInstance';
import '../styles/WappenCustomize.css';

export default function WappenCustomize() {
  const { user } = useUser();
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  const [wappens, setWappens] = useState([]);
  const [selectedStrap, setSelectedStrap] = useState(null);
  const [textInputs, setTextInputs] = useState([]);
  const [draggingId, setDraggingId] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState('strap');

  const strapTypes = ['strap_green', 'strap_black', 'strap_blue', 'strap_yellow', 'strap_red', 'strap_orange', 'strap_purple'
    ,'red','orange','yellow','green','blue','deepBlue','purple'];
 const wappenTypes = [
  '강아지', '강아지2', '강아지3', '고슴도치', '고양이', '곰', '곰2', '곰3', '늑대', '다람쥐',
  '달', '도넛', '로고', '로고2', '로고3', '마리오', '무지개', '문어', '번개', '별고양이',
  '사자', '수달', '여우', '외계인', '외계인2', '용', '차', '축구공', '카피바라', '커비',
  '코끼리', '토끼', '톱니', '판다', '펭귄', '펭귄2', '해골', '햄버거', '호랑이', '호랑이2',
  '교수팬더', '총햄스터', '강아지5', '카피바라3', '북극곰', '여우보드', '햄스터', '스키 여우',
  '기타', '여우3', '헤드셋카피바라', '고양이4', '버섯', '꿀벌', '샌드위치', '기린', '케이크', '여우2',
  '코끼리2', '부엉이2', '고양이3', '용2', '나무늘보', '개구리', '부엉이', '고양이2', '강아지4','호랑이3'
];

  // 실제 존재하는 텍스트   이미지 파일 이름 기반 배열
  const textImageTypes = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    'row a', 'row b', 'row d', 'row e', 'row f','row g', 'row h', 'row i', 'row j', 'row k', 'row l', 'row m', 'row n', 'row o', 'row p'
  , 'row q', 'row r', 'row s', 'row t', 'row u', 'row v', 'row w', 'row x', 'row y', 'row z'
  ];

  const handleDrop = (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('type');
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (type.startsWith('text_')) {
      const char = type.replace('text_', '');
      const newTextImg = { id: Date.now() + Math.random(), char, x, y };
      setTextInputs(prev => [...prev, newTextImg]);
    } else {
      const newWappen = { id: Date.now() + Math.random(), type, x, y };
      setWappens(prev => [...prev, newWappen]);
    }
  };

  const handleDragStart = (e, type) => {
    e.dataTransfer.setData('type', type);
  };

  const handleMouseDown = (e, id, type) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const target = (type === 'text' ? textInputs : wappens).find(item => item.id === id);
    if (!target) return;
    setDraggingId({ id, type });
    setOffset({ x: e.clientX - rect.left - target.x, y: e.clientY - rect.top - target.y });
  };

  const handleMouseMove = (e) => {
    if (draggingId) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - offset.x;
      const y = e.clientY - rect.top - offset.y;
      if (draggingId.type === 'text') {
        setTextInputs(prev => prev.map(t => t.id === draggingId.id ? { ...t, x, y } : t));
      } else {
        setWappens(prev => prev.map(w => w.id === draggingId.id ? { ...w, x, y } : w));
      }
    }
  };

  const handleMouseUp = () => setDraggingId(null);

  const handleUndo = () => {
    if (activeTab === 'wappen') {
      setWappens(prev => prev.slice(0, -1));
    } else if (activeTab === 'text-sticker') {
      setTextInputs(prev => prev.slice(0, -1));
    }
  };

  const handleSave = async () => {
    if (!user) return alert('로그인이 필요합니다.');

    try {
      const canvasElement = canvasRef.current;
      const canvasImage = await html2canvas(canvasElement, {
        backgroundColor: '#ffffff',
        useCORS: true,
        scale: 2,
        width: canvasElement.scrollWidth,
        height: canvasElement.scrollHeight
      });

      const strapPrice = selectedStrap ? 500 : 0;
      const wappenPrice = wappens.length * 500;
      const textPrice = textInputs.length * 500;
      const totalPrice = strapPrice + wappenPrice + textPrice;
      const imageData = canvasImage.toDataURL('image/png');

      const savedDesign = {
        id: Date.now() + Math.random(),
        strap: selectedStrap,
        wappens,
        textInputs,
        customizedImageUrl: imageData,
        price: totalPrice,
        createdAt: new Date().toISOString(),
        owner: user?.id || 'unknown',
        title: '커스터마이징 디자인'
      };

      await axiosInstance.post('/custom-images/save', savedDesign);
      alert('디자인이 저장되었습니다!');
      navigate('/my-wappens');
    } catch (err) {
      console.error('저장 실패:', err);
      alert('저장에 실패했습니다.');
    }
  };

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  return (
    <div className="customize-wrapper">
      <p style={{ fontSize: '14px', color: '#666', marginBottom: '12px' }}>
        ✔ 기본 스트랩 1개 500원 / 와펜 1개당 500원으로 가격이 계산됩니다.
      </p>

      <div className="custom-tabs">
        <button className={activeTab === 'strap' ? 'active' : ''} onClick={() => setActiveTab('strap')}>스트랩</button>
        <button className={activeTab === 'wappen' ? 'active' : ''} onClick={() => setActiveTab('wappen')}>와펜</button>
        <button className={activeTab === 'text-sticker' ? 'active' : ''} onClick={() => setActiveTab('text-sticker')}>텍스트 스티커</button>
      </div>

      {(activeTab === 'strap' || activeTab === 'wappen') && (
        <div className="selector-bar-scroll">
          <div className="scroll-wrapper">
            {(activeTab === 'strap' ? strapTypes : wappenTypes).map(type => (
              <div
                key={type}
                className={`thumb-box ${activeTab === 'strap' && selectedStrap === type ? 'selected' : ''}`}
                onClick={activeTab === 'strap' ? () => setSelectedStrap(type) : undefined}
                draggable={activeTab === 'wappen'}
                onDragStart={activeTab === 'wappen' ? (e) => handleDragStart(e, type) : undefined}
              >
                <img src={`/assets/${type}.png`} alt={type} crossOrigin="anonymous" />
                <span>{type}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'text-sticker' && (
        <div className="selector-bar-scroll">
          <div className="scroll-wrapper">
            {textImageTypes.map(type => (
              <div
                key={type}
                className="thumb-box"
                draggable
                onDragStart={(e) => handleDragStart(e, `text_${type}`)}
              >
                <img src={`/assets/text/${type}.png`} alt={type} />
                <span>{type}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="customize-main">
        <div
          className="canvas"
          ref={canvasRef}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {selectedStrap && (
            <img src={`/assets/${selectedStrap}.png`} alt={selectedStrap} className="strap-on-canvas" />
          )}

          {wappens.map(w => (
            <div
              key={w.id}
              style={{ position: 'absolute', left: w.x - 40, top: w.y - 40, cursor: 'grab', zIndex: 2 }}
              onMouseDown={(e) => handleMouseDown(e, w.id, 'wappen')}
            >
              <img src={`/assets/${w.type}.png`} alt={w.type} style={{ width: 80, height: 80, pointerEvents: 'none' }} draggable={false} />
            </div>
          ))}

          {textInputs.map(t => (
            <div
              key={t.id}
              style={{ position: 'absolute', left: t.x - 20, top: t.y - 20, cursor: 'grab', zIndex: 3 }}
              onMouseDown={(e) => handleMouseDown(e, t.id, 'text')}
            >
              <img src={`/assets/text/${t.char}.png`} alt={t.char} style={{ width: 40, height: 40, pointerEvents: 'none' }} draggable={false} />
            </div>
          ))}
        </div>

        <div className="canvas-controls">
          <button onClick={handleSave} className="control-btn save-btn">디자인 저장</button>
          <button onClick={() => navigate('/my-wappens')} className="control-btn">나의 와펜 보기</button>
          <button onClick={handleUndo} className="control-btn">마지막 취소</button>
        </div>
      </div>
    </div>
  );
}
