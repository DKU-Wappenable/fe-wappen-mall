import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../components/UserContext';
import '../styles/WappenCustomize.css';

export default function WappenCustomize() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [selectedStrap, setSelectedStrap] = useState(null);
  const [placedWappens, setPlacedWappens] = useState([]);
  const [canvas] = useState({ width: 500, height: 300 });
  const [customText, setCustomText] = useState('');
  const [draggingWappen, setDraggingWappen] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [selectedWappen, setSelectedWappen] = useState(null);
  
  const [wappenList] = useState([
    { id: 1, name: '레드 스타', style: { backgroundColor: '#FF0000', color: '#FFFFFF', borderRadius: '50%', padding: '10px' }, text: '★', category: '기본' },
    { id: 2, name: '블루 하트', style: { backgroundColor: '#0066FF', color: '#FFFFFF', borderRadius: '50%', padding: '10px' }, text: '♥', category: '기본' },
    { id: 3, name: '골드 크라운', style: { backgroundColor: '#FFD700', color: '#000000', borderRadius: '50%', padding: '10px' }, text: '👑', category: '기본' },
    { id: 4, name: '실버 문', style: { backgroundColor: '#C0C0C0', color: '#000000', borderRadius: '50%', padding: '10px' }, text: '☽', category: '기본' },
    { id: 5, name: '레인보우', style: { background: 'linear-gradient(45deg, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #4B0082, #8B00FF)', color: '#FFFFFF', borderRadius: '50%', padding: '10px' }, text: '🌈', category: '특별' },
    { id: 6, name: '커스텀 텍스트', style: { backgroundColor: '#333333', color: '#FFFFFF', borderRadius: '50%', padding: '10px' }, text: 'ABC', category: '텍스트' },
  ]);

  const [strapList] = useState([
    { id: 1, name: '클래식 블랙', color: '#000000', width: 460, height: 80 },
    { id: 2, name: '네이비 와이드', color: '#000080', width: 460, height: 120 },
    { id: 3, name: '레드 슬림', color: '#8B0000', width: 460, height: 60 },
  ]);

  const [categories] = useState(['전체', '기본', '특별', '텍스트']);
  const [activeCategory, setActiveCategory] = useState('전체');

  const handleDragStart = (wappen, e) => {
    e.dataTransfer.setData('wappen', JSON.stringify(wappen));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (!selectedStrap) {
      alert('먼저 스트랩을 선택해주세요!');
      return;
    }
    
    const wappen = JSON.parse(e.dataTransfer.getData('wappen'));
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (wappen.name === '커스텀 텍스트') {
      const text = customText || 'ABC';
      setPlacedWappens([...placedWappens, {
        ...wappen,
        text: text,
        position: { x, y },
        id: Date.now()
      }]);
    } else {
      setPlacedWappens([...placedWappens, {
        ...wappen,
        position: { x, y },
        id: Date.now()
      }]);
    }
  };

  const handleWappenMouseDown = (e, wappen) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setDraggingWappen(wappen);
  };

  const handleCanvasMouseMove = (e) => {
    if (draggingWappen) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setPlacedWappens(placedWappens.map(w => 
        w.id === draggingWappen.id 
          ? { ...w, position: { x, y } }
          : w
      ));
    }
  };

  const handleCanvasMouseUp = () => {
    setDraggingWappen(null);
  };

  const handleSave = () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }
    
    const savedDesign = {
      id: Date.now(),
      strap: selectedStrap,
      wappens: placedWappens.map(wappen => ({
        ...wappen,
        position: {
          x: wappen.position.x,
          y: wappen.position.y
        },
        style: {
          ...wappen.style,
          position: undefined,
          left: undefined,
          top: undefined,
          transform: undefined
        }
      })),
      createdAt: new Date().toISOString()
    };

    // 기존 저장된 디자인들을 가져옵니다
    const savedDesigns = JSON.parse(localStorage.getItem(`savedWappens_${user.email}`) || '[]');
    
    // 새 디자인을 추가합니다
    savedDesigns.push(savedDesign);
    
    // 로컬 스토리지에 저장합니다
    localStorage.setItem(`savedWappens_${user.email}`, JSON.stringify(savedDesigns));
    
    alert('와펜 디자인이 저장되었습니다!');
    navigate('/my-wappens');
  };

  const handleCustomTextChange = (e) => {
    const newText = e.target.value || 'ABC';
    setCustomText(newText);
    
    // 이미 배치된 커스텀 텍스트 와펜들도 업데이트
    setPlacedWappens(placedWappens.map(w => 
      w.name === '커스텀 텍스트' ? { ...w, text: newText } : w
    ));
  };

  return (
    <div className="customize-container">
      <div className="customize-sidebar">
        <h3>스트랩 선택</h3>
        <div className="strap-list">
          {strapList.map(strap => (
            <div
              key={strap.id}
              className={`strap-item ${selectedStrap?.id === strap.id ? 'active' : ''}`}
              onClick={() => setSelectedStrap(strap)}
            >
              <div 
                className="strap-preview"
                style={{
                  backgroundColor: strap.color,
                  width: '100%',
                  height: '30px',
                  borderRadius: '4px'
                }}
              />
              <span>{strap.name}</span>
            </div>
          ))}
        </div>

        <h3 className="mt-4">와펜 선택</h3>
        <div className="text-input-container">
          <input
            type="text"
            value={customText}
            onChange={handleCustomTextChange}
            placeholder="원하는 텍스트를 입력하세요"
            className="custom-text-input"
          />
        </div>
        <div className="category-tabs">
          {categories.map(category => (
            <button
              key={category}
              className={`category-tab ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="wappen-list">
          {wappenList
            .filter(w => activeCategory === '전체' || w.category === activeCategory)
            .map(wappen => (
              <div
                key={wappen.id}
                className="wappen-item"
                draggable
                onDragStart={(e) => handleDragStart(wappen, e)}
              >
                <div className="wappen-preview" style={wappen.style}>
                  {wappen.name === '커스텀 텍스트' ? (customText || 'ABC') : wappen.text}
                </div>
                <span className="wappen-name">{wappen.name}</span>
              </div>
            ))}
        </div>
      </div>

      <div className="customize-main">
        <div className="canvas-container">
          <div
            className="canvas"
            style={{ width: canvas.width, height: canvas.height }}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
          >
            {selectedStrap && (
              <div 
                className="strap"
                style={{
                  backgroundColor: selectedStrap.color,
                  width: selectedStrap.width,
                  height: selectedStrap.height,
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  borderRadius: '8px'
                }}
              />
            )}
            {placedWappens.map(wappen => (
              <div
                key={wappen.id}
                className="placed-wappen"
                style={{
                  ...wappen.style,
                  left: wappen.position.x,
                  top: wappen.position.y,
                  position: 'absolute',
                  transform: 'translate(-50%, -50%)',
                  minWidth: '40px',
                  minHeight: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'move',
                  userSelect: 'none',
                  zIndex: 1
                }}
                onMouseDown={(e) => handleWappenMouseDown(e, wappen)}
              >
                {wappen.text}
              </div>
            ))}
          </div>
        </div>
        <div className="canvas-controls">
          <button className="control-btn" onClick={() => setPlacedWappens([])}>초기화</button>
          <button className="control-btn" disabled={placedWappens.length === 0}>실행취소</button>
          <button 
            className="save-btn" 
            onClick={handleSave}
            disabled={!selectedStrap || placedWappens.length === 0}
          >
            저장하기
          </button>
        </div>
      </div>

      <div className="customize-info">
        <h3>도움말</h3>
        <ul>
          <li>먼저 스트랩을 선택해주세요.</li>
          <li>원하는 와펜을 드래그하여 스트랩 위에 놓아보세요.</li>
          <li>와펜을 드래그하여 위치를 조정할 수 있습니다.</li>
          <li>텍스트 와펜은 직접 텍스트를 입력할 수 있습니다.</li>
          <li>작업이 완료되면 저장 버튼을 눌러주세요.</li>
        </ul>
      </div>
    </div>
  );
} 