import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../components/UserContext';
import '../styles/Home.css';

export default function Home() {
  const navigate = useNavigate();
  const { user } = useUser();

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="logo-section">
          <h1>WAPPENABLE</h1>
        </div>
      </div>
    </div>
  );
} 