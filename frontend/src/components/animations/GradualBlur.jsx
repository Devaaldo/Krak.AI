import React from 'react';
import './GradualBlur.css';

const GradualBlur = ({ children }) => {
  return (
    <div className="gradual-blur-container">
      {children}
      <div className="gradual-blur-overlay"></div>
    </div>
  );
};

export default GradualBlur;
