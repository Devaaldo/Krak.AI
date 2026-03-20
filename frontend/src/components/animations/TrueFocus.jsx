import React from 'react';
import './TrueFocus.css';

const TrueFocus = ({ text }) => {
  const words = text.split(' ');

  return (
    <div className="true-focus-wrapper">
      {words.map((word, i) => (
        <span key={i} className="true-focus-word">
          {word}&nbsp;
        </span>
      ))}
    </div>
  );
};

export default TrueFocus;
