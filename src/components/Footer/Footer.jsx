import React from 'react';
import '../../styles/Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* 왼쪽: 로고 + 약관 */}
        <div className="footer-left">
          <img src="/assets/WAPPENABLE.png" alt="Wappenable Logo" className="footer-logo" />
          <ul>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/terms">Terms of Services</a></li>
          </ul>
        </div>

        {/* 오른쪽: Learn + Company + Connect */}
        <div className="footer-right">
          <div className="footer-section">
            <h4>Learn</h4>
            <a href="/create">Create</a>
            <a href="/collect">Collect</a>
            <a href="/">buy</a>
          </div>

          <div className="footer-section">
            <h4>Company</h4>
            <a href="/careers">Team</a>
            <a href="/help">Help Center</a>
            <a href="/subscribe">Subscribe</a>
          </div>

          <div className="footer-section">
            <h4>Connect</h4>
            <a href="https://twitter.com" target="_blank" rel="noreferrer">Twitter</a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer">Youtube</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
