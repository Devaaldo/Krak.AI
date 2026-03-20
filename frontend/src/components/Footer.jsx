import React from 'react';
import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="footer-logo">
            <Activity size={20} color="#2563eb" style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
            Krak.AI
          </div>
          <p className="footer-desc">
            Empowering infrastructure management with advanced visual analysis and AI-driven structural integrity assessments.
          </p>
        </div>
        
        <div className="footer-links-group">
          <h4 className="footer-title">Product</h4>
          <Link to="/live" className="footer-link">Live Detection</Link>
          <Link to="/import" className="footer-link">Import Analysis</Link>
          <Link to="/about" className="footer-link">About Technology</Link>
        </div>

        <div className="footer-links-group">
          <h4 className="footer-title">Resources</h4>
          <a href="https://github.com/Devaaldo/Crack-Detection" className="footer-link" target="_blank" rel="noopener noreferrer">GitHub Frontend</a>
          <a href="#" className="footer-link">AI Model Repository</a>
          <a href="#" className="footer-link">Documentation</a>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div>&copy; 2026 Krak.AI. All rights reserved.</div>
        <div>Not for guaranteed structural diagnostics. Consult professional engineers for structural advice.</div>
      </div>
    </footer>
  );
};

export default Footer;
