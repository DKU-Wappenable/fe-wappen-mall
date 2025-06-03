import React, { useEffect, useState } from 'react';
import '../../styles/PointHistory.css';
import axios from '../../api/axiosInstance';

export default function PointHistory() {
  const [history, setHistory] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    // ✅ 우선 localStorage에서 불러옴 (테스트용)
    const saved = JSON.parse(localStorage.getItem('pointHistory') || '[]');

    // ✅ 테스트용 샘플 포인트 더미
    if (saved.length === 0) {
      const dummy = [
        {
          type: '적립',
          amount: 1200,
          date: '2025-05-01',
          description: '테스트상품 주문 포인트 적립',
        },
        {
          type: '사용',
          amount: 1000,
          date: '2025-05-05',
          description: '포인트 사용 - 결제 시 적용',
        }
      ];
      localStorage.setItem('pointHistory', JSON.stringify(dummy));
      setHistory(dummy);
      setTotalPoints(200);
    } else {
      setHistory(saved);
      const total = saved.reduce((sum, item) =>
        item.type === '적립' ? sum + item.amount : sum - item.amount, 0);
      setTotalPoints(total);
    }

    // ✅ 서버 연동 예시 (주석 처리)
    /*
    axios.get('/points/me')
      .then(res => {
        setHistory(res.data.history);
        setTotalPoints(res.data.total);
      })
      .catch(err => console.error('포인트 불러오기 실패', err));
    */
  }, []);

  return (
    <div className="point-history">
      <h3>포인트 내역</h3>
      <p><strong>총 보유 포인트:</strong> {totalPoints.toLocaleString()}P</p>

      <ul>
        {history.length === 0 ? (
          <p>포인트 내역이 없습니다.</p>
        ) : (
          history.map((item, i) => (
            <li key={i} className="point-item">
              <span className="point-type">{item.type}</span>
              <span className={`point-amount ${item.type === '적립' ? 'plus' : 'minus'}`}>
                {item.type === '적립' ? '+' : '-'}{item.amount.toLocaleString()}P
              </span>
              <span className="point-desc">{item.description}</span>
              <span className="point-date">{item.date}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
