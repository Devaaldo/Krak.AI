import React from 'react';
import './GradientText.css';

const GradientText = ({ text, className = '' }) => {
  return (
    <span className={`animated-gradient-text ${className}`}>
      {text}
    </span>
  );
};

export default GradientText;
