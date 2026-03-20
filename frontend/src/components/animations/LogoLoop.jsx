import React from 'react';
import './LogoLoop.css';

const LogoLoop = ({ children }) => {
  return (
    <div className="logo-loop-wrapper">
      <div className="logo-loop-track">
        {children}
        {children}
      </div>
    </div>
  );
};

export default LogoLoop;
