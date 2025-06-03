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
  const [draggingId, setDraggingId] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState('strap');

  const strapTypes = [
    'strap_green', 'strap_black', 'strap_blue', 'strap_yellow',
    'strap_red', 'strap_orange', 'strap_purple'
  ];

  const wappenTypes = [
    'bear', 'dog', 'panda', 'capybara', 'squirrel', 'soccerball', 'penguin'
  ];

  const handleDrop = (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('type');
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newWappen = { id: Date.now() + Math.random(), type, x, y };
    setWappens(prev => [...prev, newWappen]);
  };

  const handleDragStart = (e, type) => {
    e.dataTransfer.setData('type', type);
  };

  const handleMouseDown = (e, id) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const wappen = wappens.find((w) => w.id === id);
    if (!wappen) return;
    setDraggingId(id);
    setOffset({ x: e.clientX - rect.left - wappen.x, y: e.clientY - rect.top - wappen.y });
  };

  const handleMouseMove = (e) => {
    if (draggingId !== null) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - offset.x;
      const y = e.clientY - rect.top - offset.y;
      setWappens((prev) =>
        prev.map((w) => (w.id === draggingId ? { ...w, x, y } : w))
      );
    }
  };

  const handleMouseUp = () => {
    setDraggingId(null);
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

      const totalPrice = (selectedStrap ? 1000 : 0) + wappens.length * 1000;
      const imageData = canvasImage.toDataURL('image/png');
      const savedDesign = {
        id: Date.now() + Math.random(),
        strap: selectedStrap,
        wappens,
        image: imageData,
        price: totalPrice,
        createdAt: new Date().toISOString(),
        owner: user?.id || 'unknown'  //
      };

      try {
        await axiosInstance.post('/wappens', savedDesign);
        alert('디자인이 서버에 저장되었습니다!');
      } catch {
        const saved = JSON.parse(localStorage.getItem(`savedWappens_${user.id}`) || '[]');
        saved.push(savedDesign);
        localStorage.setItem(`savedWappens_${user.id}`, JSON.stringify(saved));
        alert('디자인이 로컬에 저장되었습니다!');
      }

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
      </div>

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
              <img src={`/assets/${type}.png`} alt={type} />
              <span>{type}</span>
            </div>
          ))}
        </div>
      </div>

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
            <img
              src={`/assets/${selectedStrap}.png`}
              alt={selectedStrap}
              className="strap-on-canvas"
            />
          )}

          {wappens.map((w) => (
            <div
              key={w.id}
              style={{
                position: 'absolute',
                left: w.x - 40,
                top: w.y - 40,
                cursor: 'grab',
                zIndex: 2
              }}
              onMouseDown={(e) => handleMouseDown(e, w.id)}
            >
              <img
                src={`/assets/${w.type}.png`}
                alt={w.type}
                style={{ width: 80, height: 80, pointerEvents: 'none' }}
                draggable={false}
              />
            </div>
          ))}
        </div>

        <div className="canvas-controls">
          <button onClick={handleSave} className="control-btn save-btn">디자인 저장</button>
          <button onClick={() => navigate('/my-wappens')} className="control-btn">나의 와펜 보기</button>
        </div>
      </div>
    </div>
  );
}
