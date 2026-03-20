import React from 'react';
import './StarBorder.css';

const StarBorder = ({ children }) => {
  return (
    <div className="star-border-wrapper">
      <div className="star-border-glow"></div>
      <div className="star-border-content">
        {children}
      </div>
    </div>
  );
};

export default StarBorder;
